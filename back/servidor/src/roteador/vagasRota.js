import express from "express";
import VagasCtrl from "../controle/vagasCtrl.js";
import { verificarToken } from "../middleware/auth.js";

const rota = express.Router();

console.log('🔧 Rota de vagas carregada');

// Rotas públicas (listar e buscar por ID)
rota.get("/", (req, res, next) => {
    console.log(`🌐 [Vagas] GET ${req.baseUrl || '/api/vagas'}${req.path}`);
    VagasCtrl.listar(req, res, next);
});

rota.get("/:id", (req, res, next) => {
    console.log(`🌐 [Vagas] GET ${req.baseUrl || '/api/vagas'}${req.path} | ID: ${req.params.id}`);
    VagasCtrl.buscar(req, res, next);
});

// Middleware de autenticação para rotas protegidas
rota.use(verificarToken);

// Rotas protegidas (criar, atualizar, deletar)
rota.post("/", (req, res, next) => {
    console.log(`🔐 [Vagas] POST ${req.baseUrl || '/api/vagas'}${req.path} (Protegida)`);
    VagasCtrl.criar(req, res, next);
});

rota.put("/:id", (req, res, next) => {
    console.log(`🔐 [Vagas] PUT ${req.baseUrl || '/api/vagas'}${req.path} (Protegida) | ID: ${req.params.id}`);
    VagasCtrl.atualizar(req, res, next);
});

rota.delete("/:id", (req, res, next) => {
    console.log(`🔐 [Vagas] DELETE ${req.baseUrl || '/api/vagas'}${req.path} (Protegida) | ID: ${req.params.id}`);
    VagasCtrl.excluir(req, res, next);
});

export default rota;