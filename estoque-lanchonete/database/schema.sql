-- Script SQL - Estoque Lanchonete
-- Como rodar: mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS estoque_lanchonete
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE estoque_lanchonete;

DROP TABLE IF EXISTS produtos;

CREATE TABLE produtos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(100) NOT NULL,
  quantidade    INT UNSIGNED NOT NULL DEFAULT 0,
  validade      DATE NOT NULL,
  criado_em     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO produtos (nome, quantidade, validade) VALUES
  ('Pao de Hamburguer', 50, DATE_ADD(CURDATE(), INTERVAL  3 DAY)),
  ('Queijo Mussarela',  20, DATE_ADD(CURDATE(), INTERVAL  5 DAY)),
  ('Presunto Fatiado',  15, DATE_ADD(CURDATE(), INTERVAL -2 DAY)),
  ('Maionese 500g',     30, DATE_ADD(CURDATE(), INTERVAL 30 DAY)),
  ('Ketchup 1L',        25, DATE_ADD(CURDATE(), INTERVAL 60 DAY)),
  ('Alface',            10, DATE_ADD(CURDATE(), INTERVAL  1 DAY)),
  ('Refrigerante 2L',   40, DATE_ADD(CURDATE(), INTERVAL 90 DAY)),
  ('Tomate',             8, DATE_ADD(CURDATE(), INTERVAL -5 DAY));
