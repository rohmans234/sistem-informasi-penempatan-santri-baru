// routes/penempatanRoutes.js
const express = require('express');
const router = express.Router();
const penempatanController = require('../controllers/penempatanController');
const { protect, authorize } = require('../middleware/authMiddleware');


// --- Endpoints Administrasi (Memerlukan Otentikasi Admin) ---
// Hanya Super Admin yang boleh menjalankan algoritma dan publish
router.post('/run-algorithm', protect, authorize('Super Admin'), penempatanController.runPlacementAlgorithm);
router.post('/publish', protect, authorize('Super Admin'), penempatanController.publishResults);

// --- Endpoint Publik (Tidak perlu Otentikasi) ---
router.get('/public/result/:no_pendaftaran', penempatanController.getPublicResult);
router.get('/public/status', penempatanController.getPublishStatus);

module.exports = router;