// routes/recursoRoutes.js
import express from 'express';
import Recurso from '../models/recurso.js';
import Usuario from '../models/usuario.js'; // Importe o modelo Usuario
import authMiddleware from '../middlewares/authMiddleware.js';
import { Op } from 'sequelize';

const router = express.Router();

// ==================== CRIAR RECURSO ====================
router.post('/', authMiddleware, async (req, res) => {
    console.log('=== DEBUG criarRecurso ===');
    console.log('Usuário autenticado:', req.usuario);
    console.log('Body recebido:', req.body);

    const { titulo, conteudo, status = 'ativo', categoria, autor, data } = req.body;

    // Validação dos campos obrigatórios
    const errors = {};
    if (!titulo || !titulo.trim()) errors.titulo = ['Campo obrigatório'];
    if (!conteudo || !conteudo.trim()) errors.conteudo = ['Campo obrigatório'];
    if (!categoria || !categoria.trim()) errors.categoria = ['Campo obrigatório'];
    if (!autor || !autor.trim()) errors.autor = ['Campo obrigatório'];

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({ errors });
    }

    try {
        // Verificar se o usuário existe no banco (opcional mas recomendado)
        const usuarioExiste = await Usuario.findByPk(req.usuario.id);
        if (!usuarioExiste) {
            return res.status(404).json({ 
                error: 'Usuário não encontrado',
                details: 'Usuário não existe no banco de dados'
            });
        }

        // Criar o recurso com todos os campos obrigatórios
        const novoRecurso = await Recurso.create({
            titulo: titulo.trim(),
            conteudo: conteudo.trim(),
            autor: autor.trim(),
            categoria: categoria.trim(),
            status: status,
            idusuario: req.usuario.id, // ← ESSENCIAL: vem do authMiddleware
            data: data
        });

        // Retornar resposta formatada
        res.status(201).json({
            id: novoRecurso.id,
            titulo: novoRecurso.titulo,
            conteudo: novoRecurso.conteudo,
            autor: novoRecurso.autor,
            categoria: novoRecurso.categoria,
            status: novoRecurso.status,
            idusuario: novoRecurso.idusuario,
            data: novoRecurso.data
        });

    } catch (err) {
        console.error('❌ Erro ao criar recurso:', err);
        
        // Erro específico de FOREIGN KEY
        if (err.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                error: 'Erro de relacionamento',
                details: 'O usuário associado não existe no banco de dados',
                debug: `idusuario tentado: ${req.usuario.id}`
            });
        }
        
        // Erro de validação do modelo
        if (err.name === 'SequelizeValidationError') {
            return res.status(422).json({
                error: 'Erro de validação',
                details: err.errors.map(e => ({
                    campo: e.path,
                    mensagem: e.message,
                    valor: e.value
                }))
            });
        }
        
        // Erro genérico
        res.status(500).json({
            error: 'Erro ao criar recurso',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// routes/recursoRoutes.js - Apenas a parte da LISTAR RECURSOS corrigida
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { status, categoria, data_inicio, data_fim, texto, autor } = req.query;
        const where = {};

        // FILTRO: Por usuário (cada usuário só vê seus próprios recursos)
        where.idusuario = req.usuario.id;

        // FILTRO 1: Status
        if (status && status !== 'todos') {
            where.status = status;
        }

        // FILTRO 2: Categoria
        if (categoria && categoria !== 'todas') {
            where.categoria = categoria;
        }

        // FILTRO 3: Intervalo de datas
        if (data_inicio || data_fim) {
            where.data = {};
            if (data_inicio) {
                where.data[Op.gte] = new Date(data_inicio);
            }
            if (data_fim) {
                where.data[Op.lte] = new Date(data_fim);
            }
        }

        // FILTRO 4: Busca por texto (título E conteúdo)
        const conditions = [];
        
        if (texto && texto.trim()) {
            const searchTerm = `%${texto.trim()}%`;
            conditions.push({
                [Op.or]: [
                    { titulo: { [Op.like]: searchTerm } },
                    { conteudo: { [Op.like]: searchTerm } }
                ]
            });
        }

        // FILTRO 5: Busca por autor (campo separado)
        if (autor && autor.trim()) {
            const authorTerm = `%${autor.trim()}%`;
            conditions.push({ autor: { [Op.like]: authorTerm } });
        }

        // Combina todas as condições com AND
        if (conditions.length > 0) {
            where[Op.and] = conditions;
        }

        const recursos = await Recurso.findAll({
            where,
            include: [
                {
                    model: Usuario,
                    attributes: ['id', 'nome', 'email']
                }
            ],
            order: [['data', 'DESC']]
        });

        res.status(200).json(recursos);

    } catch (err) {
        console.error('Erro ao buscar recursos:', err);
        res.status(500).json({
            error: 'Erro ao buscar recursos',
            details: err.message
        });
    }
});

// ==================== BUSCAR RECURSO ESPECÍFICO ====================
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const recurso = await Recurso.findOne({
            where: {
                id: req.params.id,
                idusuario: req.usuario.id // Usuário só vê seus próprios recursos
            },
            include: [
                {
                    model: Usuario,
                    attributes: ['id', 'nome', 'email']
                }
            ]
        });

        if (!recurso) {
            return res.status(404).json({ error: 'Recurso não encontrado' });
        }

        res.status(200).json(recurso);
    } catch (err) {
        console.error('Erro ao buscar recurso:', err);
        res.status(500).json({
            error: 'Erro ao buscar recurso',
            details: err.message
        });
    }
});

// ==================== ATUALIZAR RECURSO ====================
// ==================== ATUALIZAR RECURSO ====================
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        // Buscar recurso verificando se pertence ao usuário
        const recurso = await Recurso.findOne({
            where: {
                id: req.params.id,
                idusuario: req.usuario.id
            }
        });

        if (!recurso) {
            return res.status(404).json({ error: 'Recurso não encontrado' });
        }

        const { titulo, conteudo, status, categoria, autor, data } = req.body;

        // Validação
        const errors = {};
        if (titulo !== undefined && !titulo.trim()) errors.titulo = ['Campo obrigatório'];
        if (conteudo !== undefined && !conteudo.trim()) errors.conteudo = ['Campo obrigatório'];
        if (categoria !== undefined && !categoria.trim()) errors.categoria = ['Campo obrigatório'];
        if (autor !== undefined && !autor.trim()) errors.autor = ['Campo obrigatório'];

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({ errors });
        }

        // Atualizar apenas os campos fornecidos
        if (titulo !== undefined) recurso.titulo = titulo.trim();
        if (conteudo !== undefined) recurso.conteudo = conteudo.trim();
        if (status !== undefined) recurso.status = status;
        if (categoria !== undefined) recurso.categoria = categoria.trim();
        if (autor !== undefined) recurso.autor = autor.trim();
        
        // Adicione esta linha para permitir atualização da data
        if (data !== undefined) recurso.data = data;

        await recurso.save();

        res.status(200).json(recurso);
    } catch (err) {
        console.error('Erro ao atualizar recurso:', err);
        res.status(500).json({
            error: 'Erro ao atualizar recurso',
            details: err.message
        });
    }
});

// ==================== DELETAR RECURSO ====================
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // Buscar recurso verificando se pertence ao usuário
        const recurso = await Recurso.findOne({
            where: {
                id: req.params.id,
                idusuario: req.usuario.id
            }
        });

        if (!recurso) {
            return res.status(404).json({ error: 'Recurso não encontrado' });
        }

        await recurso.destroy();

        res.status(204).send();
    } catch (err) {
        console.error('Erro ao deletar recurso:', err);
        res.status(500).json({
            error: 'Erro ao deletar recurso',
            details: err.message
        });
    }
});

export default router;