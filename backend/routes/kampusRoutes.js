// routes/kampusRoutes.js
const express = require('express');
const router = express.Router();
const kampusController = require('../controllers/kampusController');
const { protect, authorize } = require('../middleware/authMiddleware');


router.use(protect);
router.use(authorize('Super Admin', 'Admin Penempatan'));

router.post('/', kampusController.createKampus);
router.get('/', kampusController.getAllKampus);
router.put('/:id', kampusController.updateKampus);
router.delete('/:id', kampusController.deleteKampus);

module.exports = router;