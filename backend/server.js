import express from 'express';
import sequelize from './database.js';
import recursoRoutes from './routes/recurso.js';
import usuarioRoutes from './routes/usuario.js';
import authRoutes from './routes/auth.js';
import subrecursoRoutes from './routes/subrecurso.js';
import authMiddleware from './middlewares/authMiddleware.js';
import aplicarAssociacoes from './models/associacoes.js';
import cors from 'cors';

aplicarAssociacoes();

const app = express();
app.use(cors({
    origin: '*', // Ou use '*' para qualquer origem
    credentials: true, // Se estiver usando cookies/sessões
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Prefixo para as rotas da API
app.use('/api/recurso', authMiddleware, recursoRoutes);
app.use('/api/subrecurso', authMiddleware, subrecursoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);

const PORT = 5000;
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
    })
    .catch((err) => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });