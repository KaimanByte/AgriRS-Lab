# Requisitos do Sistema

## RF01 – Página Inicial e Navegação

### RF01.1 – Menus de navegação
- Devem existir menus visíveis na página inicial que levem a todas as páginas principais
- Os menus devem funcionar em dispositivos móveis e desktop
- Os links devem redirecionar corretamente para cada seção

### RF01.2 – Seções em destaque
- A página inicial deve conter seções com chamadas visuais para notícias, projetos e publicações
- Cada seção deve ser clicável e levar à página correspondente

### RF01.3 – Rodapé com redes sociais e contato
- O rodapé deve conter ícones ou links para redes sociais e e-mail institucional
- Os links devem abrir corretamente em nova aba ou redirecionar conforme esperado

### RF01.4 – Colaboradores e financiadores
- Deve haver uma seção visível com logos ou nomes de instituições como CNPq, CAPES e FAPESP
- Os logos devem estar alinhados e com links (se aplicável) para os sites das instituições

## RF02 – Sobre e Equipe

### RF02.1 – Página "Sobre"
- Deve conter texto explicativo sobre missão, objetivos e foco do laboratório
- O conteúdo deve ser acessível e responsivo

### RF02.2.1 – Lista de membros
- Cada membro deve ter nome, foto, função e breve descrição
- As informações devem estar organizadas em cards ou lista visualmente clara

### RF02.2.2 / RF02.2.3 – Categorias e ordenação
- Os membros devem estar agrupados por tipo (ex: titular, colaborador, aluno)
- Dentro de cada grupo, os nomes devem estar em ordem alfabética

### RF02.3.1 – Colaboradores e financiadores (página dedicada)
- Deve haver uma página com lista ou logos dos parceiros
- Cada parceiro deve ter nome, descrição e link (se aplicável)

### RF02.4.1 / RF02.4.2 – Página de vagas
- Deve listar oportunidades com título, tipo (estágio, IC etc.), e instruções de candidatura
- Deve conter prazos, critérios e documentos exigidos

## RF03 – Projetos

### RF03.1 – Listar integrantes
- Deve exibir todos os membros com nome, foto, função e descrição
- As informações devem estar completas e atualizadas

### RF03.2 – Categorizar por tipo de membro
- Os membros devem estar agrupados por tipo (ex: pesquisador, bolsista)
- Cada grupo deve estar visualmente separado

### RF03.3 – Ordenar alfabeticamente
- Dentro de cada categoria, os nomes devem estar em ordem alfabética
- A ordenação deve ser automática e consistente

## RF04 – Publicações e Pesquisa

### RF04.1 – Listar publicações
- Deve exibir título, revista, autores, ano e link para cada publicação
- Os dados devem estar organizados em tabela ou cards

### RF04.2 – Campo de pesquisa
- Deve haver campo de busca por palavra-chave
- A busca deve retornar resultados relevantes e destacar os termos encontrados

## RF05 – Projetos (detalhamento)

### RF05.1 – Listar projetos com detalhes
- Cada projeto deve conter título, resumo, ano de início, status e equipe envolvida
- Os dados devem estar organizados e acessíveis

### RF05.2 – Imagens e links adicionais
- Deve permitir inclusão de imagem ilustrativa por projeto
- Deve permitir link externo ou interno para mais informações

## RF06 – Notícias

### RF06.1 – Publicação de notícias
- Deve permitir cadastro de título, data, imagem e texto
- Deve haver validação dos campos obrigatórios

### RF06.2 – Organização cronológica
- As notícias devem ser exibidas da mais recente para a mais antiga
- A ordenação deve ser automática com base na data de publicação

## RF07 – Produção Científica

### RF07.1 – Listar artigos e livros
- Deve exibir título, revista, autores, ano e link para cada item
- Os links devem abrir corretamente

### RF07.2 – Campo de pesquisa por palavra-chave
- Deve haver campo de busca funcional
- A busca deve retornar resultados relevantes e permitir filtragem

## RF08 – Contato

### RF08.1 – Formulário de contato
- Deve conter campos: nome, e-mail, assunto e mensagem
- Todos os campos devem ser obrigatórios
- O envio deve redirecionar para e-mail institucional e exibir confirmação

### RF08.2 – Informações institucionais
- Deve exibir telefone, e-mail e endereço do laboratório
- As informações devem estar visíveis e atualizadas

### RF08.3 – Links para redes sociais
- Deve conter ícones ou links para redes sociais oficiais
- Os links devem abrir corretamente

### RF08.4 – Mapa de localização
- Deve exibir mapa interativo ou imagem com localização dentro do INPE
- O mapa deve ser responsivo e funcional

## Requisitos Não Funcionais (RNF)

### RNF01 – Responsividade
- O site deve funcionar corretamente em celulares, tablets e computadores
- Os elementos devem se adaptar sem quebra de layout

### RNF02 – Facilidade de atualização
- O conteúdo deve ser gerenciável via CMS ou painel administrativo
- Deve permitir edição sem necessidade de conhecimento técnico

### RNF03 – Tempo de carregamento
- O site deve carregar em menos de 3 segundos em conexão padrão
- Imagens devem ser otimizadas e recursos minimizados

### RNF04 – Idiomas
- Deve haver opção de alternar entre português e inglês
- Todo o conteúdo deve estar traduzido corretamente

### RNF05 – Hospedagem e domínio
- O site deve estar hospedado em serviço com uptime ≥ 99%
- Deve utilizar domínio próprio (.org, .br, etc.)

### RNF06 – Identidade visual
- O layout deve seguir paleta de cores, tipografia e logotipo definidos pelo laboratório
- Deve haver consistência visual entre páginas