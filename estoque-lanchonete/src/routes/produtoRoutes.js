// src/routes/produtoRoutes.js
// Define todas as rotas relacionadas a produtos.
//
// ATENCAO: rotas especificas (/validade/proximos, /validade/vencidos)
// devem vir ANTES das rotas com parametro dinamico (/:id).
// Caso contrario o Express interpretaria "proximos" como um ID.

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/produtoController');

// Rotas de validade (especificas - precisam vir primeiro)
router.get('/validade/proximos', ctrl.proximosDaValidade);
router.get('/validade/vencidos', ctrl.vencidos);

// CRUD
router.get('/',      ctrl.listar);
router.get('/:id',   ctrl.buscarPorId);
router.post('/',     ctrl.criar);
router.put('/:id',   ctrl.atualizar);
router.delete('/:id', ctrl.deletar);

module.exports = router;
