// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Endpoint untuk registrasi (Hanya digunakan Super Admin atau sekali di awal)
router.post('/register', authController.registerPanitia); 

// Endpoint utama Login
router.post('/login', authController.loginPanitia);

module.exports = router;