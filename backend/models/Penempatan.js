// models/Penempatan.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const CalonSantri = require('./CalonSantri');
const MasterKampus = require('./MasterKampus');

const Penempatan = sequelize.define('Penempatan', {
    id_penempatan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Foreign Keys
    id_santri: {
        type: DataTypes.INTEGER,
        references: {
            model: CalonSantri,
            key: 'id_santri',
        },
        unique: true // Satu santri hanya boleh punya satu penempatan
    },
    id_kampus_tujuan: {
        type: DataTypes.INTEGER,
        references: {
            model: MasterKampus,
            key: 'id_kampus',
        }
    },
    wakil_pengasuh: {
        type: DataTypes.STRING(100),
        allowNull: true // Bisa diisi setelah penempatan
    },
    tanggal_penempatan: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    status_publish: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'penempatan',
    timestamps: false
});

// Definisikan relasi di tingkat model
// Relasi 1:1 (CalonSantri -> Penempatan)
Penempatan.belongsTo(CalonSantri, { foreignKey: 'id_santri' });
CalonSantri.hasOne(Penempatan, { foreignKey: 'id_santri' });

// Relasi 1:M (MasterKampus -> Penempatan)
Penempatan.belongsTo(MasterKampus, { foreignKey: 'id_kampus_tujuan' });
MasterKampus.hasMany(Penempatan, { foreignKey: 'id_kampus_tujuan' });


module.exports = Penempatan;