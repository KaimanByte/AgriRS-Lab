import pool from '../controladores/bd.js';

(async () => {
    try {
        const testQuery = 'SELECT COUNT(*) as total FROM tbnoticias';
        const result = await pool.query(testQuery);
        console.log('🧪 TESTE: Conexão OK. Total de notícias:', result.rows[0].total);
    } catch (error) {
        console.error('🧪 TESTE: Erro de conexão:', error.message);
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
            noticia.exibir !== false, // default true
            noticia.descricao,
            noticia.url_leiamais || null,
            noticia.imagem || null
        ];
        
        try {
            const result = await pool.query(query, values);
            console.log('✅ Notícia inserida:', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error('❌ Erro ao inserir notícia:', error);
            throw error;
        }
    },

    async listar() {
        const query = `
            SELECT 
                idnoticia as id,
                titulo,
                link,
                data,
                exibir,
                descricao,
                url_leiamais,
                imagem
            FROM tbnoticias 
            WHERE exibir = true
            ORDER BY data DESC, idnoticia DESC
        `;
        
        try {
            const result = await pool.query(query);
            console.log(`✅ ${result.rows.length} notícias listadas`);
            return result.rows;
        } catch (error) {
            console.error('❌ Erro ao listar notícias:', error);
            throw error;
        }
    },

    async buscarPorId(id) {
        const query = `
            SELECT 
                idnoticia as id,
                titulo,
                link,
                data,
                exibir,
                descricao,
                url_leiamais,
                imagem
            FROM tbnoticias 
            WHERE idnoticia = $1
        `;
        
        try {
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                console.log(`⚠️ Notícia com ID ${id} não encontrada`);
                return null;
            }
            console.log('✅ Notícia encontrada:', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error('❌ Erro ao buscar notícia:', error);
            throw error;
        }
    },

    async atualizar(id, noticia) {
        const query = `
            UPDATE tbnoticias
            SET 
                titulo = $1,
                link = $2,
                data = $3,
                exibir = $4,
                descricao = $5,
                url_leiamais = $6,
                imagem = $7
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
                console.log(`⚠️ Notícia com ID ${id} não encontrada para atualizar`);
                return null;
            }
            console.log('✅ Notícia atualizada:', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error('❌ Erro ao atualizar notícia:', error);
            throw error;
        }
    },

    async deletar(id) {
        // Soft delete: apenas marca como não exibir
        const query = `
            UPDATE tbnoticias 
            SET exibir = false 
            WHERE idnoticia = $1 
            RETURNING idnoticia as id
        `;
        
        try {
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                console.log(`⚠️ Notícia com ID ${id} não encontrada para deletar`);
                return null;
            }
            console.log('✅ Notícia ocultada (soft delete):', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error('❌ Erro ao deletar notícia:', error);
            throw error;
        }
    },

    // Método adicional para deletar permanentemente (se necessário)
    async deletarPermanente(id) {
        const query = 'DELETE FROM tbnoticias WHERE idnoticia = $1 RETURNING idnoticia as id';
        
        try {
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                console.log(`⚠️ Notícia com ID ${id} não encontrada`);
                return null;
            }
            console.log('✅ Notícia deletada permanentemente:', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error('❌ Erro ao deletar permanentemente:', error);
            throw error;
        }
    }
};

export default noticiasDAO;