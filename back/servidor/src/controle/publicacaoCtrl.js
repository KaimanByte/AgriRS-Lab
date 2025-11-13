import PublicacaoDAO from "../modelo/publicacaoDAO.js";
import fs from 'fs';
import path from 'path';
import multer from 'multer';

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
        pub.imagem_url = `${filename}`;
      }
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
      const atualizada = await PublicacaoDAO.atualizar(id, pub);
      res.json(atualizada);
    } catch (e) {
      res.status(500).json({ erro: e.message });
    }
  }

  static async excluir(req, res) {
    try {
      const id = req.params.id;
      await PublicacaoDAO.excluir(id);
      res.json({ msg: "Publicação excluída com sucesso" });
    } catch (e) {
      res.status(500).json({ erro: e.message });
    }
  }
}

export default PublicacaoCtrl;
