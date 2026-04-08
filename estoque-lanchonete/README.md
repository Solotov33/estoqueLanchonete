# API de Estoque — Lanchonete

API REST para controle de estoque com gerenciamento de validade dos produtos.

---

## Estrutura do Projeto

```
estoque-lanchonete/
├── database/
│   └── schema.sql                    ← cria o banco, a tabela e dados de exemplo
├── src/
│   ├── config/
│   │   └── database.js               ← conexao com MySQL (pool de conexoes)
│   ├── models/
│   │   └── produtoModel.js           ← queries SQL (acesso ao banco)
│   ├── controllers/
│   │   └── produtoController.js      ← validacoes + logica + respostas HTTP
│   ├── routes/
│   │   └── produtoRoutes.js          ← definicao das rotas
│   └── server.js                     ← ponto de entrada da aplicacao
├── .env.example                      ← modelo de configuracao
├── package.json
└── README.md
```

### Padrao MVC aplicado

| Camada     | Arquivo                   | Responsabilidade                        |
|------------|---------------------------|-----------------------------------------|
| Model      | produtoModel.js           | Queries SQL, acesso ao banco de dados   |
| View       | JSON retornado pela API   | Representacao dos dados (sem frontend)  |
| Controller | produtoController.js      | Validacao, logica, resposta HTTP        |

---

## Pre-requisitos

- Node.js v18 ou superior
- MySQL v8 ou superior

---

## Como Rodar

### 1. Instalar dependencias

```bash
npm install
```

### 2. Criar o banco de dados

Abra o terminal e execute:

```bash
mysql -u root -p < database/schema.sql
```

Ou abra o MySQL Workbench, copie o conteudo de `database/schema.sql` e execute.

### 3. Configurar variaveis de ambiente

```bash
cp .env.example .env
```

Abra o arquivo `.env` e preencha com suas credenciais:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=estoque_lanchonete
PORT=3000
```

### 4. Iniciar o servidor

```bash
# Desenvolvimento (reinicia automaticamente ao salvar)
npm run dev

# Producao
npm start
```

Saida esperada no terminal:
```
Banco de dados conectado com sucesso!
Servidor rodando em http://localhost:3000
```

---

## Rotas da API

Base URL: `http://localhost:3000`

| Metodo | Rota                                 | Descricao                               |
|--------|--------------------------------------|-----------------------------------------|
| GET    | /produtos                            | Lista todos os produtos                 |
| GET    | /produtos/:id                        | Busca produto por ID                    |
| POST   | /produtos                            | Cria novo produto                       |
| PUT    | /produtos/:id                        | Atualiza produto                        |
| DELETE | /produtos/:id                        | Deleta produto                          |
| GET    | /produtos/validade/proximos?dias=7   | Produtos que vencem nos proximos N dias |
| GET    | /produtos/validade/vencidos          | Produtos com validade vencida           |

---

## Exemplos de Uso

### Criar produto
```
POST /produtos
Content-Type: application/json

{
  "nome": "Pao de Hamburguer",
  "quantidade": 50,
  "validade": "2025-12-31"
}
```

Resposta (201):
```json
{
  "id": 1,
  "nome": "Pao de Hamburguer",
  "quantidade": 50,
  "validade": "2025-12-31",
  "criado_em": "2025-04-06T10:00:00.000Z",
  "atualizado_em": "2025-04-06T10:00:00.000Z"
}
```

### Listar todos
```
GET /produtos
```

### Buscar por ID
```
GET /produtos/1
```

### Atualizar
```
PUT /produtos/1
Content-Type: application/json

{
  "nome": "Pao Integral",
  "quantidade": 30,
  "validade": "2025-11-15"
}
```

### Deletar
```
DELETE /produtos/1
```

### Produtos proximos da validade
```
GET /produtos/validade/proximos          (padrao: 7 dias)
GET /produtos/validade/proximos?dias=3   (customizando para 3 dias)
GET /produtos/validade/proximos?dias=14  (customizando para 14 dias)
```

Resposta:
```json
{
  "mensagem": "Produtos que vencem nos proximos 7 dia(s)",
  "total": 2,
  "produtos": [
    { "id": 6, "nome": "Alface", "quantidade": 10, "validade": "2025-04-07" },
    { "id": 1, "nome": "Pao de Hamburguer", "quantidade": 50, "validade": "2025-04-09" }
  ]
}
```

### Produtos vencidos
```
GET /produtos/validade/vencidos
```

---

## Validacoes

Ao criar ou atualizar, os campos sao validados:

| Campo      | Regra                                              |
|------------|----------------------------------------------------|
| nome       | Obrigatorio, nao pode ser vazio                    |
| quantidade | Obrigatorio, numero inteiro maior ou igual a 0     |
| validade   | Obrigatorio, formato AAAA-MM-DD (ex: 2025-12-31)  |

Exemplo de erro de validacao (400):
```json
{
  "erros": [
    "O campo nome e obrigatorio.",
    "O campo validade deve estar no formato AAAA-MM-DD (ex: 2025-12-31)."
  ]
}
```

---

## Testando com curl

```bash
# Listar produtos
curl http://localhost:3000/produtos

# Criar produto
curl -X POST http://localhost:3000/produtos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Queijo","quantidade":20,"validade":"2025-12-10"}'

# Atualizar produto
curl -X PUT http://localhost:3000/produtos/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Queijo Prato","quantidade":15,"validade":"2025-12-10"}'

# Deletar produto
curl -X DELETE http://localhost:3000/produtos/1

# Proximos da validade (3 dias)
curl "http://localhost:3000/produtos/validade/proximos?dias=3"

# Vencidos
curl http://localhost:3000/produtos/validade/vencidos
```

---

## Tecnologias

- **Node.js** — ambiente de execucao JavaScript
- **Express** — framework para criar a API REST
- **mysql2** — driver MySQL com suporte a async/await
- **dotenv** — carrega variaveis de ambiente do arquivo .env
- **nodemon** — reinicia o servidor automaticamente durante o desenvolvimento
