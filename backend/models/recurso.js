// models/Recurso.js (versão atualizada)
import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Recurso = sequelize.define('Recurso', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 200]
        }
    },
    autor: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    conteudo: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [10, 5000]
        }
    },
    categoria: {  // ← TORNAR OBRIGATÓRIO
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['tecnologia', 'educacao', 'saude', 'negocios', 'entretenimento', 'outros']]
        }
    },
    idusuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo', 'rascunho'),  // ← ADICIONADO 'rascunho'
        defaultValue: 'ativo',
        allowNull: false
    },
    data: {
        type: DataTypes.DATE,
    }
}, {
    timestamps: false,
    tableName: 'recursos'
});

export default Recurso;