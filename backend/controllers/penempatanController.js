// controllers/penempatanController.js
const { sequelize } = require('../config/database');
const { runRoundRobinPlacement } = require('../utils/algorithmHelper');
const CalonSantri = require('../models/CalonSantri');
const MasterKampus = require('../models/MasterKampus');
const Penempatan = require('../models/Penempatan');

// [1] EKSEKUSI Algoritma Pemerataan (POST /api/penempatan/run-algorithm)
exports.runPlacementAlgorithm = async (req, res) => {
    // Memerlukan role Super Admin untuk eksekusi
    // Asumsi middleware otorisasi sudah berjalan

    const t = await sequelize.transaction();
    try {
        // 1. Ambil data Santri yang LULUS dan memiliki Rata-rata Nilai
        const santriList = await CalonSantri.findAll({
            where: { 
                status_kelulusan: true, 
                rata_rata_ujian: { [sequelize.Op.ne]: null } // Nilai tidak boleh NULL
            },
            order: [['rata_rata_ujian', 'DESC']], // Urutkan untuk Zig-Zag
            transaction: t
        });

        if (santriList.length === 0) {
            await t.rollback();
            return res.status(400).json({ message: 'Tidak ada santri yang siap ditempatkan.' });
        }
        
        // 2. Ambil data Kampus Aktif dan kuota saat ini
        const kampusList = await MasterKampus.findAll({
            where: { status_aktif: true },
            transaction: t
        });

        if (kampusList.length === 0) {
            await t.rollback();
            return res.status(400).json({ message: 'Tidak ada kampus yang tersedia.' });
        }
        
        // **Opsional: Clear Penempatan Lama**
        // Jika ini adalah proses penempatan ulang, hapus data lama
        await Penempatan.destroy({ where: {}, transaction: t });
        
        // 3. Pisahkan Santri dan Kampus berdasarkan Jenis Kelamin
        const putraSantri = santriList.filter(s => s.jenis_kelamin === 'Laki-laki');
        const putriSantri = santriList.filter(s => s.jenis_kelamin === 'Perempuan');

        const putraKampus = kampusList.filter(k => k.jenis_kelamin === 'Laki-laki');
        const putriKampus = kampusList.filter(k => k.jenis_kelamin === 'Perempuan');

        // 4. Jalankan Algoritma untuk Putra dan Putri secara terpisah
        const resultsPutra = runRoundRobinPlacement(putraSantri, putraKampus);
        const resultsPutri = runRoundRobinPlacement(putriSantri, putriKampus);
        
        const allResults = [...resultsPutra, ...resultsPutri];

        // 5. Insert Hasil Penempatan ke Tabel Penempatan
        await Penempatan.bulkCreate(allResults, { transaction: t });

        // 6. Update Kuota Terisi di MasterKampus
        // Hitung ulang kuota terisi untuk setiap kampus
        const campusUpdatePromises = kampusList.map(async (kampus) => {
            const filledCount = allResults.filter(r => r.id_kampus_tujuan === kampus.id_kampus).length;
            // Gunakan metode 'increment' atau 'update'
            await MasterKampus.update(
                { kuota_terisi: filledCount },
                { where: { id_kampus: kampus.id_kampus }, transaction: t }
            );
        });

        await Promise.all(campusUpdatePromises);

        // Commit transaksi
        await t.commit();
        
        res.status(200).json({ 
            message: 'Algoritma penempatan berhasil dijalankan!', 
            total_placed: allResults.length,
            // Statistik pemerataan (Rata-rata nilai per kampus) bisa dihitung di sini
        });

    } catch (error) {
        await t.rollback();
        console.error("Error executing placement algorithm:", error);
        res.status(500).json({ message: error.message || 'Gagal menjalankan algoritma penempatan.' });
    }
};

// [2] PUBLISH Hasil Penempatan (POST /api/penempatan/publish)
exports.publishResults = async (req, res) => {
    try {
        // Mengubah status publish
        await Penempatan.update(
            { status_publish: true },
            { where: { id_penempatan: { [sequelize.Op.ne]: null } } } // Update semua yang sudah ditempatkan
        );

        res.status(200).json({ 
            message: 'Hasil penempatan berhasil di PUBLISH. Data kini dapat diakses oleh publik.',
        });

    } catch (error) {
        res.status(500).json({ message: 'Gagal mempublikasikan hasil.', error: error.message });
    }
};

// [3] READ Hasil Penempatan Publik (GET /api/public/result/:no_pendaftaran)
exports.getPublicResult = async (req, res) => {
    const { no_pendaftaran } = req.params;
    
    try {
        // Cek status publish global
        const published = await Penempatan.findOne({ where: { status_publish: true } });
        if (!published) {
             return res.status(200).json({ message: 'Pengumuman belum dipublikasikan.' });
        }

        const result = await Penempatan.findOne({
            include: [
                { model: CalonSantri, where: { no_pendaftaran: no_pendaftaran } },
                { model: MasterKampus, attributes: ['nama_kampus'] } // Hanya ambil nama kampus
            ]
        });

        if (!result) {
            return res.status(404).json({ message: 'Nomor pendaftaran tidak ditemukan atau belum ditempatkan.' });
        }

        res.status(200).json({
            nama_santri: result.CalonSantri.nama_lengkap,
            kampus_tujuan: result.MasterKampus.nama_kampus,
            wakil_pengasuh: result.wakil_pengasuh,
            tanggal_penempatan: result.tanggal_penempatan,
        });

    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mencari hasil.', error: error.message });
    }
};

// [4] READ Status Pengumuman Publik (GET /api/public/status)
exports.getPublishStatus = async (req, res) => {
    try {
        const isPublished = await Penempatan.findOne({ where: { status_publish: true } });
        res.status(200).json({ isPublished: !!isPublished });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mendapatkan status publikasi.', error: error.message });
    }
};