// models/CalonSantri.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CalonSantri = sequelize.define('CalonSantri', {
    id_santri: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    no_pendaftaran: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    nama_lengkap: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    jenis_kelamin: {
        type: DataTypes.ENUM('Laki-laki', 'Perempuan'),
        allowNull: false
    },
    // Data Ujian
    nilai_bindonesia: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true // Bisa null sebelum diinput
    },
    nilai_imla: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    nilai_alquran: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    nilai_berhitung: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    rata_rata_ujian: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true // Dihitung oleh backend
    },
    status_kelulusan: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'calon_santri',
    timestamps: true // Menggunakan createdAt dan updatedAt
});

// Hooks/Method untuk menghitung rata-rata bisa ditambahkan di sini

module.exports = CalonSantri;