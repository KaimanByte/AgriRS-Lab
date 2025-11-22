import express from 'express';
import noticiasCtrl from '../controle/noticiasCtrl.js';
import autenticarJWT from '../middleware/auth.js';

const rota = express.Router();

rota.get('/', noticiasCtrl.listar);
rota.get('/:id', noticiasCtrl.buscarPorId);

rota.use(autenticarJWT);

rota.post('/', noticiasCtrl.inserir);
rota.put('/:id', noticiasCtrl.atualizar);
rota.delete('/:id', noticiasCtrl.deletar);

export default rota;
