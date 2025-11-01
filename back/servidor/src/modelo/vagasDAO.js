import pool from "../controladores/bd.js";

class VagasDAO {
  static async listar() {
    const sql = "SELECT * FROM tboportunidades ORDER BY id ASC";
    const { rows } = await pool.query(sql);
    return rows;
  }

  static async buscarPorId(id) {
    const sql = "SELECT * FROM tboportunidades WHERE id = $1";
    const { rows } = await pool.query(sql, [id]);
    return rows[0];
  }

  static async inserir(vaga) {
    const sql = `
      INSERT INTO tboportunidades (titulo, descricao, requisitos, processo_selecao, prazo, contato)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const valores = [vaga.titulo, vaga.descricao, vaga.requisitos, vaga.processo_selecao, vaga.prazo, vaga.contato];
    const { rows } = await pool.query(sql, valores);
    return rows[0];
  }

  static async atualizar(id, vaga) {
    const sql = `
      UPDATE tboportunidades
      SET titulo=$1, descricao=$2, requisitos=$3, processo_selecao=$4, prazo=$5, contato=$6
      WHERE id=$7
      RETURNING *`;
    const valores = [vaga.titulo, vaga.descricao, vaga.requisitos, vaga.processo_selecao, vaga.prazo, vaga.contato, id];
    const { rows } = await pool.query(sql, valores);
    return rows[0];
  }

  static async excluir(id) {
    const sql = "DELETE FROM tboportunidades WHERE id=$1 RETURNING *";
    const { rows } = await pool.query(sql, [id]);
    return rows[0];
  }
}

export default VagasDAO;
