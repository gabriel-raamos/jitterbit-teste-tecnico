# Jitterbit - Teste técnico

Projeto de REST API  feita com Node + MySQL. Se baseia no gerenciamento de pedidos.

---

## Ferramentas

- Node.js 20+
- MySQL 8+

---

## Setup

```bash
# clone o repositório
git clone https://github.com/gabriel-raamos/jitterbit-teste-tecnico.git
cd jitterbit-teste-tecnico
```

```bash
# instale as dependências
npm install
```

### Variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env
```

| Variável        | Descrição                              | Exemplo                  |
|-----------------|----------------------------------------|--------------------------|
| `PORT`          | Porta onde a API irá rodar             | `3000`                   |
| `DB_HOST`       | Host do banco de dados                 | `localhost`              |
| `DB_PORT`       | Porta do MySQL                         | `3306`                   |
| `DB_USER`       | Usuário do MySQL                       | `root`                   |
| `DB_PASSWORD`   | Senha do MySQL                         | `sua_senha`              |
| `DB_NAME`       | Nome do banco de dados                 | `jitterbit_orders`       |
| `JWT_SECRET`    | Chave secreta para assinar os tokens   | `segredo_forte_aqui`     |
| `JWT_EXPIRES_IN`| Tempo de expiração do token            | `'8h' ou milissegundos`                     |
| `API_USERNAME`  | Usuário para login na API              | `admin`                  |
| `API_PASSWORD`  | Senha para login na API                | `senha123`               |

---

## Banco de dados

Execute o script SQL para criar o banco e as tabelas:

```bash
mysql -u root -p < config/criarbanco.sql
```

Isso criará as seguintes tabelas:

**Order**
| Coluna         | Tipo           | Descrição              |
|----------------|----------------|------------------------|
| `id`           | INT (PK)       | ID interno auto-increment |
| `orderId`      | VARCHAR(100)   | Número único do pedido |
| `value`        | DECIMAL(12,2)  | Valor total do pedido  |
| `creationDate` | DATETIME       | Data de criação        |

**Items**
| Coluna      | Tipo          | Descrição                        |
|-------------|---------------|----------------------------------|
| `id`        | INT (PK)      | ID interno auto-increment        |
| `orderId`   | VARCHAR(100)  | Referência ao pedido (FK)        |
| `productId` | INT           | ID do produto                    |
| `quantity`  | INT           | Quantidade                       |
| `price`     | DECIMAL(12,2) | Preço unitário                   |

---

## Rodando a API

```bash
# Desenvolvimento (reinicia automaticamente ao salvar)
npm run dev

# Produção
npm start
```

A API estará disponível em `http://localhost:3000`.

---

## Autenticação

Todas as rotas de pedido (`/order`) são protegidas por **JWT (JSON Web Token)**.

O fluxo é:

1. Faça login em `POST /auth/login` e receba o token
2. Inclua o token no header de todas as requisições seguintes:

```
Authorization: Bearer <seu_token_aqui>
```

O token expira conforme configurado em `JWT_EXPIRES_IN` (padrão: 8 horas).

---

## Endpoints

### Base URL
```
http://localhost:3000
```

---

### Auth

#### `POST /auth/login`
Autentica o usuário e retorna um token JWT.

> ❌ Não requer autenticação

**Request body:**
```json
{
  "username": "admin",
  "password": "senha123"
}
```

**Resposta de sucesso — `200 OK`:**
```json
{
  "message": "Login realizado com sucesso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta de erro — `401 Unauthorized`:**
```json
{
  "error": "Credenciais inválidas."
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "senha123"}'
```

---

### Pedidos

> ✅ Todos os endpoints abaixo exigem o header `Authorization: Bearer <token>`

---

#### `POST /order`
Cria um novo pedido.

**Request body:**
```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

**Resposta de sucesso — `201 Created`:**
```json
{
  "message": "Pedido criado com sucesso.",
  "order": {
    "orderId": "v10089015vdb-01",
    "value": 10000,
    "creationDate": "2023-07-19T12:24:11.000Z",
    "items": [
      {
        "productId": 2434,
        "quantity": 1,
        "price": 1000
      }
    ]
  }
}
```

**Respostas de erro:**
| Status | Motivo |
|--------|--------|
| `400 Bad Request` | Campos obrigatórios ausentes ou `items` vazio |
| `401 Unauthorized` | Token ausente ou inválido |
| `409 Conflict` | Já existe um pedido com esse `numeroPedido` |

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.529Z",
    "items": [{"idItem": "2434", "quantidadeItem": 1, "valorItem": 1000}]
  }'
```

---

#### `GET /order/list`
Retorna todos os pedidos cadastrados.

**Resposta de sucesso — `200 OK`:**
```json
[
  {
    "orderId": "v10089015vdb-01",
    "value": 10000,
    "creationDate": "2023-07-19T12:24:11.000Z",
    "items": [
      {
        "productId": 2434,
        "quantity": 1,
        "price": 1000
      }
    ]
  }
]
```

**Exemplo cURL:**
```bash
curl http://localhost:3000/order/list \
  -H "Authorization: Bearer <token>"
```

---

#### `GET /order/:orderId`
Retorna os dados de um pedido específico.

**Parâmetro de URL:**
| Parâmetro | Tipo   | Descrição             |
|-----------|--------|-----------------------|
| `orderId` | string | Número único do pedido |

**Resposta de sucesso — `200 OK`:**
```json
{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.000Z",
  "items": [
    {
      "productId": 2434,
      "quantity": 1,
      "price": 1000
    }
  ]
}
```

**Respostas de erro:**
| Status | Motivo |
|--------|--------|
| `401 Unauthorized` | Token ausente ou inválido |
| `404 Not Found` | Pedido não encontrado |

**Exemplo cURL:**
```bash
curl http://localhost:3000/order/v10089015vdb-01 \
  -H "Authorization: Bearer <token>"
```

---

#### `PUT /order/:orderId`
Atualiza os dados de um pedido existente. Envie apenas os campos que deseja alterar.

**Parâmetro de URL:**
| Parâmetro | Tipo   | Descrição              |
|-----------|--------|------------------------|
| `orderId` | string | Número único do pedido |

**Request body** (todos os campos são opcionais):
```json
{
  "valorTotal": 12000,
  "dataCriacao": "2023-07-20T10:00:00.000Z",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 2,
      "valorItem": 6000
    }
  ]
}
```

> ⚠️ Se `items` for enviado, **todos os itens anteriores serão substituídos**.

**Resposta de sucesso — `200 OK`:**
```json
{
  "message": "Pedido atualizado com sucesso.",
  "order": {
    "orderId": "v10089015vdb-01",
    "value": 12000,
    "creationDate": "2023-07-20T10:00:00.000Z",
    "items": [
      {
        "productId": 2434,
        "quantity": 2,
        "price": 6000
      }
    ]
  }
}
```

**Respostas de erro:**
| Status | Motivo |
|--------|--------|
| `401 Unauthorized` | Token ausente ou inválido |
| `404 Not Found` | Pedido não encontrado |

**Exemplo cURL:**
```bash
curl -X PUT http://localhost:3000/order/v10089015vdb-01 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"valorTotal": 12000}'
```

---

#### `DELETE /order/:orderId`
Remove um pedido e todos os seus itens.

**Parâmetro de URL:**
| Parâmetro | Tipo   | Descrição              |
|-----------|--------|------------------------|
| `orderId` | string | Número único do pedido |

**Resposta de sucesso — `200 OK`:**
```json
{
  "message": "Pedido removido com sucesso."
}
```

**Respostas de erro:**
| Status | Motivo |
|--------|--------|
| `401 Unauthorized` | Token ausente ou inválido |
| `404 Not Found` | Pedido não encontrado |

**Exemplo cURL:**
```bash
curl -X DELETE http://localhost:3000/order/v10089015vdb-01 \
  -H "Authorization: Bearer <token>"
```

---

## Códigos de resposta

| Código | Significado |
|--------|-------------|
| `200 OK` | Requisição bem-sucedida |
| `201 Created` | Recurso criado com sucesso |
| `400 Bad Request` | Dados inválidos ou campos obrigatórios ausentes |
| `401 Unauthorized` | Token ausente, inválido ou expirado |
| `404 Not Found` | Recurso não encontrado |
| `409 Conflict` | Conflito — recurso já existe |
| `500 Internal Server Error` | Erro inesperado no servidor |

---

## Estrutura do projeto

```
src/
├── config/
│   ├── database.js          # Pool de conexão MySQL
│   ├── migrate.sql          # Script de criação das tabelas
│   └── swagger.js           # Configuração do Swagger/OpenAPI
├── controllers/
│   ├── authController.js    # Login e geração de token JWT
│   └── orderController.js   # CRUD de pedidos
├── middleware/
│   └── auth.js              # Validação do token JWT
├── models/
│   └── orderModel.js        # Queries ao banco + mapeamento de campos
├── routes/
│   ├── authRoutes.js        # Rotas de autenticação
│   └── orderRoutes.js       # Rotas de pedidos (protegidas)
├── app.js                   # Configuração do Express
└── server.js                # Ponto de entrada da aplicação
```

---

## Mapeamento de campos

A API recebe os dados em português e os transforma antes de salvar no banco:

| Campo recebido (input)    | Campo no banco (output) |
|---------------------------|-------------------------|
| `numeroPedido`            | `orderId`               |
| `valorTotal`              | `value`                 |
| `dataCriacao`             | `creationDate`          |
| `items[].idItem`          | `productId`             |
| `items[].quantidadeItem`  | `quantity`              |
| `items[].valorItem`       | `price`                 |
