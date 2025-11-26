import noticiaDAO from '../modelo/noticiasDAO.js';
import fs from 'fs';
import path from 'path';

const noticiasCtrl = {
    async inserir(req, res) {
        try {
            console.log('📝 POST /api/noticias recebida:', req.body);
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
            console.log(`📦 Retornando ${noticias.length} notícias`);
            res.json(noticias);
        } catch (erro) {
            console.error('❌ Erro listar notícias:', erro);
            console.error('Stack trace:', erro.stack);
            res.status(500).json({ 
                status: false, 
                mensagem: 'Erro ao listar notícias',
                erro: erro.message 
            });
        }
    },

    async buscarPorId(req, res) {
        try {
            const id = req.params.id;
            console.log(`🔍 GET /api/noticias/${id} - Buscando notícia...`);
            const noticia = await noticiaDAO.buscarPorId(id);
            
            if (!noticia) {
                console.log(`⚠️ Notícia ${id} não encontrada`);
                return res.status(404).json({ 
                    status: false, 
                    mensagem: 'Notícia não encontrada' 
                });
            }
            
            console.log('✅ Notícia encontrada:', noticia);
            res.json(noticia);
        } catch (erro) {
            console.error('❌ Erro buscarPorId:', erro);
            res.status(500).json({ status: false, mensagem: erro.message });
        }
    },

    async atualizar(req, res) {
        try {
            const id = req.params.id;
            console.log(`📝 PUT /api/noticias/${id}`, req.body);
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
            
            const noticiaAtualizada = await noticiaDAO.atualizar(id, noticia);
            console.log('✅ Notícia atualizada:', noticiaAtualizada);
            res.json(noticiaAtualizada);
        } catch (erro) {
            console.error('❌ Erro atualizar notícia:', erro);
            res.status(500).json({ status: false, mensagem: erro.message });
        }
    },

    async deletar(req, res) {
        try {
            const id = req.params.id;
            console.log(`🗑️ DELETE /api/noticias/${id}`);
            
            // Buscar a notícia para obter a URL da imagem
            const noticia = await noticiaDAO.buscarPorId(id);
            
            if (noticia && noticia.imagem && noticia.imagem.startsWith('http://localhost:3030/uploads/')) {
                const filename = path.basename(noticia.imagem);
                const filepath = path.join(process.cwd(), '..', 'uploads', filename);
                if (fs.existsSync(filepath)) {
                    fs.unlinkSync(filepath);
                    console.log('🖼️ Imagem deletada:', filepath);
                }
            }
            
            const excluida = await noticiaDAO.deletar(id);
            console.log('✅ Notícia excluída/ocultada:', excluida);
            
            res.json({ 
                status: true, 
                mensagem: excluida ? 'Notícia removida com sucesso' : 'Nenhum registro removido', 
                excluida 
            });
        } catch (erro) {
            console.error('❌ Erro deletar notícia:', erro);
            res.status(500).json({ status: false, mensagem: erro.message });
        }
    }
};

export default noticiasCtrl;