import express from 'express';
import noticiasCtrl from '../controle/noticiasCtrl.js';
import { verificarToken } from '../middleware/auth.js';

const rota = express.Router();

console.log('🔧 Rota de notícias carregada');

// Rotas públicas (listar e buscar por ID)
rota.get('/', (req, res, next) => {
    console.log(`🌐 [Notícias] GET ${req.baseUrl || '/api/noticias'}${req.path}`);
    noticiasCtrl.listar(req, res, next);
});

rota.get('/:id', (req, res, next) => {
    console.log(`🌐 [Notícias] GET ${req.baseUrl || '/api/noticias'}${req.path} | ID: ${req.params.id}`);
    noticiasCtrl.buscarPorId(req, res, next);
});

// Middleware de autenticação para rotas protegidas
rota.use(verificarToken);

// Rotas protegidas (criar, atualizar, deletar)
rota.post('/', (req, res, next) => {
    console.log(`🔐 [Notícias] POST ${req.baseUrl || '/api/noticias'}${req.path} (Protegida)`);
    noticiasCtrl.inserir(req, res, next);
});

rota.put('/:id', (req, res, next) => {
    console.log(`🔐 [Notícias] PUT ${req.baseUrl || '/api/noticias'}${req.path} (Protegida) | ID: ${req.params.id}`);
    noticiasCtrl.atualizar(req, res, next);
});

rota.delete('/:id', (req, res, next) => {
    console.log(`🔐 [Notícias] DELETE ${req.baseUrl || '/api/noticias'}${req.path} (Protegida) | ID: ${req.params.id}`);
    noticiasCtrl.deletar(req, res, next);
});

export default rota;