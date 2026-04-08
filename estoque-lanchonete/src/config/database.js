// src/config/database.js
// Responsavel por criar e exportar a conexao com o MySQL.
// Usa "pool" de conexoes: um grupo de conexoes reutilizaveis,
// mais eficiente do que abrir/fechar uma conexao a cada requisicao.

const mysql = require('mysql2/promise'); // versao com suporte a async/await
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'mysql.railway.internal',
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || 'FGCkUYIgeYhzCkFBmLtLndthczBFSBtE',
  database: process.env.DB_NAME     || 'railway',
  waitForConnections: true, // espera se nao houver conexao livre
  connectionLimit:    10,   // maximo de conexoes simultaneas
  queueLimit:         0,    // sem limite de fila de espera
});

// Testa a conexao ao iniciar o servidor
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('Banco de dados conectado com sucesso!');
    conn.release(); // devolve a conexao ao pool
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    process.exit(1); // encerra a aplicacao se nao conseguir conectar
  }
})();

module.exports = pool;
