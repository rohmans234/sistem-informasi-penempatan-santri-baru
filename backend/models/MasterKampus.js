// models/MasterKampus.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MasterKampus = sequelize.define('MasterKampus', {
    id_kampus: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_kampus: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    jenis_kelamin: {
        type: DataTypes.ENUM('Laki-laki', 'Perempuan'),
        allowNull: false
    },
    kapasitas_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    kuota_pelajar_baru: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    kuota_terisi: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    status_aktif: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    tanggal_dibuat: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'master_kampus',
    timestamps: false
});

module.exports = MasterKampus;