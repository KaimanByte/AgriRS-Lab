import pool from '../controladores/bd.js';

// Teste inicial de conexão automático
(async () => {
    try {
        const testQuery = 'SELECT COUNT(*) as total FROM tbnoticias';
        const result = await pool.query(testQuery);
        console.log('🧪 [DAO - Notícias] TESTE: Conexão OK. Total de registros:', result.rows[0].total);
    } catch (error) {
        console.error('❌ [DAO - Notícias] TESTE: Erro de conexão:', error.message);
    }
})();

const noticiasDAO = {
    async inserir(noticia) {
        const query = `
            INSERT INTO tbnoticias (titulo, link, data, exibir, descricao, url_leiamais, imagem)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING idnoticia as id, titulo, link, data, exibir, descricao, url_leiamais, imagem
        `;
        const values = [
            noticia.titulo,
            noticia.link || null,
            noticia.data,
            noticia.exibir !== false,
            noticia.descricao,
            noticia.url_leiamais || null,
            noticia.imagem || null
        ];
        
        try {
            const result = await pool.query(query, values);
            console.log('✅ [DAO - Notícias] Registro inserido:', result.rows[0].id);
            return result.rows[0];
        } catch (error) {
            console.error('❌ [DAO - Notícias] Erro ao inserir:', error.message);
            throw error;
        }
    },

    async listar() {
        const query = `
            SELECT idnoticia as id, titulo, link, data, exibir, descricao, url_leiamais, imagem
            FROM tbnoticias 
            WHERE exibir = true
            ORDER BY data DESC, idnoticia DESC
        `;
        
        try {
            const result = await pool.query(query);
            console.log(`✅ [DAO - Notícias] ${result.rows.length} registros listados`);
            return result.rows;
        } catch (error) {
            console.error('❌ [DAO - Notícias] Erro ao listar:', error.message);
            throw error;
        }
    },

    async buscarPorId(id) {
        const query = `
            SELECT idnoticia as id, titulo, link, data, exibir, descricao, url_leiamais, imagem
            FROM tbnoticias 
            WHERE idnoticia = $1
        `;
        
        try {
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                console.log(`⚠️ [DAO - Notícias] Registro com ID ${id} não encontrado`);
                return null;
            }
            console.log('✅ [DAO - Notícias] Registro encontrado:', id);
            return result.rows[0];
        } catch (error) {
            console.error('❌ [DAO - Notícias] Erro ao buscar por ID:', error.message);
            throw error;
        }
    },

    async atualizar(id, noticia) {
        const query = `
            UPDATE tbnoticias
            SET titulo = $1, link = $2, data = $3, exibir = $4, descricao = $5, url_leiamais = $6, imagem = $7
            WHERE idnoticia = $8
            RETURNING idnoticia as id, titulo, link, data, exibir, descricao, url_leiamais, imagem
        `;
        const values = [
            noticia.titulo,
            noticia.link || null,
            noticia.data,
            noticia.exibir !== false,
            noticia.descricao,
            noticia.url_leiamais || null,
            noticia.imagem || null,
            id
        ];
        
        try {
            const result = await pool.query(query, values);
            if (result.rows.length === 0) {
                console.log(`⚠️ [DAO - Notícias] Registro com ID ${id} não encontrado para atualizar`);
                return null;
            }
            console.log('✅ [DAO - Notícias] Registro atualizado:', id);
            return result.rows[0];
        } catch (error) {
            console.error('❌ [DAO - Notícias] Erro ao atualizar:', error.message);
            throw error;
        }
    },

    async deletar(id) {
        const query = `
            UPDATE tbnoticias 
            SET exibir = false 
            WHERE idnoticia = $1 
            RETURNING idnoticia as id
        `;
        
        try {
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                console.log(`⚠️ [DAO - Notícias] Registro com ID ${id} não encontrado para ocultar`);
                return null;
            }
            console.log('✅ [DAO - Notícias] Registro ocultado (soft delete):', id);
            return result.rows[0];
        } catch (error) {
            console.error('❌ [DAO - Notícias] Erro ao ocultar:', error.message);
            throw error;
        }
    },

    async deletarPermanente(id) {
        const query = 'DELETE FROM tbnoticias WHERE idnoticia = $1 RETURNING idnoticia as id';
        
        try {
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                console.log(`⚠️ [DAO - Notícias] Registro com ID ${id} não encontrado para deleção permanente`);
                return null;
            }
            console.log('✅ [DAO - Notícias] Registro deletado permanentemente:', id);
            return result.rows[0];
        } catch (error) {
            console.error('❌ [DAO - Notícias] Erro ao deletar permanentemente:', error.message);
            throw error;
        }
    }
};

export default noticiasDAO;