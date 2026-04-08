// src/server.js
// Ponto de entrada da aplicacao.
// Configura o Express e inicializa o servidor.

require('dotenv').config(); // carrega o arquivo .env antes de tudo
const express = require('express');
const cors = require('cors');
const app  = express();

// CORREÇÃO: O Railway injeta a porta automaticamente na variável process.env.PORT
const PORT = process.env.PORT || 3000; 

// --- Middlewares globais ---
app.use(cors());
app.use(express.json());                        
app.use(express.urlencoded({ extended: true })); 

// --- Rotas ---
const produtoRoutes = require('./routes/produtoRoutes');
app.use('/produtos', produtoRoutes); 

// Rota raiz
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

// Rota fallback
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota nao encontrada.' });
});

// Inicia o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
