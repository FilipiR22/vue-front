import Usuario from './usuario.js';
import Recurso from './recurso.js';
import Subrecurso from './subrecurso.js';

export default function aplicarAssociacoes() {
    Recurso.belongsTo(Usuario, { foreignKey: 'idusuario' });
    Recurso.hasMany(Subrecurso, { foreignKey: 'idrecurso', onDelete: 'CASCADE' });

    Subrecurso.belongsTo(Usuario, { foreignKey: 'idusuario' });
    Subrecurso.belongsTo(Recurso, { foreignKey: 'idrecurso', onDelete: 'CASCADE' });
}