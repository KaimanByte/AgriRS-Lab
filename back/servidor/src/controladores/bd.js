import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config(); // carrega .env na raiz do processo

const { Pool } = pg;

// Construir config de forma robusta, coerindo tipos
const connectionStringEnv = process.env.DATABASE_URL || process.env.PG_CONNECTION || process.env.BD_CONNECTION;

function buildPoolConfig() {
	// se houver connection string, garantir que seja string
	if (connectionStringEnv) {
		return { connectionString: typeof connectionStringEnv === 'string' ? connectionStringEnv : String(connectionStringEnv) };
	}

	const cfg = {};
	// Prioriza variáveis BD* (do seu .env) e em seguida PG* (compatibilidade)
	const user = process.env.BDUSUARIO || process.env.PGUSER;
	const host = process.env.BDHOST || process.env.PGHOST;
	const database = process.env.BDNOME || process.env.PGDATABASE;
	const password = process.env.BDSENHA || process.env.PGPASSWORD;
	const portEnv = process.env.BDPORTA || process.env.PGPORT;

	if (user !== undefined) cfg.user = String(user);
	if (host !== undefined) cfg.host = String(host);
	if (database !== undefined) cfg.database = String(database);
	if (password !== undefined) cfg.password = String(password); // coerir para string
	if (portEnv !== undefined) {
		const p = Number(portEnv);
		if (!Number.isNaN(p)) cfg.port = p;
	}
	// Se cfg ficar vazio, Pool tentará usar variáveis padrão do ambiente (ou falhar mais adiante)
	return cfg;
}

const poolConfig = buildPoolConfig();

let pool;
try {
	pool = new Pool(poolConfig);
	// previne crash por erro não tratado no cliente conectado
	pool.on('error', (err) => {
		console.error('pool error:', err && err.message ? err.message : err);
	});
} catch (e) {
	// em caso de erro ao criar Pool (ex: formato inválido), criamos um fallback leve
	console.error('Erro ao criar Pool do pg:', e && e.message ? e.message : e);
	pool = {
		// fallback para não quebrar imports; queries lançam erro claro
		query: async () => { throw new Error('Conexão com o banco indisponível: ' + (e && e.message ? e.message : 'erro ao criar pool')); }
	};
}

// Função utilitária para executar queries e logar erros sem lançar exceção que derrube o servidor
async function execCreate(sql) {
	try {
		await pool.query(sql);
		console.log('OK:', sql.split('\n')[0].trim());
	} catch (e) {
		console.log('Erro ao executar criação de tabela:', e && e.message ? e.message : e);
	}
}

// Criação das tabelas compatíveis com os DAOs existentes
const sqlNoticias = `
CREATE TABLE IF NOT EXISTS noticias (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  data DATE NOT NULL,
  imagem TEXT
)`;

const sqlVagas = `
CREATE TABLE IF NOT EXISTS vagas (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  requisitos TEXT NOT NULL,
  salario TEXT,
  empresa TEXT NOT NULL,
  contato TEXT NOT NULL,
  data DATE NOT NULL
) `;

const sqlPublicacoes = `
CREATE TABLE IF NOT EXISTS publicacoes (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  data DATE NOT NULL,
  imagem TEXT
) `;

const sqlTbPublicacao = `
CREATE TABLE IF NOT EXISTS tbpublicacao (
  idpublicacao SERIAL PRIMARY KEY,
  titulo TEXT,
  descricao TEXT,
  imagem_url TEXT,
  pdf_url TEXT,
  citacao_url TEXT,
  doi_url TEXT,
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP
) `;

// Executa criações em background (não bloqueia o start do servidor)
(async () => {
	await execCreate(sqlNoticias);
	await execCreate(sqlVagas);
	await execCreate(sqlPublicacoes);
	await execCreate(sqlTbPublicacao);
})();

// Exporta pool (default e named) para compatibilidade com importações do projeto
export { pool };
export default pool;