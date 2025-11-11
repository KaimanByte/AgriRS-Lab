import express from "express";
import PublicacaoCtrl from "../controle/publicacaoCtrl.js";

const rota = express.Router();

// CRUD completo de publicações
rota.get("/", PublicacaoCtrl.listar);
rota.get("/:id", PublicacaoCtrl.buscar);
rota.post("/", PublicacaoCtrl.criar);
rota.put("/:id", PublicacaoCtrl.atualizar);
rota.delete("/:id", PublicacaoCtrl.excluir);

export default rota;
    