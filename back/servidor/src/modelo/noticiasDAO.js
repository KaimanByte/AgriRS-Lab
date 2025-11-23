import pool from '../controladores/bd.js';

const noticiasDAO = {
    async inserir(noticia) {
        const query = `
            INSERT INTO tbnoticias (titulo, descricao, data, imagem, url_leiamais)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING idnoticia as id, titulo, descricao, data, imagem, url_leiamais
        `;
        const values = [noticia.titulo, noticia.descricao, noticia.data, noticia.imagem, noticia.url_leiamais];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async listar() {
        const query = 'SELECT idnoticia as id, titulo, descricao, data, imagem, url_leiamais FROM tbnoticias ORDER BY idnoticia DESC';
        const result = await pool.query(query);
        return result.rows;
    },

    async buscarPorId(id) {
        const query = 'SELECT idnoticia as id, titulo, descricao, data, imagem, url_leiamais FROM tbnoticias WHERE idnoticia = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    },

    async atualizar(id, noticia) {
        const query = `
            UPDATE tbnoticias
            SET titulo = $1, descricao = $2, data = $3, imagem = $4, url_leiamais = $5
            WHERE idnoticia = $6
            RETURNING idnoticia as id, titulo, descricao, data, imagem, url_leiamais
        `;
        const values = [noticia.titulo, noticia.descricao, noticia.data, noticia.imagem, noticia.url_leiamais, id];
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    },

    async deletar(id) {
        const query = 'DELETE FROM tbnoticias WHERE idnoticia = $1 RETURNING idnoticia as id';
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }
};

export default noticiasDAO;
