// routes/santriRoutes.js
const express = require('express');
const router = express.Router();
const santriController = require('../controllers/santriController');


// TODO: Tambahkan middleware otentikasi/otorisasi (Admin Penempatan)

router.get('/', santriController.getAllSantri);
router.post('/import', santriController.importSantriData);
router.put('/:id/nilai', santriController.updateSantriNilai);

// Opsional: GET Santri by ID, PUT/DELETE Santri (CRUD dasar)
// router.get('/:id', santriController.getSantriById); 
// router.delete('/:id', santriController.deleteSantri); 

module.exports = router;