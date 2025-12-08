import express from 'express';
import Recurso from '../models/recurso.js';
import Usuario from '../models/usuario.js'; // Para pegar nome do autor
import authMiddleware from '../middlewares/authMiddleware.js';
import { Op } from 'sequelize';

const router = express.Router();

// Criar recurso
router.post('/', authMiddleware, async (req, res) => {
    const { titulo, autor, data, status = 'ativo' } = req.body;

    if (!titulo || !titulo.trim()) {
        return res.status(422).json({
            errors: {
                titulo: ['Campo obrigatório.']
            }
        });
    }

    try {
        const novoRecurso = await Recurso.create({
            titulo,
            autor: autor || req.usuario.nome, // Se não enviar autor, usa nome do usuário logado
            data: data || new Date(),
            status: status || 'ativo',
            idusuario: req.usuario.id,
            conteudo: '' // Mantém por compatibilidade, mas não usado no frontend
        });

        // Retorna no formato esperado pelo frontend
        res.status(201).json({
            id: novoRecurso.id,
            titulo: novoRecurso.titulo,
            autor: novoRecurso.autor,
            data: novoRecurso.data,
            status: novoRecurso.status,
            conteudo: novoRecurso.conteudo // Opcional
        });
    } catch (err) {
        console.error('Erro ao criar recurso:', err);
        res.status(400).json({
            error: 'Erro ao criar recurso',
            detalhes: err.message
        });
    }
});

// Listar recursos com filtros
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Preparar condições de filtro
        const where = {};
        
        // Filtro por usuário (a não ser que seja ADMIN)
        if (req.usuario.perfil !== 'ADMIN') {
            where.idusuario = req.usuario.id;
        }
        
        // Filtros da query string
        if (req.query.titulo_like) {
            where.titulo = { [Op.like]: `%${req.query.titulo_like}%` };
        }
        
        if (req.query.autor_like) {
            where.autor = { [Op.like]: `%${req.query.autor_like}%` };
        }
        
        if (req.query.status && req.query.status !== 'todos') {
            where.status = req.query.status;
        }
        
        // Buscar recursos
        const recursos = await Recurso.findAll({
            where,
            order: [['data', 'DESC']], // Ordena por data mais recente
            attributes: ['id', 'titulo', 'autor', 'data', 'status', 'conteudo'] // Seleciona campos
        });
        
        // Formatar resposta
        const recursosFormatados = recursos.map(recurso => ({
            id: recurso.id,
            titulo: recurso.titulo,
            autor: recurso.autor,
            data: recurso.data,
            status: recurso.status,
            conteudo: recurso.conteudo // Opcional
        }));

        res.status(200).json(recursosFormatados);
    } catch (err) {
        console.error('Erro ao buscar recursos:', err);
        res.status(500).json({ 
            error: 'Erro ao buscar recursos',
            detalhes: err.message 
        });
    }
});

// Buscar recurso específico
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const where = {
            id: req.params.id
        };
        
        // Se não for admin, só pode ver seus próprios recursos
        if (req.usuario.perfil !== 'ADMIN') {
            where.idusuario = req.usuario.id;
        }
        
        const recurso = await Recurso.findOne({ where });

        if (!recurso) {
            return res.status(404).json({ error: 'Recurso não encontrado' });
        }

        // Retorna no formato esperado
        res.status(200).json({
            id: recurso.id,
            titulo: recurso.titulo,
            autor: recurso.autor,
            data: recurso.data,
            status: recurso.status,
            conteudo: recurso.conteudo // Opcional
        });
    } catch (err) {
        console.error('Erro ao buscar recurso:', err);
        res.status(500).json({ 
            error: 'Erro ao buscar recurso',
            detalhes: err.message 
        });
    }
});

// Atualizar recurso (PUT - completo)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const recurso = await Recurso.findByPk(req.params.id);
        
        if (!recurso) {
            return res.status(404).json({ error: 'Recurso não encontrado' });
        }

        // Verificar permissões
        if (req.usuario.perfil !== 'ADMIN' && recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para editar este recurso' });
        }

        const { titulo, autor, data, status } = req.body;

        // Validação
        if (!titulo || !titulo.trim()) {
            return res.status(422).json({
                errors: { titulo: ['Campo obrigatório.'] }
            });
        }

        // Atualizar campos
        recurso.titulo = titulo;
        if (autor !== undefined) recurso.autor = autor;
        if (data !== undefined) recurso.data = data;
        if (status !== undefined) recurso.status = status;

        await recurso.save();

        // Retorna atualizado
        res.status(200).json({
            id: recurso.id,
            titulo: recurso.titulo,
            autor: recurso.autor,
            data: recurso.data,
            status: recurso.status,
            conteudo: recurso.conteudo
        });
    } catch (err) {
        console.error('Erro ao atualizar recurso:', err);
        res.status(500).json({ 
            error: 'Erro ao atualizar recurso',
            detalhes: err.message 
        });
    }
});

// Atualizar recurso (PATCH - parcial)
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const recurso = await Recurso.findByPk(req.params.id);
        
        if (!recurso) {
            return res.status(404).json({ error: 'Recurso não encontrado' });
        }

        // Verificar permissões
        if (req.usuario.perfil !== 'ADMIN' && recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para editar este recurso' });
        }

        // Validação para cada campo que está sendo atualizado
        if ('titulo' in req.body && (!req.body.titulo || !req.body.titulo.trim())) {
            return res.status(422).json({ 
                errors: { titulo: ['Campo obrigatório.'] } 
            });
        }

        // Atualizar apenas os campos enviados
        if (req.body.titulo !== undefined) recurso.titulo = req.body.titulo;
        if (req.body.autor !== undefined) recurso.autor = req.body.autor;
        if (req.body.data !== undefined) recurso.data = req.body.data;
        if (req.body.status !== undefined) recurso.status = req.body.status;

        await recurso.save();

        // Retorna atualizado
        res.status(200).json({
            id: recurso.id,
            titulo: recurso.titulo,
            autor: recurso.autor,
            data: recurso.data,
            status: recurso.status,
            conteudo: recurso.conteudo
        });
    } catch (err) {
        console.error('Erro ao atualizar recurso:', err);
        res.status(500).json({ 
            error: 'Erro ao atualizar recurso',
            detalhes: err.message 
        });
    }
});

// Deletar recurso
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const recurso = await Recurso.findByPk(req.params.id);
        
        if (!recurso) {
            return res.status(404).json({ error: 'Recurso não encontrado' });
        }

        // Verificar permissões
        if (req.usuario.perfil !== 'ADMIN' && recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para excluir este recurso' });
        }

        await recurso.destroy();
        
        res.status(204).send(); // No content
    } catch (err) {
        console.error('Erro ao deletar recurso:', err);
        res.status(500).json({ 
            error: 'Erro ao deletar recurso',
            detalhes: err.message 
        });
    }
});

export default router;