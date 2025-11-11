import pool from '../controladores/bd.js';

const noticiasDAO = {
  inserir: async (noticia) => {
    try {
      const sql = 'INSERT INTO tbnoticias (titulo, link, postagem, descricao, url_leiamais, exibir) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      const params = [
        noticia.titulo,
        noticia.imagem || '', // imagem
        noticia.data,         // data/postagem
        noticia.descricao,    // descrição completa
        noticia.url_leiamais || '', // url para leia mais
        true
      ];
      const { rows } = await pool.query(sql, params);
      const r = rows[0];
      return {
        id: r.idnoticia,
        titulo: r.titulo,
        descricao: r.descricao || '',
        data: r.postagem,
        imagem: r.link,
        url_leiamais: r.url_leiamais
      };
    } catch (err) {
      console.error('Erro ao inserir notícia:', err);
      throw err;
    }
  },

  listar: async () => {
    const sql = 'SELECT * FROM tbnoticias WHERE exibir = true ORDER BY postagem DESC';
    const { rows } = await pool.query(sql);
    return rows.map(r => ({
      id: r.idnoticia,
      titulo: r.titulo,
      descricao: r.descricao || '', // usa campo descricao próprio
      data: r.postagem,
      imagem: r.link,
      url_leiamais: r.url_leiamais
    }));
  },

  buscarPorId: async (id) => {
    const sql = 'SELECT * FROM tbnoticias WHERE idnoticia = $1';
    const { rows } = await pool.query(sql, [id]);
    if (!rows.length) return null;
    const r = rows[0];
    return {
      id: r.idnoticia,
      titulo: r.titulo,
      descricao: r.descricao || '',
      data: r.postagem,
      imagem: r.link,
      url_leiamais: r.url_leiamais
    };
  },

  atualizar: async (id, noticia) => {
    const sql = 'UPDATE tbnoticias SET titulo=$1, link=$2, postagem=$3, descricao=$4, url_leiamais=$5 WHERE idnoticia=$6 RETURNING *';
    const params = [
      noticia.titulo,
      noticia.imagem || '', // campo 'link' guarda a URL da imagem
      noticia.data,
      noticia.descricao || '',
      noticia.url_leiamais || '',
      id
    ];
    const { rows } = await pool.query(sql, params);
    const r = rows[0];
    return {
      id: r.idnoticia,
      titulo: r.titulo,
      descricao: r.descricao || '',
      data: r.postagem,
      imagem: r.link,
      url_leiamais: r.url_leiamais
    };
  },

  deletar: async (id) => {
    // soft delete: apenas marca como não exibível
    const sql = 'UPDATE tbnoticias SET exibir=false WHERE idnoticia=$1 RETURNING *';
    const { rows } = await pool.query(sql, [id]);
    return rows[0];
  }
};

export default noticiasDAO;
