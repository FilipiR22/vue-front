import express from 'express';
import sequelize from './database.js';
import recursoRoutes from './routes/recurso.js';
import usuarioRoutes from './routes/usuario.js';
import authRoutes from './routes/auth.js';
import subrecursoRoutes from './routes/subrecurso.js';
import authMiddleware from './middlewares/authMiddleware.js';
import aplicarAssociacoes from './models/associacoes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

aplicarAssociacoes();

const app = express();
app.use(express.json());

// Prefixo para as rotas da API
app.use('/api/recurso', authMiddleware, recursoRoutes);
app.use('/api/subrecurso', authMiddleware, subrecursoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Redirecionar todas as rotas do frontend para o index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = 5000;
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
    })
    .catch((err) => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });