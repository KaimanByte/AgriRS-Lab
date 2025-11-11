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
