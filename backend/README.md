# API Backend - Sistema de Gerenciamento de Recursos

API RESTful desenvolvida em Node.js com Express para gerenciamento de usuários, recursos e subrecursos, incluindo autenticação JWT e controle de acesso baseado em perfis.

---

## 📋 Descrição

Esta API fornece endpoints para:
- **Autenticação**: Login com JWT e refresh tokens
- **Usuários**: CRUD completo de usuários
- **Recursos**: Gerenciamento de recursos com filtros avançados
- **Subrecursos**: Gerenciamento de subrecursos vinculados a recursos
- **Autorização**: Controle de acesso baseado em perfis (USER/ADMIN)

---

## 🛠️ Tecnologias

- **Node.js** 20+
- **Express** 5.1.0
- **Sequelize** 6.37.7 (ORM)
- **SQLite3** 5.1.7 (Banco de dados)
- **JWT** (jsonwebtoken) 9.0.2 (Autenticação)
- **bcrypt** 6.0.0 (Hash de senhas)
- **CORS** 2.8.5 (Cross-Origin Resource Sharing)
- **Nodemon** 3.1.10 (Desenvolvimento)

---

## 📁 Estrutura do Projeto

```
backend/
├── models/              # Modelos Sequelize
│   ├── usuario.js
│   ├── recurso.js
│   ├── subrecurso.js
│   ├── refreshToken.js
│   └── associacoes.js
├── routes/              # Rotas da API
│   ├── auth.js
│   ├── usuario.js
│   ├── recurso.js
│   └── subrecurso.js
├── middlewares/         # Middlewares
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│   └── erroMiddleware.js
├── server.js            # Arquivo principal do servidor
├── database.js          # Configuração do banco de dados
├── createAdmin.js       # Script para criar usuário admin
├── package.json
└── meubanco.db          # Banco de dados SQLite
```

---

## ⚙️ Requisitos

- **Node.js** 20 ou superior
- **npm** (geralmente vem com Node.js)

---

## 🚀 Instalação

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto `backend/` com o seguinte conteúdo:

```env
# JWT Configuration
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=15d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**⚠️ Importante**: Altere `JWT_SECRET` para uma chave secreta forte em produção!

### 3. Inicializar Banco de Dados

O banco de dados SQLite será criado automaticamente na primeira execução. O arquivo `meubanco.db` será gerado na raiz do projeto.

---

## ▶️ Execução

### Modo Desenvolvimento (com hot-reload)

```bash
npm run dev
```

O servidor será iniciado na porta **5000** (ou a porta definida em `PORT` no `.env`).

### Modo Produção

```bash
node server.js
```

---

## 🔧 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento com nodemon |
| `npm run rebuild:linux` | Limpa cache, remove node_modules e reinstala (Linux/Mac) |
| `npm run rebuild:win` | Limpa cache, remove node_modules e reinstala (Windows) |

---

## 📡 Endpoints da API

### Base URL
```
http://localhost:5000/api
```

### Health Check

- **GET** `/api/health`
  - Verifica se o servidor está online
  - **Resposta**: Status do servidor e banco de dados

---

### 🔐 Autenticação

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "usuario@email.com",
    "senha": "senha123"
  }
  ```
- **Resposta 200:**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### Refresh Token
- **POST** `/api/auth/refresh`
- **Body:**
  ```json
  {
    "refreshToken": "seu_refresh_token_aqui"
  }
  ```
- **Resposta 200:**
  ```json
  {
    "token": "novo_access_token"
  }
  ```

**⚠️ Importante**: Todas as rotas protegidas requerem o header:
```
Authorization: Bearer SEU_ACCESS_TOKEN
```

---

### 👤 Usuários

#### Criar Usuário
- **POST** `/api/usuarios`
- **Body:**
  ```json
  {
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "senha123"
  }
  ```
- **Resposta 201:**
  ```json
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
  ```

#### Listar Usuários
- **GET** `/api/usuarios`
- **Resposta 200:** Array de usuários

#### Buscar Usuário por ID
- **GET** `/api/usuarios/:id`
- **Resposta 200:** Dados do usuário

#### Atualizar Usuário
- **PUT** `/api/usuarios/:id`
- **Body:**
  ```json
  {
    "nome": "João Silva Atualizado",
    "email": "joao.novo@email.com"
  }
  ```

#### Deletar Usuário
- **DELETE** `/api/usuarios/:id`
- **Resposta 204:** No Content

---

### 📚 Recursos

**Todas as rotas de recursos requerem autenticação.**

#### Criar Recurso
- **POST** `/api/recursos`
- **Headers:** `Authorization: Bearer TOKEN`
- **Body:**
  ```json
  {
    "titulo": "Título do Recurso",
    "conteudo": "Conteúdo detalhado do recurso",
    "categoria": "Categoria do recurso",
    "autor": "Nome do Autor",
    "status": "ativo",
    "data": "2024-01-15T10:00:00Z"
  }
  ```
- **Campos obrigatórios:** `titulo`, `conteudo`, `categoria`, `autor`
- **Resposta 201:** Recurso criado

#### Listar Recursos
- **GET** `/api/recursos`
- **Headers:** `Authorization: Bearer TOKEN`
- **Query Parameters:**
  - `status` - Filtrar por status (ex: `ativo`, `inativo`)
  - `categoria` - Filtrar por categoria
  - `data_inicio` - Data inicial (formato ISO)
  - `data_fim` - Data final (formato ISO)
  - `texto` - Busca textual em título e conteúdo
  - `autor` - Filtrar por autor
- **Resposta 200:** Array de recursos do usuário autenticado

#### Buscar Recurso por ID
- **GET** `/api/recursos/:id`
- **Headers:** `Authorization: Bearer TOKEN`
- **Resposta 200:** Dados do recurso

#### Atualizar Recurso
- **PUT** `/api/recursos/:id`
- **Headers:** `Authorization: Bearer TOKEN`
- **Body:** Campos a atualizar (todos opcionais)
- **Resposta 200:** Recurso atualizado

#### Deletar Recurso
- **DELETE** `/api/recursos/:id`
- **Headers:** `Authorization: Bearer TOKEN`
- **Resposta 204:** No Content

---

### 📝 Subrecursos

**Todas as rotas de subrecursos requerem autenticação.**

#### Criar Subrecurso
- **POST** `/api/subrecursos`
- **Headers:** `Authorization: Bearer TOKEN`
- **Body:**
  ```json
  {
    "idrecurso": 1,
    "titulo": "Título do Subrecurso",
    "conteudo": "Conteúdo do subrecurso",
    "status": "pendente",
    "categoria": "geral",
    "autor": "Nome do Autor"
  }
  ```
- **Campos obrigatórios:** `idrecurso`, `titulo`, `conteudo`
- **Resposta 201:** Subrecurso criado

#### Listar Subrecursos
- **GET** `/api/subrecursos`
- **Headers:** `Authorization: Bearer TOKEN`
- **Query Parameters:**
  - `idrecurso` - Filtrar por recurso pai (obrigatório para ver subrecursos específicos)
  - `status` - Filtrar por status
  - `categoria` - Filtrar por categoria
  - `autor` - Filtrar por autor
  - `data_inicio` - Data inicial
  - `data_fim` - Data final
  - `search` - Busca textual em título e conteúdo
- **Resposta 200:** Array de subrecursos

#### Buscar Subrecurso por ID
- **GET** `/api/subrecursos/:id`
- **Headers:** `Authorization: Bearer TOKEN`
- **Resposta 200:** Dados do subrecurso

#### Atualizar Subrecurso
- **PUT** `/api/subrecursos/:id`
- **Headers:** `Authorization: Bearer TOKEN`
- **Body:** Campos a atualizar
- **Resposta 200:** Subrecurso atualizado

#### Deletar Subrecurso
- **DELETE** `/api/subrecursos/:id`
- **Headers:** `Authorization: Bearer TOKEN`
- **Resposta 204:** No Content

---

## 🔒 Autenticação e Autorização

### Sistema de Tokens

- **Access Token**: Token JWT de curta duração (padrão: 30 minutos)
- **Refresh Token**: Token JWT de longa duração (padrão: 15 dias)

### Perfis de Usuário

- **USER**: Usuário comum - pode gerenciar apenas seus próprios recursos
- **ADMIN**: Administrador - tem acesso total a todos os recursos

### Middleware de Autenticação

Todas as rotas de recursos e subrecursos são protegidas pelo `authMiddleware`, que:
1. Verifica a presença do token JWT no header `Authorization`
2. Valida o token
3. Adiciona os dados do usuário em `req.usuario`

### Permissões

- **Recursos**: Cada usuário só pode ver/editar/deletar seus próprios recursos
- **Subrecursos**: Usuários só podem gerenciar subrecursos de recursos que possuem
- **Admin**: Tem acesso total a todos os recursos e subrecursos

---

## 📊 Códigos de Resposta HTTP

| Código | Significado | Descrição |
|--------|-------------|-----------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 204 | No Content | Recurso deletado (sem corpo de resposta) |
| 400 | Bad Request | Dados inválidos na requisição |
| 401 | Unauthorized | Token ausente ou inválido |
| 403 | Forbidden | Sem permissão para a ação |
| 404 | Not Found | Recurso não encontrado |
| 422 | Unprocessable Entity | Erro de validação |
| 500 | Internal Server Error | Erro interno do servidor |

---

## 🧪 Exemplos de Uso

### Exemplo 1: Cadastro e Login

```bash
# 1. Cadastrar usuário
curl -X POST http://localhost:5000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "senha123"
  }'

# 2. Fazer login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'
```

### Exemplo 2: Criar Recurso

```bash
curl -X POST http://localhost:5000/api/recursos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -d '{
    "titulo": "Meu Primeiro Recurso",
    "conteudo": "Conteúdo detalhado aqui",
    "categoria": "Tecnologia",
    "autor": "João Silva",
    "status": "ativo"
  }'
```

### Exemplo 3: Listar Recursos com Filtros

```bash
curl -X GET "http://localhost:5000/api/recursos?status=ativo&categoria=Tecnologia&texto=primeiro" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

### Exemplo 4: Criar Subrecurso

```bash
curl -X POST http://localhost:5000/api/subrecursos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -d '{
    "idrecurso": 1,
    "titulo": "Subrecurso 1",
    "conteudo": "Conteúdo do subrecurso",
    "status": "pendente"
  }'
```

---

## 🗄️ Banco de Dados

### SQLite

O projeto utiliza SQLite como banco de dados. O arquivo `meubanco.db` é criado automaticamente na primeira execução.

### Modelos Principais

- **Usuario**: Usuários do sistema
- **Recurso**: Recursos principais
- **Subrecurso**: Subrecursos vinculados a recursos
- **RefreshToken**: Tokens de refresh para autenticação

### Sincronização

O banco de dados é sincronizado automaticamente na inicialização do servidor. Em modo desenvolvimento (`NODE_ENV=development`), o Sequelize pode alterar a estrutura das tabelas automaticamente.

---

## 🔧 Configuração Avançada

### CORS

O CORS está configurado para aceitar requisições do frontend. Por padrão, aceita requisições de `http://localhost:5173`. Para alterar, configure a variável `CORS_ORIGIN` no `.env`.

### Logging

O servidor registra todas as requisições no console com timestamp e método HTTP.

### Tratamento de Erros

O servidor possui middleware global de tratamento de erros que:
- Captura erros de validação do Sequelize
- Trata erros de autenticação JWT
- Retorna mensagens de erro apropriadas

---

## 📝 Observações Importantes

1. **Segurança**: Em produção, sempre use uma `JWT_SECRET` forte e única
2. **Banco de Dados**: O SQLite é adequado para desenvolvimento. Para produção, considere PostgreSQL ou MySQL
3. **Refresh Tokens**: Os refresh tokens são armazenados no banco de dados para permitir revogação
4. **Permissões**: Usuários comuns só podem gerenciar seus próprios recursos
5. **Validação**: Todos os campos obrigatórios são validados antes de salvar no banco

---

## 🐛 Troubleshooting

### Erro: "Token JWT ausente ou inválido"
- Verifique se o header `Authorization: Bearer TOKEN` está presente
- Confirme que o token não expirou
- Verifique se `JWT_SECRET` está configurado corretamente

### Erro: "Banco de dados não encontrado"
- O banco será criado automaticamente na primeira execução
- Verifique permissões de escrita na pasta do projeto

### Erro: "Porta já em uso"
- Altere a porta no arquivo `.env` ou pare o processo que está usando a porta 5000

---

## 📄 Licença

Este projeto é parte de um sistema de gerenciamento de recursos desenvolvido para fins educacionais.

---

**Desenvolvido com ❤️ usando Node.js e Express**
