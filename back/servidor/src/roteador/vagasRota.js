import express from "express";
import VagasCtrl from "../controle/vagasCtrl.js";

const rota = express.Router();

rota.get("/", VagasCtrl.listar);
rota.get("/:id", VagasCtrl.buscar);
rota.post("/", VagasCtrl.criar);
rota.put("/:id", VagasCtrl.atualizar);
rota.delete("/:id", VagasCtrl.excluir);

export default rota;
