// models/Panitia.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs'); 

const Panitia = sequelize.define('Panitia', {
    id_panitia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('Super Admin', 'Admin Penempatan', 'Admin Data'),
        allowNull: false
    },
    nama_lengkap: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'panitia',
    timestamps: false,
    hooks: {
        beforeCreate: async (panitia) => {
            if (panitia.password_hash) {
                const salt = await bcrypt.genSalt(10);
                panitia.password_hash = await bcrypt.hash(panitia.password_hash, salt);
            }
        },
        beforeUpdate: async (panitia) => {
             if (panitia.changed('password_hash')) {
                const salt = await bcrypt.genSalt(10);
                panitia.password_hash = await bcrypt.hash(panitia.password_hash, salt);
            }
        }
    }
});
Panitia.prototype.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = Panitia;