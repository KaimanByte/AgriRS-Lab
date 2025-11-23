import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import rotaPublicacao from "./roteador/publicacaoRota.js";
import vagasRouter from "./roteador/vagasRota.js";
import noticiaRota from './roteador/noticiaRota.js';
import authRota from './roteador/authRota.js';

dotenv.config();

// Para obter __dirname em módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuração CORS mais segura
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Parse de JSON e URL-encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Definir caminhos para arquivos estáticos
const frontPath = path.join(__dirname, '..', '..', 'front');
const uploadsPath = path.join(__dirname, '..', '..', 'uploads');

console.log('📁 Caminhos configurados:');
console.log('   Front:', frontPath);
console.log('   Uploads:', uploadsPath);

// Servir arquivos estáticos
app.use(express.static(frontPath));
app.use('/uploads', express.static(uploadsPath));

// Middleware de logging básico
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    paths: {
      front: frontPath,
      uploads: uploadsPath
    }
  });
});

// Rotas da API
app.use('/auth', authRota);
app.use('/publicacao', rotaPublicacao);
app.use('/oportunidades', vagasRouter);
app.use('/noticias', noticiaRota);
app.use('/noticia', noticiaRota);

// Tratamento 404
app.use((req, res, next) => {
  res.status(404).json({ 
    erro: "Rota não encontrada",
    path: req.path 
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(err.status || 500).json({
    erro: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message
  });
});

// Inicialização do servidor
const PORTA = process.env.PORTA || 3030;

app.listen(PORTA, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Servidor rodando na porta ${PORTA}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Acesse: http://localhost:${PORTA}`);
  console.log(`📁 Uploads: http://localhost:${PORTA}/uploads`);
  console.log(`${'='.repeat(50)}\n`);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('❌ Erro não capturado:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
});