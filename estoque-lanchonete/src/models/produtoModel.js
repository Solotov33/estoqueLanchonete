// src/models/produtoModel.js
// Camada MODEL do padrao MVC.
// Aqui ficam SOMENTE as queries SQL.
// O Model nao sabe nada sobre HTTP, requisicoes ou respostas.

const db = require('../config/database');

const ProdutoModel = {

  // Retorna todos os produtos, ordenados por nome
  async listarTodos() {
    const [rows] = await db.query(
      'SELECT * FROM produtos ORDER BY nome ASC'
    );
    return rows;
  },

  // Retorna um produto pelo ID (ou undefined se nao encontrar)
  async buscarPorId(id) {
    const [rows] = await db.query(
      'SELECT * FROM produtos WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  // Insere um novo produto e retorna o registro criado
  async criar({ nome, quantidade, validade }) {
    const [result] = await db.query(
      'INSERT INTO produtos (nome, quantidade, validade) VALUES (?, ?, ?)',
      [nome, quantidade, validade]
    );
    return this.buscarPorId(result.insertId);
  },

  // Atualiza um produto existente e retorna o registro atualizado
  async atualizar(id, { nome, quantidade, validade }) {
    await db.query(
      'UPDATE produtos SET nome = ?, quantidade = ?, validade = ? WHERE id = ?',
      [nome, quantidade, validade, id]
    );
    return this.buscarPorId(id);
  },

  // Deleta um produto. Retorna true se deletou, false se nao encontrou
  async deletar(id) {
    const [result] = await db.query(
      'DELETE FROM produtos WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  // Retorna produtos que vencem nos proximos X dias (incluindo hoje)
  // CURDATE() = data de hoje no MySQL
  // DATE_ADD(CURDATE(), INTERVAL ? DAY) = hoje + X dias
  async listarProximosDaValidade(dias = 7) {
    const [rows] = await db.query(
      `SELECT * FROM produtos
       WHERE validade >= CURDATE()
         AND validade <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
       ORDER BY validade ASC`,
      [dias]
    );
    return rows;
  },

  // Retorna produtos cuja validade ja passou (antes de hoje)
  async listarVencidos() {
    const [rows] = await db.query(
      `SELECT * FROM produtos
       WHERE validade < CURDATE()
       ORDER BY validade ASC`
    );
    return rows;
  },
};

module.exports = ProdutoModel;
