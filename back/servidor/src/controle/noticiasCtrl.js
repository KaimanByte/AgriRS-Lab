import noticiasDAO from '../modelo/noticiasDAO.js';
import fs from 'fs';
import path from 'path';

const noticiasCtrl = {
    async inserir(req, res) {
        try {
            console.log('POST /noticias recebida:', req.body);
            const noticia = req.body;
            // Verificar se imagem é base64 e salvar como arquivo
            if (noticia.imagem && noticia.imagem.startsWith('data:image')) {
                const base64Data = noticia.imagem.split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');
                const uploadDir = path.join(process.cwd(), '..', 'uploads');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const filename = `imagem-${Date.now()}-${Math.round(Math.random() * 1E9)}.png`;
                const filepath = path.join(uploadDir, filename);
                fs.writeFileSync(filepath, buffer);
                noticia.imagem = `http://localhost:3030/uploads/${filename}`;
            }
            const noticiaCriada = await noticiasDAO.inserir(noticia);
            // retorna o objeto criado (status 201)
            res.status(201).json(noticiaCriada);
        } catch (erro) {
            console.error('Erro inserir notícia:', erro);
            res.status(500).json({ status: false, mensagem: erro.message });
        }
    },

    async listar(req, res) {
        try {
            const noticias = await noticiasDAO.listar();
            res.json(noticias);
        } catch (erro) {
            console.error('Erro listar notícias:', erro);
            res.status(500).json({ status: false, mensagem: erro.message });
        }
    },

    async buscarPorId(req, res) {
        try {
            const id = req.params.id;
            const noticia = await noticiasDAO.buscarPorId(id);
            if (!noticia) return res.status(404).json({ status: false, mensagem: 'Notícia não encontrada' });
            res.json(noticia);
        } catch (erro) {
            console.error('Erro buscarPorId:', erro);
            res.status(500).json({ status: false, mensagem: erro.message });
        }
    },

    async atualizar(req, res) {
        try {
            const id = req.params.id;
            console.log('PUT /noticias/:id', id, req.body);
            const noticia = req.body;
            // Verificar se imagem é base64 e salvar como arquivo
            if (noticia.imagem && noticia.imagem.startsWith('data:image')) {
                const base64Data = noticia.imagem.split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');
                const uploadDir = path.join(process.cwd(), '..', 'uploads');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const filename = `imagem-${Date.now()}-${Math.round(Math.random() * 1E9)}.png`;
                const filepath = path.join(uploadDir, filename);
                fs.writeFileSync(filepath, buffer);
                noticia.imagem = `http://localhost:3030/uploads/${filename}`;
            }
            const noticiaAtualizada = await noticiasDAO.atualizar(id, noticia);
            res.json(noticiaAtualizada);
        } catch (erro) {
            console.error('Erro atualizar notícia:', erro);
            res.status(500).json({ status: false, mensagem: erro.message });
        }
    },

    async deletar(req, res) {
        try {
            const id = req.params.id;
            console.log('DELETE /noticias/:id', id);
            // Buscar a notícia para obter a URL da imagem
            const noticia = await noticiasDAO.buscarPorId(id);
            if (noticia && noticia.imagem && noticia.imagem.startsWith('http://localhost:3030/uploads/')) {
                const filename = path.basename(noticia.imagem);
                const filepath = path.join(process.cwd(), '..', 'uploads', filename);
                if (fs.existsSync(filepath)) {
                    fs.unlinkSync(filepath);
                    console.log('Imagem deletada:', filepath);
                }
            }
            const excluida = await noticiasDAO.deletar(id);
            res.json({ status: true, mensagem: excluida ? 'Notícia removida com sucesso' : 'Nenhum registro removido', excluida });
        } catch (erro) {
            console.error('Erro deletar notícia:', erro);
            res.status(500).json({ status: false, mensagem: erro.message });
        }
    }
};

export default noticiasCtrl;
