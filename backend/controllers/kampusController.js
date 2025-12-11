// controllers/kampusController.js
const MasterKampus = require('../models/MasterKampus');

// [1] CREATE Campus (POST /api/kampus)
exports.createKampus = async (req, res) => {
    try {
        const { nama_kampus, jenis_kelamin, kapasitas_total, kuota_pelajar_baru } = req.body;
        
        if (!nama_kampus || !jenis_kelamin || kapasitas_total == null || kuota_pelajar_baru == null) {
            return res.status(400).json({ message: 'Input data wajib diisi.' });
        }

        const newKampus = await MasterKampus.create({
            nama_kampus,
            jenis_kelamin,
            kapasitas_total,
            kuota_pelajar_baru,
            kuota_terisi: 0, // Selalu 0 saat dibuat
            status_aktif: true 
        });

        res.status(201).json({ 
            message: 'Kampus berhasil ditambahkan!', 
            data: newKampus 
        });
    } catch (error) {
        console.error("Error creating campus:", error);
        res.status(500).json({ message: 'Gagal menambahkan kampus.', error: error.message });
    }
};

// [2] READ All Kampus (GET /api/kampus)
exports.getAllKampus = async (req, res) => {
    try {
        const campuses = await MasterKampus.findAll({
            // Urutkan berdasarkan jenis kelamin dan nama
            order: [['jenis_kelamin', 'ASC'], ['nama_kampus', 'ASC']] 
        });
        res.status(200).json(campuses);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data kampus.' });
    }
};

// [3] UPDATE Campus (PUT /api/kampus/:id)
exports.updateKampus = async (req, res) => {
    const { id } = req.params;
    const { kapasitas_total, kuota_pelajar_baru, status_aktif } = req.body;
    
    try {
        const kampus = await MasterKampus.findByPk(id);

        if (!kampus) {
            return res.status(404).json({ message: 'Kampus tidak ditemukan.' });
        }
        
        // VALIDASI KRITIS: Tidak boleh mengurangi kapasitas di bawah jumlah terisi
        const newTotal = kapasitas_total !== undefined ? kapasitas_total : kampus.kapasitas_total;
        const newKuotaBaru = kuota_pelajar_baru !== undefined ? kuota_pelajar_baru : kampus.kuota_pelajar_baru;
        
        if (newTotal < kampus.kuota_terisi || newKuotaBaru < kampus.kuota_terisi) {
             return res.status(400).json({ 
                 message: 'Kapasitas/Kuota tidak boleh lebih kecil dari kuota terisi saat ini (' + kampus.kuota_terisi + ').' 
             });
        }

        // Lakukan update data
        await kampus.update(req.body);

        res.status(200).json({ 
            message: 'Data kampus berhasil diperbarui.', 
            data: kampus 
        });

    } catch (error) {
        console.error("Error updating campus:", error);
        res.status(500).json({ message: 'Gagal memperbarui kampus.' });
    }
};


// [4] DELETE Campus (DELETE /api/kampus/:id)
exports.deleteKampus = async (req, res) => {
    const { id } = req.params;
    try {
        const kampus = await MasterKampus.findByPk(id);

        if (!kampus) {
            return res.status(404).json({ message: 'Kampus tidak ditemukan.' });
        }

        // VALIDASI KRITIS: Hanya boleh dihapus jika kuota terisi 0
        if (kampus.kuota_terisi > 0) {
            return res.status(400).json({ 
                message: 'Kampus tidak dapat dihapus. Masih ada ' + kampus.kuota_terisi + ' santri yang ditempatkan di sini.' 
            });
        }

        await kampus.destroy();
        res.status(200).json({ message: 'Kampus berhasil dihapus.' });

    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus kampus.' });
    }
};