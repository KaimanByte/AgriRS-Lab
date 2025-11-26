import express from "express";
import VagasCtrl from "../controle/vagasCtrl.js";
import autenticarJWT from "../middleware/auth.js";

const rota = express.Router();

// Rotas públicas (GET) - qualquer um pode listar e buscar
rota.get("/", VagasCtrl.listar);
rota.get("/:id", VagasCtrl.buscar);

// PROTEÇÃO: Aplicar autenticação JWT nas rotas de modificação
rota.use(autenticarJWT);

// Rotas protegidas (POST, PUT, DELETE) - apenas usuários autenticados
rota.post("/", VagasCtrl.criar);
rota.put("/:id", VagasCtrl.atualizar);
rota.delete("/:id", VagasCtrl.excluir);

export default rota;