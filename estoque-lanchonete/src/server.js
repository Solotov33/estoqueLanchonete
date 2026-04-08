// src/server.js
// Ponto de entrada da aplicacao.
// Configura o Express e inicializa o servidor.

require('dotenv').config(); // carrega o arquivo .env antes de tudo
const express = require('express');
const cors = require('cors');
const app  = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares globais ---
app.use(cors());
app.use(express.json());                        // interpreta JSON no corpo da requisicao
app.use(express.urlencoded({ extended: true })); // interpreta dados de formulario

// --- Rotas ---
const produtoRoutes = require('./routes/produtoRoutes');
app.use('/produtos', produtoRoutes); // todas as rotas de produtos sob /produtos

// Rota raiz: util para checar se o servidor esta no ar
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Estoque - Lanchonete',
    versao: '1.0.0',
    rotas: {
      'GET    /produtos':                      'Lista todos os produtos',
      'GET    /produtos/:id':                  'Busca produto por ID',
      'POST   /produtos':                      'Cria novo produto',
      'PUT    /produtos/:id':                  'Atualiza produto',
      'DELETE /produtos/:id':                  'Deleta produto',
      'GET    /produtos/validade/proximos':     'Produtos que vencem em breve (padrao: 7 dias)',
      'GET    /produtos/validade/proximos?dias=N': 'Produtos que vencem em N dias',
      'GET    /produtos/validade/vencidos':     'Produtos com validade vencida',
    },
  });
});

// Rota fallback: qualquer caminho nao cadastrado retorna 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota nao encontrada.' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Consulte as rotas em http://localhost:${PORT}/`);
});
