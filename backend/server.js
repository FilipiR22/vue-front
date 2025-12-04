import express from 'express';
import sequelize from './database.js';
import recursoRoutes from './routes/recurso.js';
import usuarioRoutes from './routes/usuario.js';
import authRoutes from './routes/auth.js';
import authMiddleware from './middlewares/authMiddleware.js';
import subrecursoRoutes from './routes/subrecurso.js';
import aplicarAssociacoes from './models/associacoes.js';
aplicarAssociacoes();


// Importe os modelos
import Usuario from './models/usuario.js';
import Recurso from './models/recurso.js';
import Subrecurso from './models/subrecurso.js';

// Defina os relacionamentos aqui
Subrecurso.belongsTo(Usuario, { foreignKey: 'idusuario' });
Subrecurso.belongsTo(Recurso, { foreignKey: 'idrecurso' });
Recurso.hasMany(Subrecurso, { foreignKey: 'idrecurso' });
Usuario.hasMany(Subrecurso, { foreignKey: 'idusuario' });

const app = express();
app.use(express.json());

// Rotas de API (protegidas)
app.use('/recurso', authMiddleware, recursoRoutes);

// Rotas de comentários
app.use('/recurso/:idrecurso/subrecurso', authMiddleware, subrecursoRoutes);

// Rotas públicas
app.use('/usuarios', usuarioRoutes);
app.use('/auth', authRoutes);

// Arquivos estáticos (comentado)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, 'public')));

// Rotas para páginas HTML (comentado)
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
// app.get('/Recurso/:idmensagem/comentarios', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'comentarios.html'));
// });

const PORT = 5000;
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
    })
    .catch((err) => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });