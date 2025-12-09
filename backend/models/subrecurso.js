// models/Subrecurso.js (versão atualizada)
import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Subrecurso = sequelize.define('Subrecurso', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    conteudo: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    idusuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idrecurso: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('ativo', 'em_andamentoinativo'),
        defaultValue: 'ativo',
        allowNull: false
    },
    data: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    categoria: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'geral'
    },
    auroe: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'subrecursos'
});

export default Subrecurso;