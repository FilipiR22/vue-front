import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Criar usuário (qualquer pessoa pode criar conta)
router.post('/', async (req, res) => {
    const { nome, email, senha, role } = req.body;

    // validação básica
    if (!nome || !nome.trim()) {
        return res.status(422).json({ errors: { nome: ['Campo obrigatório.'] } });
    }
    if (!email || !email.trim()) {
        return res.status(422).json({ errors: { email: ['Campo obrigatório.'] } });
    }
    if (!senha || !senha.trim()) {
        return res.status(422).json({ errors: { senha: ['Campo obrigatório.'] } });
    }

    try {
        // hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        const novoUser = await User.create({
            nome,
            email,
            senha: senhaHash,
            role: role || 'USER'
        });

        res.status(201).json({
            id: novoUser.id,
            nome: novoUser.nome,
            email: novoUser.email,
            role: novoUser.role,
            createdAt: novoUser.createdAt
        });
    } catch (error) {
        res.status(400).json({
            error: 'Erro ao criar usuário',
            detalhes: error.message
        });
    }
});


// Listar usuários (ADMIN vê todos / user vê só ele)
router.get('/', authMiddleware, async (req, res) => {
    try {
        let usuarios;

        if (req.usuario.role === 'ADMIN') {
            usuarios = await User.findAll({
                attributes: { exclude: ['senha'] }
            });
        } else {
            usuarios = await User.findAll({
                where: { id: req.usuario.id },
                attributes: { exclude: ['senha'] }
            });
        }

        res.status(200).json(usuarios);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar usuários' });
    }
});


// Obter um usuário específico
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.id },
            attributes: { exclude: ['senha'] }
        });

        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        if (req.usuario.role !== 'ADMIN' && req.usuario.id !== user.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar usuário' });
    }
});


// Atualizar usuário (PUT)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        if (req.usuario.role !== 'ADMIN' && req.usuario.id !== user.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        const { nome, email, role } = req.body;

        if (!nome || !nome.trim()) {
            return res.status(422).json({ errors: { nome: ['Campo obrigatório.'] } });
        }
        if (!email || !email.trim()) {
            return res.status(422).json({ errors: { email: ['Campo obrigatório.'] } });
        }

        await user.update({ nome, email, role });

        res.status(200).json({
            id: user.id,
            nome: user.nome,
            email: user.email,
            role: user.role,
            updatedAt: user.updatedAt
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});


// Atualizar parcialmente (PATCH)
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        if (req.usuario.role !== 'ADMIN' && req.usuario.id !== user.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        if ('email' in req.body && (!req.body.email || !req.body.email.trim())) {
            return res.status(422).json({ errors: { email: ['Campo obrigatório.'] } });
        }

        if ('nome' in req.body && (!req.body.nome || !req.body.nome.trim())) {
            return res.status(422).json({ errors: { nome: ['Campo obrigatório.'] } });
        }

        await user.update(req.body);

        res.status(200).json({
            id: user.id,
            nome: user.nome,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});


// Deletar usuário
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        if (req.usuario.role !== 'ADMIN' && req.usuario.id !== user.id) {
            return res.status(403).json({ error: 'Você não tem permissão para isso' });
        }

        await user.destroy();

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao deletar usuário' });
    }
});

export default router;
