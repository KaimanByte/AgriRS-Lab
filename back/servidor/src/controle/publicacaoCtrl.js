import fs from 'fs';
import path from 'path';
import PublicacaoDAO from "../modelo/publicacaoDAO.js";

class PublicacaoCtrl {
  static async listar(req, res) {
    try {
      const dados = await PublicacaoDAO.listar();
      res.json(dados);
    } catch (e) {
      res.status(500).json({ erro: "Erro ao listar publicações: " + e.message });
    }
  }

  static async buscar(req, res) {
    try {
      const id = req.params.id;
      const dado = await PublicacaoDAO.buscarPorId(id);
      if (!dado) return res.status(404).json({ erro: "Publicação não encontrada" });
      res.json(dado);
    } catch (e) {
      res.status(500).json({ erro: e.message });
    }
  }

  static async criar(req, res) {
    try {
      const pub = req.body;
      const nova = await PublicacaoDAO.inserir(pub);
      res.status(201).json(nova);
    } catch (e) {
      res.status(500).json({ erro: e.message });
    }
  }

  static async atualizar(req, res) {
    try {
      const id = req.params.id;
      const pub = req.body;
      // Verificar se imagem_url é base64 e salvar como arquivo
      if (pub.imagem_url && pub.imagem_url.startsWith('data:image')) {
        const base64Data = pub.imagem_url.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const uploadDir = path.join(process.cwd(), '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filename = `imagem-${Date.now()}-${Math.round(Math.random() * 1E9)}.png`;
        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, buffer);
        pub.imagem_url = `http://localhost:3030/uploads/${filename}`;
      }
      const atualizada = await PublicacaoDAO.atualizar(id, pub);
      res.json(atualizada);
    } catch (e) {
      res.status(500).json({ erro: e.message });
    }
  }

  static async excluir(req, res) {
    try {
      const id = req.params.id;
      // Buscar a publicação para obter a imagem_url
      const pub = await PublicacaoDAO.buscarPorId(id);
      if (pub && pub.imagem_url && pub.imagem_url.startsWith('http://localhost:3030/uploads/')) {
        // Extrair o nome do arquivo da URL
        const filename = pub.imagem_url.split('/').pop();
        const uploadDir = path.join(process.cwd(), '..', 'uploads');
        const filepath = path.join(uploadDir, filename);
        // Verificar se o arquivo existe e deletar
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      }
      // Excluir do banco de dados
      await PublicacaoDAO.excluir(id);
      res.json({ msg: "Publicação excluída com sucesso" });
    } catch (e) {
      res.status(500).json({ erro: e.message });
    }
  }
}

export default PublicacaoCtrl;
