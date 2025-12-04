import express from 'express';
import Subrecurso from '../models/subrecurso.js';
import Recurso from '../models/recurso.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Criar subrecurso
router.post('/', authMiddleware, async (req, res) => {
    const { idrecurso, titulo, descricao, status } = req.body;

    if (!idrecurso || !titulo || !titulo.trim()) {
        return res.status(422).json({
            errors: {
                idrecurso: ['Campo obrigatório.'],
                titulo: ['Campo obrigatório.']
            }
        });
    }

    try {
        const recurso = await Recurso.findByPk(idrecurso);
        if (!recurso) return res.status(404).json({ error: 'Recurso não encontrado' });

        if (req.usuario.perfil !== 'ADMIN' && recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        const novo = await Subrecurso.create({
            idrecurso,
            titulo,
            descricao,
            status,
            data_criacao: new Date()
        });

        res.status(201).json(novo);
    } catch (err) {
        res.status(400).json({ error: 'Erro ao criar subrecurso', detalhes: err.message });
    }
});

// Listar subrecursos de um recurso
router.get('/recurso/:idrecurso', authMiddleware, async (req, res) => {
    try {
        const recurso = await Recurso.findByPk(req.params.idrecurso);
        if (!recurso) return res.status(404).json({ error: 'Recurso não encontrado' });

        if (req.usuario.perfil !== 'ADMIN' && recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        const lista = await Subrecurso.findAll({
            where: { idrecurso: req.params.idrecurso }
        });

        res.status(200).json(lista);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar subrecursos' });
    }
});

// Obter subrecurso específico
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const sub = await Subrecurso.findByPk(req.params.id);
        if (!sub) return res.status(404).json({ error: 'Subrecurso não encontrado' });

        const recurso = await Recurso.findByPk(sub.idrecurso);

        if (req.usuario.perfil !== 'ADMIN' && recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        res.status(200).json(sub);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar subrecurso' });
    }
});

// Atualizar subrecurso (PUT)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const sub = await Subrecurso.findByPk(req.params.id);
        if (!sub) return res.status(404).json({ error: 'Subrecurso não encontrado' });

        const recurso = await Recurso.findByPk(sub.idrecurso);
        if (req.usuario.perfil !== 'ADMIN' && recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        const { titulo, descricao, status } = req.body;

        if (!titulo || !titulo.trim()) {
            return res.status(422).json({ errors: { titulo: ['Campo obrigatório.'] } });
        }

        sub.titulo = titulo;
        sub.descricao = descricao;
        sub.status = status;

        await sub.save();

        res.status(200).json(sub);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar subrecurso' });
    }
});

// Atualizar subrecurso (PATCH)
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const sub = await Subrecurso.findByPk(req.params.id);
        if (!sub) return res.status(404).json({ error: 'Subrecurso não encontrado' });

        const recurso = await Recurso.findByPk(sub.idrecurso);
        if (req.usuario.perfil !== 'ADMIN' && recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        if ('titulo' in req.body && (!req.body.titulo || !req.body.titulo.trim())) {
            return res.status(422).json({ errors: { titulo: ['Campo obrigatório.'] } });
        }

        if (req.body.titulo !== undefined) sub.titulo = req.body.titulo;
        if (req.body.descricao !== undefined) sub.descricao = req.body.descricao;
        if (req.body.status !== undefined) sub.status = req.body.status;

        await sub.save();

        res.status(200).json(sub);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar subrecurso' });
    }
});

// Deletar subrecurso
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const sub = await Subrecurso.findByPk(req.params.id);
        if (!sub) return res.status(404).json({ error: 'Subrecurso não encontrado' });

        const recurso = await Recurso.findByPk(sub.idrecurso);
        if (req.usuario.perfil !== 'ADMIN' && recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        await sub.destroy();

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Erro ao deletar subrecurso' });
    }
});

export default router;
