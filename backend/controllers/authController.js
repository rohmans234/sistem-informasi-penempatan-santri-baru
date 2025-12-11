// controllers/authController.js
const Panitia = require('../models/Panitia');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Ambil secret key dari environment variable
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_RAHASIA_GONTOR'; 

// [1] Pendaftaran Panitia (Hanya untuk inisialisasi awal)
exports.registerPanitia = async (req, res) => {
    const { username, password, role, nama_lengkap } = req.body;
    try {
        // Cek jika username sudah ada
        const existingPanitia = await Panitia.findOne({ where: { username } });
        if (existingPanitia) {
            return res.status(400).json({ message: 'Username sudah terdaftar.' });
        }
        
        // Catatan: Hooks di model akan otomatis melakukan hashing
        const newPanitia = await Panitia.create({
            username,
            password_hash: password, // Akan di-hash oleh hook model
            role,
            nama_lengkap
        });
        
        // Jangan kembalikan password hash ke client!
        const panitiaData = { id_panitia: newPanitia.id_panitia, username: newPanitia.username, role: newPanitia.role };
        res.status(201).json({ message: 'Panitia berhasil didaftarkan.', data: panitiaData });
    } catch (error) {
        console.error('Error registering panitia:', error);
        res.status(500).json({ message: 'Gagal pendaftaran panitia.', error: error.message });
    }
};

// [2] Login Panitia (POST /api/auth/login)
exports.loginPanitia = async (req, res) => {
    const { username, password } = req.body;
    try {
        const panitia = await Panitia.findOne({ where: { username } });

        if (!panitia) {
            return res.status(401).json({ message: 'Username atau password salah.' });
        }

        // Bandingkan password yang diinput dengan password hash di DB
        const isMatch = await panitia.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Username atau password salah.' });
        }

        // Buat payload token
        const payload = {
            id: panitia.id_panitia,
            username: panitia.username,
            role: panitia.role
        };

        // Generate JWT Token (Expire dalam 1 jam)
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login berhasil!',
            token: token,
            panitia: { id: panitia.id_panitia, username: panitia.username, role: panitia.role }
        });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat login.', error: error.message });
    }
};