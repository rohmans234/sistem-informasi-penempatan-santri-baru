// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_RAHASIA_GONTOR'; 

// Middleware untuk memverifikasi token dan otentikasi
exports.protect = (req, res, next) => {
    // Ambil token dari header (Bearer <token>)
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Tidak ada token otentikasi.' });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Simpan data user ke request object
        req.user = decoded; 
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token tidak valid atau kadaluarsa.' });
    }
};

// Middleware untuk Otorisasi (cek Role)
exports.authorize = (roles = []) => {
    // Jika roles hanya string, ubah menjadi array
    if (typeof roles === 'string') {
        roles = [roles];
    }
    
    return (req, res, next) => {
        // Cek jika role user termasuk dalam role yang diizinkan
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Akses terlarang. Peran user tidak diizinkan.' });
        }
        next();
    };
};