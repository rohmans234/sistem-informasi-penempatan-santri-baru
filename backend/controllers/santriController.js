// controllers/santriController.js
const CalonSantri = require('../models/CalonSantri');
const { calculateAverage } = require('../utils/calculationHelper');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
// Catatan: Untuk Import CSV/Excel di dunia nyata, kita akan menggunakan 'multer' dan 'csv-parser'. 
// Kita simulasikan operasi import di sini.

// [1] READ All Santri (GET /api/santri)
exports.getAllSantri = async (req, res) => {
    // Implementasi pagination dan filtering di sini
    const { gender, keyword } = req.query;
    const whereClause = {};

    if (gender) {
        whereClause.jenis_kelamin = gender;
    }
    if (keyword) {
        whereClause[Op.or] = [
            { nama_lengkap: { [Op.iLike]: `%${keyword}%` } }, // Case-insensitive search (PostgreSQL)
            { no_pendaftaran: { [Op.iLike]: `%${keyword}%` } }
        ];
    }
    
    try {
        const santriList = await CalonSantri.findAll({
            where: whereClause,
            order: [['rata_rata_ujian', 'DESC'], ['no_pendaftaran', 'ASC']]
        });
        res.status(200).json(santriList);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data santri.', error: error.message });
    }
};

// [2] UPDATE Nilai Ujian (PUT /api/santri/:id/nilai)
exports.updateSantriNilai = async (req, res) => {
    const { id } = req.params;
    const { nilai_bindonesia, nilai_imla, nilai_alquran, nilai_berhitung } = req.body;
    
    // Validasi nilai harus antara 0 dan 100
    const nilaiValid = [nilai_bindonesia, nilai_imla, nilai_alquran, nilai_berhitung].every(n => n >= 0 && n <= 100);

    if (!nilaiValid) {
        return res.status(400).json({ message: 'Nilai ujian harus dalam rentang 0 hingga 100.' });
    }
    
    try {
        const santri = await CalonSantri.findByPk(id);

        if (!santri) {
            return res.status(404).json({ message: 'Data santri tidak ditemukan.' });
        }
        
        // Update data nilai
        await santri.update({
            nilai_bindonesia,
            nilai_imla,
            nilai_alquran,
            nilai_berhitung,
            // Rata-rata akan dihitung di langkah berikutnya (atau hook)
        });

        // Hitung dan update rata-rata
        const rata_rata_ujian = calculateAverage(santri.dataValues);
        await santri.update({ rata_rata_ujian });
        
        res.status(200).json({ 
            message: 'Nilai ujian dan rata-rata berhasil diperbarui.', 
            data: santri 
        });

    } catch (error) {
        console.error("Error updating santri score:", error);
        res.status(500).json({ message: 'Gagal memperbarui nilai santri.', error: error.message });
    }
};

// [3] SIMULASI Import Data Santri (POST /api/santri/import)
// Dalam implementasi nyata, ini akan membaca file dan memproses data.
exports.importSantriData = async (req, res) => {
    const santriDataArray = req.body.data; // Menerima array data santri dari request body
    
    if (!Array.isArray(santriDataArray) || santriDataArray.length === 0) {
        return res.status(400).json({ message: 'Body request harus berupa array data santri.' });
    }

    const transaction = await sequelize.transaction();
    let successCount = 0;
    
    try {
        for (const data of santriDataArray) {
            // Hanya buat data dasar, nilai ujian diinput terpisah
            await CalonSantri.create({
                no_pendaftaran: data.no_pendaftaran,
                nama_lengkap: data.nama_lengkap,
                jenis_kelamin: data.jenis_kelamin,
                asal_sekolah: data.asal_sekolah,
                status_kelulusan: true, // Asumsi data yang diimport adalah yang sudah lulus
            }, { transaction });
            successCount++;
        }

        await transaction.commit();
        res.status(201).json({ 
            message: `${successCount} data santri berhasil diimport.`,
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Error during batch import:", error);
        res.status(500).json({ message: 'Gagal mengimport data. Periksa duplikasi No. Pendaftaran.', error: error.message });
    }
};