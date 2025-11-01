
    const API = "http://localhost:3030/publicacao";
    let PUBLICACOES = {}; // mapa local id -> objeto pub

    function formatDate(v) {
      if (!v) return "-";
      const d = new Date(v);
      if (isNaN(d)) return v;
      return d.toLocaleString('pt-BR');
    }

    // Renderiza os cards na área principal usando a mesma estilização (.publicacao)
    function renderPublicacoesCards() {
      const container = document.getElementById("publicacoes-container");
      container.innerHTML = "";
      const pubs = Object.values(PUBLICACOES);
      if (!pubs || pubs.length === 0) {
        container.innerHTML = '<p class="mensagem">Nenhuma publicação disponível.</p>';
        return;
      }

      pubs.forEach(pub => {
        const art = document.createElement("article");
        // mantém classe publicacao para usar CSS existente e adiciona card para filtro/exemplo
        art.className = "publicacao card";
        art.innerHTML = `
          <img src="${pub.imagem_url || '../imagens/Publicacoes/pb01.png'}" alt="${(pub.titulo || '').replace(/"/g,'')}" />
          <h3>${pub.titulo || ''}</h3>
          <p>${pub.descricao || ''}</p>
          <div class="botoes">
            ${pub.pdf_url ? `<a href="${pub.pdf_url}" target="_blank" rel="noopener">PDF</a>` : ''}
            ${pub.citacao_url ? `<a href="${pub.citacao_url}" target="_blank" rel="noopener">Citação</a>` : ''}
            ${pub.doi_url ? `<a href="${pub.doi_url}" target="_blank" rel="noopener">DOI</a>` : ''}
          </div>
          <small class="timestamps">Criado: ${formatDate(pub.criado_em)} • Atualizado: ${formatDate(pub.atualizado_em)}</small>
        `;
        container.appendChild(art);

        // guarda display original para permitir filtro por termo
        art.dataset.displayOriginal = getComputedStyle(art).display || "block";
      });
    }

    // Carregar lista (CRUD) e também repopular os cards principais
    function carregar() {
      fetch(API)
        .then(r => r.json())
        .then(data => {
          const lista = document.getElementById("lista");
          lista.innerHTML = "";
          PUBLICACOES = {};
          data.forEach(pub => {
            PUBLICACOES[pub.idpublicacao] = pub;
            const li = document.createElement("li");
            li.innerHTML = `
              <img class="item-thumb" src="${pub.imagem_url || '../imagens/Publicacoes/pb01.png'}" alt="${(pub.titulo||'').replace(/"/g,'')}" />
              <div class="item-text">
                <b>${pub.titulo}</b> - <span class="descricao">${pub.descricao}</span>
                <div class="item-links">
                  ${pub.pdf_url ? `<a href="${pub.pdf_url}" target="_blank" rel="noopener">PDF</a>` : ''}
                  ${pub.citacao_url ? `<a href="${pub.citacao_url}" target="_blank" rel="noopener">Citação</a>` : ''}
                  ${pub.doi_url ? `<a href="${pub.doi_url}" target="_blank" rel="noopener">DOI</a>` : ''}
                </div>
                <small class="timestamps">Criado: ${formatDate(pub.criado_em)} • Atualizado: ${formatDate(pub.atualizado_em)}</small>
              </div>
              <div class="crud-actions">
                <button class="btn-edit" onclick="editar(${pub.idpublicacao})">Editar</button>
                <button class="btn-delete" onclick="excluir(${pub.idpublicacao})">Excluir</button>
              </div>
            `;
            lista.appendChild(li);
          });

          renderPublicacoesCards();
        })
        .catch(err => {
          console.error('Erro ao carregar publicações:', err);
          document.getElementById("lista").innerHTML = '<li class="mensagem">Erro ao carregar publicações.</li>';
          document.getElementById("publicacoes-container").innerHTML = '<p class="mensagem">Erro ao carregar publicações.</p>';
        });
    }