import express from 'express';
import Recurso from '../models/recurso.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Criar recurso
router.post('/', authMiddleware, async (req, res) => {
    const { titulo, conteudo } = req.body;

    if (!titulo || !titulo.trim() || !conteudo || !conteudo.trim()) {
        return res.status(422).json({
            errors: {
                titulo: ['Campo obrigatório.'],
                conteudo: ['Campo obrigatório.']
            }
        });
    }

    try {
        const novoRecurso = await Recurso.create({
            titulo,
            conteudo,
            idusuario: req.usuario.id,
            data_criacao: new Date()
        });

        res.status(201).json(novoRecurso);
    } catch (err) {
        res.status(400).json({
            error: 'Erro ao criar recurso',
            detalhes: err.message
        });
    }
});

// Listar recursos
router.get('/', authMiddleware, async (req, res) => {
    try {
        let recursos;

        if (req.usuario.perfil === 'ADMIN') {
            recursos = await Recurso.findAll();
        } else {
            recursos = await Recurso.findAll({ where: { idusuario: req.usuario.id } });
        }

        res.status(200).json(recursos);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar recursos' });
    }
});

// Buscar recurso específico
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const recurso = await Recurso.findOne({
            where: {
                id: req.params.id,
                ...(req.usuario.perfil !== 'ADMIN' && { idusuario: req.usuario.id })
            }
        });

        if (!recurso) {
            return res.status(404).json({ error: 'Recurso não encontrado' });
        }

        res.status(200).json(recurso);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar recurso' });
    }
});

// Atualizar recurso (PUT)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const recurso = await Recurso.findByPk(req.params.id);
        if (!recurso) return res.status(404).json({ error: 'Recurso não encontrado' });

        if (req.usuario.perfil !== 'ADMIN' && recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        const { titulo, conteudo } = req.body;

        if (!titulo || !titulo.trim() || !conteudo || !conteudo.trim()) {
            return res.status(422).json({
                errors: {
                    titulo: ['Campo obrigatório.'],
                    conteudo: ['Campo obrigatório.']
                }
            });
        }

        recurso.titulo = titulo;
        recurso.conteudo = conteudo;

        await recurso.save();

        res.status(200).json(recurso);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar recurso' });
    }
});

// Atualizar recurso (PATCH)
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const recurso = await Recurso.findByPk(req.params.id);
        if (!recurso) return res.status(404).json({ error: 'Recurso não encontrado' });

        if (req.usuario.perfil !== 'ADMIN' && recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        if ('titulo' in req.body && (!req.body.titulo || !req.body.titulo.trim())) {
            return res.status(422).json({ errors: { titulo: ['Campo obrigatório.'] } });
        }

        if ('conteudo' in req.body && (!req.body.conteudo || !req.body.conteudo.trim())) {
            return res.status(422).json({ errors: { conteudo: ['Campo obrigatório.'] } });
        }

        if (req.body.titulo !== undefined) recurso.titulo = req.body.titulo;
        if (req.body.conteudo !== undefined) recurso.conteudo = req.body.conteudo;

        await recurso.save();

        res.status(200).json(recurso);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar recurso' });
    }
});

// Deletar recurso
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const recurso = await Recurso.findByPk(req.params.id);
        if (!recurso) return res.status(404).json({ error: 'Recurso não encontrado' });

        if (req.usuario.perfil !== 'ADMIN' && recurso.idusuario !== req.usuario.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        await recurso.destroy();
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Erro ao deletar recurso' });
    }
});

export default router;