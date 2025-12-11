// config/database.js (KODE PERBAIKAN)
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false 
    }
);

async function connectDB() {
    // HAPUS SEMUA REQUIRE MODEL DI SINI! (Ini menyebabkan error melingkar)
    
    try {
        await sequelize.authenticate();
        console.log('✅ Koneksi Database PostgreSQL berhasil!');
        // HAPUS await sequelize.sync({ alter: true }); DI SINI!
    } catch (error) {
        console.error('❌ Gagal koneksi ke database:', error);
        process.exit(1);
    }
}

// EKSPOR SEQUELEZE SECARA TERPISAH
module.exports = { sequelize, connectDB };