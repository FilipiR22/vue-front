// routes/subrecursoRoutes.js
import express from 'express';
import Subrecurso from '../models/subrecurso.js';
import Recurso from '../models/recurso.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { Op } from 'sequelize';

const router = express.Router();

// ==================== ROTAS DE SUBRECURSO (CRUD Completo) ====================

// 1. CRIAR SUBRECURSO (POST /subrecursos) - Protegido
router.post('/', authMiddleware, async (req, res) => {
    const { idrecurso, titulo, conteudo, status = 'pendente', categoria, autor } = req.body;

    // Validação dos campos obrigatórios
    const errors = {};
    if (!idrecurso) errors.idrecurso = ['Campo obrigatório (relacionamento)'];
    if (!titulo || !titulo.trim()) errors.titulo = ['Campo obrigatório'];
    if (!conteudo || !conteudo.trim()) errors.conteudo = ['Campo obrigatório'];

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({ errors });
    }

    try {
        // Verificar se o recurso pai existe
        const recurso = await Recurso.findByPk(idrecurso);
        if (!recurso) {
            return res.status(404).json({ error: 'Recurso pai não encontrado' });
        }

        // Verificar permissões (dono do recurso ou ADMIN)
        if (req.usuario.perfil !== 'ADMIN' && recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Sem permissão para criar subrecursos neste recurso' });
        }

        // Criar subrecurso
        const novoSubrecurso = await Subrecurso.create({
            idrecurso, // RELACIONAMENTO OBRIGATÓRIO (RF #2)
            titulo: titulo.trim(),
            conteudo: conteudo.trim(),
            idusuario: req.usuario.id,
            status: status || 'pendente',
            categoria: categoria || 'geral',
            autor: autor || null,
            data: new Date()
        });

        res.status(201).json(novoSubrecurso);
    } catch (err) {
        console.error('Erro ao criar subrecurso:', err);
        res.status(400).json({
            error: 'Erro ao criar subrecurso',
            details: err.message
        });
    }
});

// 2. LISTAR SUBRECURSOS COM FILTROS (GET /subrecursos) - Protegido
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { idrecurso, status, categoria, autor, data_inicio, data_fim, search } = req.query;
        const where = {};

        // FILTRO OBRIGATÓRIO: Por recurso pai (RF #2)
        if (idrecurso) {
            where.idrecurso = idrecurso;
            
            // Verificar permissões para o recurso pai
            const recurso = await Recurso.findByPk(idrecurso);
            if (recurso && req.usuario.perfil !== 'ADMIN' && recurso.idusuario !== req.usuario.id) {
                return res.status(403).json({ error: 'Sem permissão para acessar subrecursos deste recurso' });
            }
        } else {
            // Se não especificar idrecurso, listar apenas subrecursos de recursos do usuário
            const recursosDoUsuario = await Recurso.findAll({
                where: { idusuario: req.usuario.id },
                attributes: ['id']
            });
            const idsRecursos = recursosDoUsuario.map(r => r.id);
            where.idrecurso = { [Op.in]: idsRecursos };
        }

        // FILTRO 1: Status (RF #5 - 1 ponto)
        if (status && status !== 'todos') {
            where.status = status;
        }

        // FILTRO 2: Categoria (RF #5 - 1 ponto)
        if (categoria && categoria !== 'todas') {
            where.categoria = categoria;
        }

        // FILTRO 3: Responsável (RF #5 - 1 ponto)
        if (autor && autor.trim()) {
            where.autor = { [Op.iLike]: `%${autor.trim()}%` };
        }

        // FILTRO 4: Intervalo de datas (RF #5 - 1 ponto)
        if (data_inicio || data_fim) {
            where.data = {};
            if (data_inicio) {
                where.data[Op.gte] = new Date(data_inicio);
            }
            if (data_fim) {
                where.data[Op.lte] = new Date(data_fim);
            }
        }

        // FILTRO 5: Busca textual (titulo/conteudo) (RF #5 - 1 ponto extra)
        if (search && search.trim()) {
            where[Op.or] = [
                { titulo: { [Op.iLike]: `%${search.trim()}%` } },
                { conteudo: { [Op.iLike]: `%${search.trim()}%` } }
            ];
        }

        const subrecursos = await Subrecurso.findAll({
            where,
            order: [['data', 'DESC']],
            include: [{
                model: Recurso,
                as: 'recurso',
                attributes: ['id', 'titulo']
            }]
        });

        res.status(200).json(subrecursos);
    } catch (err) {
        console.error('Erro ao buscar subrecursos:', err);
        res.status(500).json({
            error: 'Erro ao buscar subrecursos',
            details: err.message
        });
    }
});

// 3. BUSCAR SUBRECURSO ESPECÍFICO (GET /subrecursos/:id) - Protegido
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const subrecurso = await Subrecurso.findOne({
            where: { id: req.params.id },
            include: [{
                model: Recurso,
                as: 'recurso',
                attributes: ['id', 'titulo', 'idusuario']
            }]
        });

        if (!subrecurso) {
            return res.status(404).json({ error: 'Subrecurso não encontrado' });
        }

        // Verificar permissões (dono do recurso pai ou ADMIN)
        if (req.usuario.perfil !== 'ADMIN' && subrecurso.recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Sem permissão para acessar este subrecurso' });
        }

        res.status(200).json(subrecurso);
    } catch (err) {
        console.error('Erro ao buscar subrecurso:', err);
        res.status(500).json({
            error: 'Erro ao buscar subrecurso',
            details: err.message
        });
    }
});

// 4. ATUALIZAR SUBRECURSO (PUT /subrecursos/:id) - Protegido
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const subrecurso = await Subrecurso.findOne({
            where: { id: req.params.id },
            include: [{
                model: Recurso,
                as: 'recurso',
                attributes: ['idusuario']
            }]
        });

        if (!subrecurso) {
            return res.status(404).json({ error: 'Subrecurso não encontrado' });
        }

        // Verificar permissões (dono do recurso pai ou ADMIN)
        if (req.usuario.perfil !== 'ADMIN' && subrecurso.recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Sem permissão para editar este subrecurso' });
        }

        const { titulo, conteudo, status, categoria, autor } = req.body;

        // Validação
        const errors = {};
        if (!titulo || !titulo.trim()) errors.titulo = ['Campo obrigatório'];
        if (!conteudo || !conteudo.trim()) errors.conteudo = ['Campo obrigatório'];

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({ errors });
        }

        // Atualizar campos
        subrecurso.titulo = titulo.trim();
        subrecurso.conteudo = conteudo.trim();
        if (status !== undefined) subrecurso.status = status;
        if (categoria !== undefined) subrecurso.categoria = categoria;
        if (autor !== undefined) subrecurso.autor = autor;

        await subrecurso.save();

        res.status(200).json(subrecurso);
    } catch (err) {
        console.error('Erro ao atualizar subrecurso:', err);
        res.status(500).json({
            error: 'Erro ao atualizar subrecurso',
            details: err.message
        });
    }
});

// 5. DELETAR SUBRECURSO (DELETE /subrecursos/:id) - Protegido
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const subrecurso = await Subrecurso.findOne({
            where: { id: req.params.id },
            include: [{
                model: Recurso,
                as: 'recurso',
                attributes: ['idusuario']
            }]
        });

        if (!subrecurso) {
            return res.status(404).json({ error: 'Subrecurso não encontrado' });
        }

        // Verificar permissões (dono do recurso pai ou ADMIN)
        if (req.usuario.perfil !== 'ADMIN' && subrecurso.recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Sem permissão para excluir este subrecurso' });
        }

        await subrecurso.destroy();

        res.status(204).send();
    } catch (err) {
        console.error('Erro ao deletar subrecurso:', err);
        res.status(500).json({
            error: 'Erro ao deletar subrecurso',
            details: err.message
        });
    }
});

export default router;