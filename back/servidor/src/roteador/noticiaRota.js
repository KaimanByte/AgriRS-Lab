import express from 'express';
import noticiasCtrl from '../controle/noticiasCtrl.js';

const rota = express.Router();

rota.post('/', noticiasCtrl.inserir);
rota.get('/', noticiasCtrl.listar);
rota.get('/:id', noticiasCtrl.buscarPorId);
rota.put('/:id', noticiasCtrl.atualizar);
rota.delete('/:id', noticiasCtrl.deletar);

export default rota;
