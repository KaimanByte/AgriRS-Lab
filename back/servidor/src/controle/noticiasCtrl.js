import noticiasDAO from '../modelo/noticiasDAO.js';

const noticiasCtrl = {
    async inserir(req, res) {
        try {
            console.log('POST /noticias recebida:', req.body);
            const noticiaCriada = await noticiasDAO.inserir(req.body);
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
            const noticiaAtualizada = await noticiasDAO.atualizar(id, req.body);
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
            const excluida = await noticiasDAO.deletar(id);
            res.json({ status: true, mensagem: excluida ? 'Notícia removida com sucesso' : 'Nenhum registro removido', excluida });
        } catch (erro) {
            console.error('Erro deletar notícia:', erro);
            res.status(500).json({ status: false, mensagem: erro.message });
        }
    }
};

export default noticiasCtrl;
