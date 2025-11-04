import VagasDAO from "../modelo/vagasDAO.js";

class VagasCtrl {
  static async listar(req, res) {
    try {
      const dados = await VagasDAO.listar();
      res.json(dados);
    } catch (e) {
      res.status(500).json({ erro: "Erro ao listar oportunidades: " + e.message });
    }
  }

  static async buscar(req, res) {
    try {
      const id = req.params.id;
      const dado = await VagasDAO.buscarPorId(id);
      if (!dado) return res.status(404).json({ erro: "Oportunidade não encontrada" });
      res.json(dado);
    } catch (e) {
      res.status(500).json({ erro: e.message });
    }
  }

  static async criar(req, res) {
    try {
      const vaga = req.body;
      const nova = await VagasDAO.inserir(vaga);
      res.status(201).json(nova);
    } catch (e) {
      res.status(500).json({ erro: e.message });
    }
  }

  static async atualizar(req, res) {
    try {
      const id = req.params.id;
      const vaga = req.body;
      const atualizada = await VagasDAO.atualizar(id, vaga);
      res.json(atualizada);
    } catch (e) {
      res.status(500).json({ erro: e.message });
    }
  }

  static async excluir(req, res) {
    try {
      const id = req.params.id;
      const excluida = await VagasDAO.excluir(id);
      if (!excluida) return res.status(404).json({ erro: "Oportunidade não encontrada" });
      res.json({ msg: "Oportunidade excluída com sucesso" });
    } catch (e) {
      res.status(500).json({ erro: e.message });
    }
  }
}

export default VagasCtrl;
