import pool from "../controladores/bd.js";

// Teste inicial de conexão automático
(async () => {
    try {
        const testQuery = 'SELECT COUNT(*) as total FROM tbpublicacao';
        const result = await pool.query(testQuery);
        console.log('🧪 [DAO - Publicações] TESTE: Conexão OK. Total de registros:', result.rows[0].total);
    } catch (error) {
        console.error('❌ [DAO - Publicações] TESTE: Erro de conexão:', error.message);
    }
})();

class PublicacaoDAO {
  static async listar() {
    const sql = "SELECT * FROM tbpublicacao ORDER BY idpublicacao DESC";
    try {
        const { rows } = await pool.query(sql);
        console.log(`✅ [DAO - Publicações] ${rows.length} registros listados`);
        return rows;
    } catch (error) {
        console.error('❌ [DAO - Publicações] Erro ao listar:', error.message);
        throw error;
    }
  }

  static async buscarPorId(id) {
    const sql = "SELECT * FROM tbpublicacao WHERE idpublicacao = $1";
    try {
        const { rows } = await pool.query(sql, [id]);
        if (rows.length === 0) {
            console.log(`⚠️ [DAO - Publicações] Registro com ID ${id} não encontrado`);
            return null;
        }
        console.log('✅ [DAO - Publicações] Registro encontrado:', id);
        return rows[0];
    } catch (error) {
        console.error('❌ [DAO - Publicações] Erro ao buscar por ID:', error.message);
        throw error;
    }
  }

  static async inserir(pub) {
    const sql = `
      INSERT INTO tbpublicacao (titulo, descricao, imagem_url, pdf_url, citacao_url, doi_url, ano)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
    const valores = [pub.titulo, pub.descricao, pub.imagem_url, pub.pdf_url, pub.citacao_url, pub.doi_url, pub.ano];
    try {
        const { rows } = await pool.query(sql, valores);
        console.log('✅ [DAO - Publicações] Registro inserido:', rows[0].idpublicacao);
        return rows[0];
    } catch (error) {
        console.error('❌ [DAO - Publicações] Erro ao inserir:', error.message);
        throw error;
    }
  }

  static async atualizar(id, pub) {
    const sql = `
      UPDATE tbpublicacao
      SET titulo=$1, descricao=$2, imagem_url=$3, pdf_url=$4, citacao_url=$5, doi_url=$6, ano=$7, atualizado_em=now()
      WHERE idpublicacao=$8
      RETURNING *`;
    const valores = [pub.titulo, pub.descricao, pub.imagem_url, pub.pdf_url, pub.citacao_url, pub.doi_url, pub.ano, id];
    try {
        const { rows } = await pool.query(sql, valores);
        if (rows.length === 0) {
            console.log(`⚠️ [DAO - Publicações] Registro com ID ${id} não encontrado para atualizar`);
            return null;
        }
        console.log('✅ [DAO - Publicações] Registro atualizado:', id);
        return rows[0];
    } catch (error) {
        console.error('❌ [DAO - Publicações] Erro ao atualizar:', error.message);
        throw error;
    }
  }

  static async excluir(id) {
    const sql = "DELETE FROM tbpublicacao WHERE idpublicacao=$1 RETURNING *";
    try {
        const { rows } = await pool.query(sql, [id]);
        if (rows.length === 0) {
            console.log(`⚠️ [DAO - Publicações] Registro com ID ${id} não encontrado para excluir`);
            return false;
        }
        console.log('✅ [DAO - Publicações] Registro deletado:', id);
        return true;
    } catch (error) {
        console.error('❌ [DAO - Publicações] Erro ao excluir:', error.message);
        throw error;
    }
  }
}

export default PublicacaoDAO;