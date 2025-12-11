// server.js (KODE PERBAIKAN)
const express = require('express');

const { connectDB, sequelize } = require('./config/database');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Middleware dasar
app.use(express.json()); 

// Endpoint Test Awal
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Gontor Penempatan API Status: ONLINE', 
        environment: process.env.NODE_ENV || 'development' 
    });
});

// Mulai koneksi database lalu jalankan server
connectDB().then(async () => { // Tambahkan async
    // 2. LOAD SEMUA MODEL DI SINI (Ini MENCEGAH Circular Dependency)
    require('./models/MasterKampus');
    require('./models/Panitia');
    require('./models/CalonSantri');
    require('./models/Penempatan');
    
    // 3. JALANKAN SYNC setelah SEMUA model di-load dan relasi didefinisikan
    await sequelize.sync({ alter: true });
    console.log('✅ Semua model telah disinkronkan.');

    // 4. Definisikan routes
    const kampusRoutes = require('./routes/kampusRoutes');
    const santriRoutes = require('./routes/santriRoutes');
    const penempatanRoutes = require('./routes/penempatanRoutes');
    const authRoutes = require('./routes/authRoutes');

    app.use('/api/auth', authRoutes);
    app.use('/api/kampus', kampusRoutes);
    app.use('/api/santri', santriRoutes);
    app.use('/api/penempatan', penempatanRoutes);


    app.listen(PORT, () => {
        console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Gagal menjalankan server setelah koneksi DB:", err);
});