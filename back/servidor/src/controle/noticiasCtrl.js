import noticiaDAO from '../modelo/noticiasDAO.js';
import { uploadImagem, deletarImagem } from '../utils/uploadService.js';

const noticiasCtrl = {
    async inserir(req, res) {
        try {
            console.log('📝 POST /api/noticias recebida:', req.body);
            const noticia = req.body;
            
            // Faz o upload de forma transparente (vai para nuvem ou local)
            noticia.imagem = await uploadImagem(noticia.imagem, 'agri_noticias');
            
            const noticiaCriada = await noticiaDAO.inserir(noticia);
            console.log('✅ Notícia criada com sucesso:', noticiaCriada);
            res.status(201).json(noticiaCriada);
        } catch (erro) {
            console.error('❌ Erro inserir notícia:', erro);
            res.status(500).json({ status: false, mensagem: erro.message });
        }
    },

    async listar(req, res) {
        try {
            console.log('📋 GET /api/noticias - Iniciando listagem...');
            const noticias = await noticiaDAO.listar();
            res.json(noticias);
        } catch (erro) {
            console.error('❌ Erro listar notícias:', erro);
            res.status(500).json({ status: false, mensagem: 'Erro ao listar notícias', erro: erro.message });
        }
    },

    async buscarPorId(req, res) {
        try {
            const id = req.params.id;
            const noticia = await noticiaDAO.buscarPorId(id);
            if (!noticia) return res.status(404).json({ status: false, mensagem: 'Notícia não encontrada' });
            res.json(noticia);
        } catch (erro) {
            res.status(500).json({ status: false, mensagem: erro.message });
        }
    },

    async atualizar(req, res) {
        try {
            const id = req.params.id;
            console.log(`📝 PUT /api/noticias/${id}`, req.body);
            const noticia = req.body;
            
            if (noticia.imagem && noticia.imagem.startsWith('data:image')) {
                const antigaNoticia = await noticiaDAO.buscarPorId(id);
                if (antigaNoticia) await deletarImagem(antigaNoticia.imagem, 'agri_noticias');
                noticia.imagem = await uploadImagem(noticia.imagem, 'agri_noticias');
            }
            
            const noticiaAtualizada = await noticiaDAO.atualizar(id, noticia);
            res.json(noticiaAtualizada);
        } catch (erro) {
            res.status(500).json({ status: false, mensagem: erro.message });
        }
    },

    async deletar(req, res) {
        try {
            const id = req.params.id;
            console.log(`🗑️ DELETE /api/noticias/${id}`);
            
            const noticia = await noticiaDAO.buscarPorId(id);
            if (noticia) {
                await deletarImagem(noticia.imagem, 'agri_noticias');
            }
            
            const excluida = await noticiaDAO.deletar(id);
            res.json({ status: true, mensagem: 'Notícia removida com sucesso', excluida });
        } catch (erro) {
            res.status(500).json({ status: false, mensagem: erro.message });
        }
    }
};

export default noticiasCtrl;