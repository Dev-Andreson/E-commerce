# 🛒 GrauTec Shop — E-commerce Poliglota

Projeto final da disciplina de **Banco de Dados** (turma DS/13-N) — um e-commerce completo que demonstra integração entre **três bancos de dados** atuando em papéis distintos: **MongoDB** (catálogo), **Redis** (carrinho) e **PostgreSQL** (pedidos).

---

## 🎯 Sobre o projeto

Uma API **poliglota** (que fala com múltiplos bancos simultaneamente) com uma vitrine virtual funcional. O sistema prova, na prática, por que grandes empresas como Netflix, Uber e iFood usam bancos especializados para cada tipo de dado:

| Banco | Papel | Por quê |
|---|---|---|
| 🍃 **MongoDB** | Catálogo de produtos | Documentos flexíveis, ideal para produtos com atributos variáveis |
| 🔴 **Redis** | Carrinho de compras | Em memória, ultra rápido, com TTL de 7 dias |
| 🐘 **PostgreSQL** | Pedidos finais | Transações ACID para dados financeiros |

---

## ✨ Funcionalidades

### 👤 Dois perfis de usuário (RBAC)
- **Admin** — cadastra, edita e remove produtos do catálogo.
- **Cliente** — navega no catálogo, adiciona ao carrinho, finaliza compras e devolve pedidos.

O controle de acesso é feito via **JWT** com `role` no payload e um middleware `requireRole()` protegendo as rotas.

### 🛍️ Fluxo do cliente
1. Cadastro e login com JWT.
2. Navegação no catálogo (consome do MongoDB).
3. Adicionar produtos ao carrinho (grava no Redis com TTL).
4. Ajustar quantidades / remover itens.
5. Finalizar compra → pedido gravado no Postgres em transação atômica.
6. Devolver pedido → status atualizado + estoque restaurado no MongoDB.

### 🛠️ Fluxo do admin
1. Cadastro e login como administrador.
2. Cadastro de produtos via modal no frontend.
3. Visualização do catálogo completo.

### 🔒 Regras de negócio
- Estoque é **validado antes** de fechar o pedido.
- Estoque é **decrementado atomicamente** com `findOneAndUpdate` (evita venda duplicada).
- Produtos com estoque zerado **somem do catálogo** automaticamente.
- Carrinho é limpo **somente após** o pedido ser gravado com sucesso.
- Devolução **restaura estoque** e só pode ser feita uma vez por pedido.

---

## 🧰 Tecnologias

### Backend
- **Node.js** (ES Modules)
- **Express** — framework HTTP
- **Mongoose** — ODM do MongoDB
- **pg** — driver do PostgreSQL
- **redis** — cliente oficial do Redis
- **jsonwebtoken** — autenticação JWT
- **bcrypt** — hash de senhas
- **cors** — liberação de CORS
- **dotenv** — gerenciamento de variáveis de ambiente
- **nodemon** — hot reload em desenvolvimento

### Frontend
- **HTML5 + CSS3 + JavaScript** (ES Modules nativos)
- Zero framework, zero build — `fetch()` puro
- Arquitetura modular em `js/`

### Bancos (via cloud)
- **MongoDB Atlas** — cluster free tier
- **Redis Cloud** — instância free tier
- **PostgreSQL** — instância local

---

## 📁 Estrutura do projeto

```text
E-commerce/
├── backend/
│   ├── src/
│   │   ├── config/          # Conexões com os 3 bancos
│   │   │   ├── mongodb.js
│   │   │   ├── postgres.js
│   │   │   └── redis.js
│   │   ├── controllers/     # Recebem req/res, delegam para services
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js # Valida JWT
│   │   │   ├── roleMiddleware.js # Valida role (admin/cliente)
│   │   │   └── errorMiddleware.js # Tratamento centralizado de erros
│   │   ├── models/          # Schemas do Mongoose
│   │   ├── repositories/    # Acesso direto aos bancos
│   │   ├── routes/          # Definição das rotas
│   │   ├── services/        # Regras de negócio
│   │   ├── validators/      # Validação de entrada
│   │   ├── app.js           # Configuração do Express
│   │   └── servidor.js      # Bootstrap (conecta bancos + sobe app)
│   ├── .env                 # NÃO versionar (ver .env.example)
│   ├── .env.example
│   ├── package.json
│   └── sql/
│       └── init.sql         # Criação das tabelas do Postgres
│
└── frontend/
    ├── index.html
    ├── css/
    │   └── styles.css
    └── js/
        ├── config.js        # URL da API e constantes
        ├── state.js         # Estado global + localStorage
        ├── api.js           # Wrapper do fetch
        ├── ui.js            # Toast, formatação, navegação
        ├── auth.js          # Login / registro / logout
        ├── produtos.js      # Catálogo
        ├── produtos-form.js # Modal de cadastro (admin)
        ├── carrinho.js      # Carrinho + checkout
        ├── pedidos.js       # Histórico + devolução
        └── app.js           # Bootstrap + listeners
```

---

## 🚀 Como rodar

### Pré-requisitos
- **Node.js** 18+ ([download](https://nodejs.org))
- **PostgreSQL** local ([download](https://www.postgresql.org/download/))
- Conta no **MongoDB Atlas** ([cloud.mongodb.com](https://cloud.mongodb.com))
- Conta no **Redis Cloud** ([app.redislabs.com](https://app.redislabs.com))

### 1. Clonar e instalar
```bash
git clone <url-do-repo>
cd E-commerce/backend
npm install
```

### 2. Configurar variáveis de ambiente
Crie `backend/.env` baseado em `.env.example`:

```env
# Servidor
PORT=3000

# JWT — gere com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=sua_string_aleatoria_longa

# MongoDB Atlas
MONGO_URL=mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/grautecShop?retryWrites=true&w=majority

# Redis Cloud
REDIS_URL=rediss://default:SENHA@host.redis.io:PORTA

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASS=sua_senha
POSTGRES_DB=ecommerce
```

**Dicas:**
- **MongoDB Atlas** → libere seu IP em *Network Access* → *Add IP Address*.
- **Redis Cloud** → se o painel marcar TLS habilitado, use `rediss://` (dois "s").
- **Senhas com caracteres especiais** → URL-encode (`@` → `%40`, `!` → `%21`).

### 3. Criar as tabelas no PostgreSQL
```bash
psql -h localhost -U postgres -d ecommerce -f sql/init.sql
```

Ou cole o conteúdo do `sql/init.sql` no pgAdmin:

```sql
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'cliente'
);

CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  valor_total NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pago',
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedido_itens (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id VARCHAR(24) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  preco NUMERIC(10,2) NOT NULL,
  quantidade INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_itens_pedido ON pedidos(pedido_id);
```

### 4. Subir o backend
```bash
npm run dev
```

**Saída esperada:**
```text
MongoDB conectado
Conectado com o PostgreSql
🔌 Conectando ao Redis...
✅ Redis conectado
🚀 Servidor rodando na porta 3000
```

### 5. Subir o frontend
Em outro terminal:
```bash
cd E-commerce/frontend
npx serve . -l 5500
```

Abra `http://localhost:5500`.

⚠️ *Não abra o `index.html` com duplo clique (`file://`) — o navegador bloqueia ES Modules. Sirva via HTTP.*

---

## 🔌 Endpoints da API

Base URL: `http://localhost:3000/api`

### 🔐 Autenticação (público)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Criar conta — `{ name, email, password, role }` |
| `POST` | `/auth/login` | Login — `{ email, password }` → `{ usuario, token }` |

### 🍃 Produtos (MongoDB)

| Método | Rota | Auth | Role | Descrição |
|---|---|---|---|---|
| `GET` | `/produtos` | ❌ | — | Lista catálogo (oculta sem estoque) |
| `GET` | `/produtos/:id` | ❌ | — | Busca produto por ID |
| `POST` | `/produtos` | ✅ | `admin` | Cadastra produto |
| `PUT` | `/produtos/:id` | ✅ | `admin` | Edita produto |
| `DELETE` | `/produtos/:id` | ✅ | `admin` | Remove produto |

**Body do cadastro:**
```json
{
  "nome": "Fone Bluetooth",
  "descricao": "Over-ear com cancelamento de ruído",
  "preco": 299.9,
  "categoria": "Eletrónicos",
  "estoque": 10
}
```
*Categorias válidas:* `Eletrónicos`, `Roupas`, `Alimentos`, `Casa`, `Outros`.

### 🔴 Carrinho (Redis)

| Método | Rota | Auth | Role | Descrição |
|---|---|---|---|---|
| `GET` | `/carrinho` | ✅ | `cliente` | Retorna `{ itens, valorTotal }` |
| `POST` | `/carrinho` | ✅ | `cliente` | Adiciona item — `{ produtoId, quantidade }` |
| `PUT` | `/carrinho/:produtoId` | ✅ | `cliente` | Altera quantidade — `{ quantidade }` |
| `DELETE` | `/carrinho/:produtoId` | ✅ | `cliente` | Remove item |
| `DELETE` | `/carrinho` | ✅ | `cliente` | Esvazia carrinho |

### 🐘 Pedidos (PostgreSQL)

| Método | Rota | Auth | Role | Descrição |
|---|---|---|---|---|
| `POST` | `/checkout` | ✅ | `cliente` | Finaliza compra |
| `GET` | `/pedidos` | ✅ | `cliente` | Lista pedidos do usuário |
| `POST` | `/pedidos/:id/devolver` | ✅ | `cliente` | Devolve pedido (restaura estoque) |

---

## 🎬 Roteiro de demonstração

### Preparação
Abra 4 abas lado a lado:
1. Terminal com o backend rodando
2. Frontend (`http://localhost:5500`)
3. MongoDB Atlas → Browse Collections → `grautecShop.produtos`
4. RedisInsight conectado ao Redis Cloud

### Fluxo
1. **Criar conta admin**
   - Nome: `Vendedor` | Email: `admin@teste.com` | Senha: `senha1234` | Tipo: `Administrador`
2. **Login como admin**
   - Observe que Carrinho e Meus Pedidos não aparecem.
   - Clique em **+ Novo Produto** e cadastre 2–3 produtos.
   - 💡 *Mostre no Mongo Atlas: os produtos aparecem em tempo real.*
3. **Criar conta cliente**
   - Nome: `Comprador` | Email: `cliente@teste.com` | Senha: `senha1234` | Tipo: `Cliente`
4. **Login como cliente**
   - Observe que **+ Novo Produto** sumiu.
   - Adicione produtos ao carrinho.
   - 💡 *Mostre no RedisInsight: chave `carrinho:1` com TTL contando pra baixo (604800s = 7 dias).*
5. **Finalizar compra**
   - Clique em **Finalizar compra**.
   - 💡 *Mostre no pgAdmin:* `SELECT * FROM pedidos;` e `SELECT * FROM pedido_itens;`
   - 💡 *Volte ao Mongo Atlas:* estoque do produto diminuiu.
   - 💡 *Volte ao RedisInsight:* `carrinho:1` foi limpo.
6. **Devolver pedido**
   - Vá em **Meus Pedidos** → clique em **Devolver pedido**.
   - Status vira `devolvido` e o estoque volta no MongoDB.
7. **Testar bloqueio de permissão**
   - Pelo Postman, chame como cliente:
     ```text
     POST http://localhost:3000/api/produtos
     Authorization: Bearer <token-do-cliente>
     ```
   - Resposta: `403 { "erro": "Acesso negado" }`

---

## 🧠 Decisões de arquitetura

### Por que 3 bancos?
- **MongoDB** — produtos têm atributos variáveis. Schema flexível evita tabelas esparsas.
- **Redis** — carrinho é lido/escrito a cada clique. Em memória, é 100× mais rápido. O TTL resolve "carrinhos abandonados" automaticamente.
- **PostgreSQL** — pedido é dinheiro. Precisa de transação ACID: ou grava tudo, ou não grava nada.

### Transação no checkout
O `OrderRepository.criarPedido` usa `BEGIN` / `COMMIT` / `ROLLBACK`:

```js
await client.query("BEGIN");
// INSERT pedidos
// INSERT pedido_itens
await client.query("COMMIT");
// se qualquer coisa falhar → ROLLBACK
```
Se o insert dos itens falhar, o pedido não fica órfão no banco.

### Decremento atômico de estoque
`findOneAndUpdate` com filtro `estoque: { $gte: quantidade }` faz checagem e decremento na mesma operação. Dois usuários comprando ao mesmo tempo? Um vence, o outro recebe `null`. Sem risco de estoque negativo.

### Ordem no checkout
```text
1. Valida estoque de TODOS os itens
2. Cria pedido no Postgres (transação)
3. Decrementa estoque no MongoDB
4. Limpa carrinho no Redis
```
Se algum passo falhar, os anteriores ainda estão consistentes. O passo 4 é o último porque é o mais "descartável".

---

## 🔒 Segurança

- Senhas com bcrypt (10 rounds)
- JWT com expiração de 8h
- `role` dentro do JWT — não confia no cliente
- Middleware `requireRole` bloqueia rotas por perfil
- `.env` no `.gitignore` (nunca versione credenciais)

---

## 🧪 Testes rápidos com curl

```bash
# 1. Registrar admin
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"a@x.com","password":"senha1234","role":"admin"}'

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"a@x.com","password":"senha1234"}'
# copie o token retornado

# 3. Criar produto (admin)
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"nome":"Fone","descricao":"BT","preco":99,"categoria":"Eletrónicos","estoque":5}'

# 4. Listar (público)
curl http://localhost:3000/api/produtos
```

---

## 📋 Checklist de entrega

- [x] Backend com Express + 3 bancos conectados
- [x] Frontend com `fetch()` consumindo a API
- [x] Catálogo no MongoDB
- [x] Carrinho no Redis com TTL
- [x] Checkout no PostgreSQL com transação
- [x] Autenticação JWT + RBAC (admin/cliente)
- [x] Devolução de pedidos com restauração de estoque
- [x] Validação de estoque antes da compra
- [x] Decremento atômico (à prova de concorrência)
- [x] Tratamento centralizado de erros

---

## 👥 Equipe

| Nome | GitHub |
|---|---|
| Andreson Rodrigues | [@Dev-Andreson](https://github.com/Dev-Andreson) |
