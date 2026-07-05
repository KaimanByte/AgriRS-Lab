import express from "express";
import PublicacaoCtrl from "../controle/publicacaoCtrl.js";
import { verificarToken } from "../middleware/auth.js";

const rota = express.Router();

console.log('🔧 Rota de publicações carregada');

// Rotas públicas (listar e buscar por ID)
rota.get("/", (req, res, next) => {
    console.log(`🌐 [Publicações] GET ${req.baseUrl || '/api/publicacoes'}${req.path}`);
    PublicacaoCtrl.listar(req, res, next);
});

rota.get("/:id", (req, res, next) => {
    console.log(`🌐 [Publicações] GET ${req.baseUrl || '/api/publicacoes'}${req.path} | ID: ${req.params.id}`);
    PublicacaoCtrl.buscar(req, res, next);
});

// Middleware de autenticação para rotas protegidas
rota.use(verificarToken);

// Rotas protegidas (criar, atualizar, deletar)
rota.post("/", (req, res, next) => {
    console.log(`🔐 [Publicações] POST ${req.baseUrl || '/api/publicacoes'}${req.path} (Protegida)`);
    PublicacaoCtrl.criar(req, res, next);
});

rota.put("/:id", (req, res, next) => {
    console.log(`🔐 [Publicações] PUT ${req.baseUrl || '/api/publicacoes'}${req.path} (Protegida) | ID: ${req.params.id}`);
    PublicacaoCtrl.atualizar(req, res, next);
});

rota.delete("/:id", (req, res, next) => {
    console.log(`🔐 [Publicações] DELETE ${req.baseUrl || '/api/publicacoes'}${req.path} (Protegida) | ID: ${req.params.id}`);
    PublicacaoCtrl.excluir(req, res, next);
});

export default rota;