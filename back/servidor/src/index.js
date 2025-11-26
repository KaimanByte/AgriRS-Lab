import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import rotaPublicacao from "./roteador/publicacaoRota.js";
import vagasRouter from "./roteador/vagasRota.js";
import noticiaRota from './roteador/noticiaRota.js';
import authRota from './roteador/authRota.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuração CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());

// Parse de JSON e URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Definir caminhos
const frontPath = path.join(__dirname, '..', '..', '..', 'front');
const uploadsPath = path.join(__dirname, '..', '..', 'uploads');
const pagesPath = path.join(frontPath, 'pages');

console.log('📂 Caminhos configurados:');
console.log('   Front:', frontPath);
console.log('   Pages:', pagesPath);
console.log('   Uploads:', uploadsPath);

// Servir apenas arquivos estáticos públicos (CSS, JS, imagens)
app.use('/styles', express.static(path.join(frontPath, 'styles')));
app.use('/scripts', express.static(path.join(frontPath, 'scripts')));
app.use('/imagens', express.static(path.join(frontPath, 'imagens')));
app.use('/uploads', express.static(uploadsPath));

// BLOQUEAR acesso direto à pasta pages
app.use('/pages', (req, res) => {
  res.status(403).json({ erro: 'Acesso direto aos arquivos HTML não permitido' });
});

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROTAS DA API (DEVEM VIR ANTES DAS PÁGINAS!)
// ============================================
app.use('/auth', authRota);
app.use('/api/publicacao', rotaPublicacao);
app.use('/api/oportunidades', vagasRouter);
app.use('/api/noticias', noticiaRota);

// ============================================
// ROTAS PÚBLICAS (PÁGINAS HTML)
// ============================================

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(pagesPath, '../../front/pages/index.html'));
});

// Páginas públicas
app.get('/sobre', (req, res) => {
  res.sendFile(path.join(pagesPath, '../../front/pages/Sobre.html'));
});

app.get('/contato', (req, res) => {
  res.sendFile(path.join(pagesPath, '../../front/pages/contato.html'));
});

app.get('/membros', (req, res) => {
  res.sendFile(path.join(pagesPath, '../../front/pages/membros.html'));
});

app.get('/noticias', (req, res) => {
  res.sendFile(path.join(pagesPath, '../../front/pages/noticias.html'));
});

app.get('/projetos', (req, res) => {
  res.sendFile(path.join(pagesPath, '../../front/pages/projetos.html'));
});

app.get('/publicacoes', (req, res) => {
  res.sendFile(path.join(pagesPath, '../../front/pages/publicacoes.html'));
});

app.get('/vagas', (req, res) => {
  res.sendFile(path.join(pagesPath, '../../front/pages/vagas.html'));
});

// Página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(pagesPath, '../../front/pages/login.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    paths: { front: frontPath, uploads: uploadsPath }
  });
});

// ============================================
// MIDDLEWARE PARA DESABILITAR CACHE
// ============================================
const noCache = (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
};

// ============================================
// ROTAS PROTEGIDAS (PÁGINAS HTML)
// ============================================

app.get('/admin', noCache, (req, res) => {
  console.log('📄 Servindo: /admin (sem verificação de token no servidor)');
  res.sendFile(path.join(pagesPath, '../../front/pages/crudSelecao.html'));
});

app.get('/admin/noticias', noCache, (req, res) => {
  console.log('📄 Servindo: /admin/noticias (sem verificação de token no servidor)');
  res.sendFile(path.join(pagesPath, '../../front/pages/crud.noticias.html'));
});

app.get('/admin/publicacoes', noCache, (req, res) => {
  console.log('📄 Servindo: /admin/publicacoes (sem verificação de token no servidor)');
  res.sendFile(path.join(pagesPath, '../../front/pages/crudpublicacoes.html'));
});

app.get('/admin/vagas', noCache, (req, res) => {
  console.log('📄 Servindo: /admin/vagas (sem verificação de token no servidor)');
  res.sendFile(path.join(pagesPath, '../../front/pages/crudvagas.html'));
});

// ============================================
// TRATAMENTO DE ERROS
// ============================================

// 404
app.use((req, res, next) => {
  res.status(404).json({ 
    erro: "Rota não encontrada",
    path: req.path 
  });
});

// Erro global
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(err.status || 500).json({
    erro: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message
  });
});

// ============================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================
const PORTA = process.env.PORTA || 3030;

app.listen(PORTA, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Servidor AgriRSlab rodando na porta ${PORTA}`);
  console.log(`🔍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n🌐 PÁGINAS PÚBLICAS:`);
  console.log(`   http://localhost:${PORTA}/`);
  console.log(`   http://localhost:${PORTA}/sobre`);
  console.log(`   http://localhost:${PORTA}/contato`);
  console.log(`   http://localhost:${PORTA}/membros`);
  console.log(`   http://localhost:${PORTA}/noticias`);
  console.log(`   http://localhost:${PORTA}/projetos`);
  console.log(`   http://localhost:${PORTA}/publicacoes`);
  console.log(`   http://localhost:${PORTA}/vagas`);
  console.log(`\n🔐 PÁGINAS ADMINISTRATIVAS (protegidas no cliente):`);
  console.log(`   http://localhost:${PORTA}/login`);
  console.log(`   http://localhost:${PORTA}/admin`);
  console.log(`   http://localhost:${PORTA}/admin/noticias`);
  console.log(`   http://localhost:${PORTA}/admin/publicacoes`);
  console.log(`   http://localhost:${PORTA}/admin/vagas`);
  console.log(`\n🔌 ROTAS DA API:`);
  console.log(`   http://localhost:${PORTA}/api/noticias`);
  console.log(`   http://localhost:${PORTA}/api/publicacao`);
  console.log(`   http://localhost:${PORTA}/api/oportunidades`);
  console.log(`   http://localhost:${PORTA}/auth/login`);
  console.log(`\n📄 Outros:`);
  console.log(`   http://localhost:${PORTA}/uploads`);
  console.log(`\n⚠️  AVISO: Páginas /admin protegidas via JavaScript (authGuard.js)`);
  console.log(`${'='.repeat(60)}\n`);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('❌ Erro não capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
});