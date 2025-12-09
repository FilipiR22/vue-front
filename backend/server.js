// server.js
import express from 'express';
import sequelize from './database.js';
import recursoRoutes from './routes/recurso.js';
import usuarioRoutes from './routes/usuario.js';
import authRoutes from './routes/auth.js';
import subrecursoRoutes from './routes/subrecurso.js';
import aplicarAssociacoes from './models/associacoes.js';
import cors from 'cors';

// Aplicar associações entre modelos
aplicarAssociacoes();

const app = express();

// Configuração CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware para parsing JSON
app.use(express.json());

// Middleware para logging de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes); 

// ==================== ROTAS PROTEGIDAS ====================
import authMiddleware from './middlewares/authMiddleware.js';


// ROTAS DE RECURSO (protegidas)
app.use('/api/recursos', authMiddleware, recursoRoutes);

// ROTAS DE SUBRECURSO (protegidas)
app.use('/api/subrecursos', authMiddleware, subrecursoRoutes);

// ROTAS DE USUÁRIO (protegidas - exceto criação talvez)
app.use('/api/usuarios', usuarioRoutes);

// ==================== ROTA DE HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'online',
        timestamp: new Date().toISOString(),
        database: 'connected' // Você pode verificar a conexão com o banco
    });
});

// Middleware de erro global
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err.stack);
    
    // Erro de autenticação JWT
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token inválido ou expirado',
            details: 'Faça login novamente'
        });
    }
    
    // Erro de validação
    if (err.name === 'SequelizeValidationError') {
        return res.status(422).json({
            error: 'Erro de validação',
            details: err.errors.map(e => e.message)
        });
    }
    
    // Erro genérico
    res.status(500).json({
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==================== INICIALIZAÇÃO ====================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Sincronizar banco de dados (alter: true apenas em desenvolvimento)
        await sequelize.sync({ 
            alter: process.env.NODE_ENV === 'development' 
        });
        
        console.log('✅ Banco de dados sincronizado');
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📡 Endpoints disponíveis:`);
            console.log(`   POST   http://localhost:${PORT}/api/auth/login`);
            console.log(`   GET    http://localhost:${PORT}/api/recursos`);
            console.log(`   POST   http://localhost:${PORT}/api/recursos`);
            console.log(`   GET    http://localhost:${PORT}/api/subrecursos`);
            console.log(`   POST   http://localhost:${PORT}/api/subrecursos`);
            console.log(`   GET    http://localhost:${PORT}/api/health`);
        });
    } catch (err) {
        console.error('❌ Erro ao iniciar servidor:', err);
        process.exit(1);
    }
};

startServer();

export default app;