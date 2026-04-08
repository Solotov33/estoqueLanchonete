// src/controllers/produtoController.js
// Camada CONTROLLER do padrao MVC.
// Recebe a requisicao HTTP, valida os dados,
// chama o Model e devolve a resposta ao cliente.

const ProdutoModel = require('../models/produtoModel');

// --- Funcoes auxiliares (uso interno) ---

// Verifica se uma string esta no formato AAAA-MM-DD e representa uma data valida
function isDataValida(str) {
  if (!str || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const d = new Date(str);
  return !isNaN(d.getTime());
}

// Formata um produto para a resposta, garantindo que a data
// venha sempre como string "AAAA-MM-DD" (o MySQL pode retornar como objeto Date)
function formatarProduto(p) {
  if (!p) return null;
  return {
    ...p,
    validade: new Date(p.validade).toISOString().split('T')[0],
  };
}

// Valida os campos nome, quantidade e validade.
// Retorna um array de mensagens de erro (vazio se tudo estiver ok).
function validarCampos({ nome, quantidade, validade }) {
  const erros = [];

  if (!nome || String(nome).trim() === '') {
    erros.push('O campo "nome" e obrigatorio.');
  }

  if (quantidade === undefined || quantidade === null || quantidade === '') {
    erros.push('O campo "quantidade" e obrigatorio.');
  } else if (!Number.isInteger(Number(quantidade)) || Number(quantidade) < 0) {
    erros.push('O campo "quantidade" deve ser um numero inteiro maior ou igual a 0.');
  }

  if (!validade) {
    erros.push('O campo "validade" e obrigatorio.');
  } else if (!isDataValida(validade)) {
    erros.push('O campo "validade" deve estar no formato AAAA-MM-DD (ex: 2025-12-31).');
  }

  return erros;
}

// --- Controllers (um por rota) ---

const ProdutoController = {

  // GET /produtos
  async listar(req, res) {
    try {
      const produtos = await ProdutoModel.listarTodos();
      return res.json(produtos.map(formatarProduto));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao listar produtos.' });
    }
  },

  // GET /produtos/:id
  async buscarPorId(req, res) {
    try {
      const produto = await ProdutoModel.buscarPorId(req.params.id);
      if (!produto) {
        return res.status(404).json({ erro: 'Produto nao encontrado.' });
      }
      return res.json(formatarProduto(produto));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar produto.' });
    }
  },

  // POST /produtos
  async criar(req, res) {
    try {
      const { nome, quantidade, validade } = req.body;
      const erros = validarCampos({ nome, quantidade, validade });
      if (erros.length > 0) {
        return res.status(400).json({ erros });
      }

      const novo = await ProdutoModel.criar({
        nome: String(nome).trim(),
        quantidade: Number(quantidade),
        validade,
      });

      return res.status(201).json(formatarProduto(novo));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao criar produto.' });
    }
  },

  // PUT /produtos/:id
  async atualizar(req, res) {
    try {
      const existe = await ProdutoModel.buscarPorId(req.params.id);
      if (!existe) {
        return res.status(404).json({ erro: 'Produto nao encontrado.' });
      }

      const { nome, quantidade, validade } = req.body;
      const erros = validarCampos({ nome, quantidade, validade });
      if (erros.length > 0) {
        return res.status(400).json({ erros });
      }

      const atualizado = await ProdutoModel.atualizar(req.params.id, {
        nome: String(nome).trim(),
        quantidade: Number(quantidade),
        validade,
      });

      return res.json(formatarProduto(atualizado));
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao atualizar produto.' });
    }
  },

  // DELETE /produtos/:id
  async deletar(req, res) {
    try {
      const deletado = await ProdutoModel.deletar(req.params.id);
      if (!deletado) {
        return res.status(404).json({ erro: 'Produto nao encontrado.' });
      }
      return res.json({ mensagem: 'Produto deletado com sucesso.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao deletar produto.' });
    }
  },

  // GET /produtos/validade/proximos?dias=7
  async proximosDaValidade(req, res) {
    try {
      const dias = parseInt(req.query.dias) || 7;
      if (dias < 1 || dias > 365) {
        return res.status(400).json({ erro: 'O parametro "dias" deve ser entre 1 e 365.' });
      }
      const produtos = await ProdutoModel.listarProximosDaValidade(dias);
      return res.json({
        mensagem: `Produtos que vencem nos proximos ${dias} dia(s)`,
        total: produtos.length,
        produtos: produtos.map(formatarProduto),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar produtos proximos da validade.' });
    }
  },

  // GET /produtos/validade/vencidos
  async vencidos(req, res) {
    try {
      const produtos = await ProdutoModel.listarVencidos();
      return res.json({
        mensagem: 'Produtos com validade vencida',
        total: produtos.length,
        produtos: produtos.map(formatarProduto),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar produtos vencidos.' });
    }
  },
};

module.exports = ProdutoController;
