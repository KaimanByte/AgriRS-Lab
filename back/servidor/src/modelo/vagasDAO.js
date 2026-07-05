import pool from "../controladores/bd.js";

// Teste inicial de conexão automático
(async () => {
    try {
        const testQuery = 'SELECT COUNT(*) as total FROM tboportunidades';
        const result = await pool.query(testQuery);
        console.log('🧪 [DAO - Vagas] TESTE: Conexão OK. Total de registros:', result.rows[0].total);
    } catch (error) {
        console.error('❌ [DAO - Vagas] TESTE: Erro de conexão:', error.message);
    }
})();

class VagasDAO {
  static async listar() {
    const sql = "SELECT * FROM tboportunidades ORDER BY id ASC";
    try {
        const { rows } = await pool.query(sql);
        console.log(`✅ [DAO - Vagas] ${rows.length} registros listados`);
        return rows;
    } catch (error) {
        console.error('❌ [DAO - Vagas] Erro ao listar:', error.message);
        throw error;
    }
  }

  static async buscarPorId(id) {
    const sql = "SELECT * FROM tboportunidades WHERE id = $1";
    try {
        const { rows } = await pool.query(sql, [id]);
        if (rows.length === 0) {
            console.log(`⚠️ [DAO - Vagas] Registro com ID ${id} não encontrado`);
            return null;
        }
        console.log('✅ [DAO - Vagas] Registro encontrado:', id);
        return rows[0];
    } catch (error) {
        console.error('❌ [DAO - Vagas] Erro ao buscar por ID:', error.message);
        throw error;
    }
  }

  static async inserir(vaga) {
    const sql = `
      INSERT INTO tboportunidades (titulo, descricao, requisitos, processo_selecao, prazo, contato)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;
    const valores = [vaga.titulo, vaga.descricao, vaga.requisitos, vaga.processo_selecao, vaga.prazo, vaga.contato];
    try {
        const { rows } = await pool.query(sql, valores);
        console.log('✅ [DAO - Vagas] Registro inserido:', rows[0].id);
        return rows[0];
    } catch (error) {
        console.error('❌ [DAO - Vagas] Erro ao inserir:', error.message);
        throw error;
    }
  }

  static async atualizar(id, vaga) {
    const sql = `
      UPDATE tboportunidades
      SET titulo=$1, descricao=$2, requisitos=$3, processo_selecao=$4, prazo=$5, contato=$6
      WHERE id=$7
      RETURNING *`;
    const valores = [vaga.titulo, vaga.descricao, vaga.requisitos, vaga.processo_selecao, vaga.prazo, vaga.contato, id];
    try {
        const { rows } = await pool.query(sql, valores);
        if (rows.length === 0) {
            console.log(`⚠️ [DAO - Vagas] Registro com ID ${id} não encontrado para atualizar`);
            return null;
        }
        console.log('✅ [DAO - Vagas] Registro atualizado:', id);
        return rows[0];
    } catch (error) {
        console.error('❌ [DAO - Vagas] Erro ao atualizar:', error.message);
        throw error;
    }
  }

  static async excluir(id) {
    const sql = "DELETE FROM tboportunidades WHERE id=$1 RETURNING *";
    try {
        const { rows } = await pool.query(sql, [id]);
        if (rows.length === 0) {
            console.log(`⚠️ [DAO - Vagas] Registro com ID ${id} não encontrado para excluir`);
            return null;
        }
        console.log('✅ [DAO - Vagas] Registro deletado:', id);
        return rows[0];
    } catch (error) {
        console.error('❌ [DAO - Vagas] Erro ao excluir:', error.message);
        throw error;
    }
  }
}

export default VagasDAO;