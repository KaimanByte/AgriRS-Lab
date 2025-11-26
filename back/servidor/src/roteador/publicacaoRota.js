import express from "express";
import PublicacaoCtrl from "../controle/publicacaoCtrl.js";
import autenticarJWT from "../middleware/auth.js";

const rota = express.Router();

// Rotas públicas (GET) - qualquer um pode listar e buscar
rota.get("/", PublicacaoCtrl.listar);
rota.get("/:id", PublicacaoCtrl.buscar);

// PROTEÇÃO: Aplicar autenticação JWT nas rotas de modificação
rota.use(autenticarJWT);

// Rotas protegidas (POST, PUT, DELETE) - apenas usuários autenticados
rota.post("/", PublicacaoCtrl.criar);
rota.put("/:id", PublicacaoCtrl.atualizar);
rota.delete("/:id", PublicacaoCtrl.excluir);

export default rota;