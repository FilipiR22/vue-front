import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import bcrypt from 'bcrypt';

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    hooks: {
        beforeCreate: async (usuario) => {
            if (usuario.senha) {
                const salt = await bcrypt.genSalt(10);
                usuario.senha = await bcrypt.hash(usuario.senha, salt);
            }
        },
        // Hash da senha antes de atualizar (se a senha foi alterada)
        beforeUpdate: async (usuario) => {
            if (usuario.changed('senha')) {
                const salt = await bcrypt.genSalt(10);
                usuario.senha = await bcrypt.hash(usuario.senha, salt);
            }
        }
    }
});

Usuario.prototype.checkPassword = async function (senha) {
    return await bcrypt.compare(senha, this.senha);
};

export default Usuario;