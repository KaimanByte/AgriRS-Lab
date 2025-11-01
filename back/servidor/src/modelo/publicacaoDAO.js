import pool from "../controladores/bd.js";

class PublicacaoDAO {
  static async listar() {
    const sql = "SELECT * FROM tbpublicacao ORDER BY idpublicacao DESC";
    const { rows } = await pool.query(sql);
    return rows;
  }

  static async buscarPorId(id) {
    const sql = "SELECT * FROM tbpublicacao WHERE idpublicacao = $1";
    const { rows } = await pool.query(sql, [id]);
    return rows[0];
  }

  static async inserir(pub) {
    const sql = `
      INSERT INTO tbpublicacao (titulo, descricao, imagem_url, pdf_url, citacao_url, doi_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const valores = [pub.titulo, pub.descricao, pub.imagem_url, pub.pdf_url, pub.citacao_url, pub.doi_url];
    const { rows } = await pool.query(sql, valores);
    return rows[0];
  }

  static async atualizar(id, pub) {
    const sql = `
      UPDATE tbpublicacao
      SET titulo=$1, descricao=$2, imagem_url=$3, pdf_url=$4, citacao_url=$5, doi_url=$6, atualizado_em=now()
      WHERE idpublicacao=$7
      RETURNING *`;
    const valores = [pub.titulo, pub.descricao, pub.imagem_url, pub.pdf_url, pub.citacao_url, pub.doi_url, id];
    const { rows } = await pool.query(sql, valores);
    return rows[0];
  }

  static async excluir(id) {
    const sql = "DELETE FROM tbpublicacao WHERE idpublicacao=$1";
    await pool.query(sql, [id]);
    return true;
  }
}

export default PublicacaoDAO;
