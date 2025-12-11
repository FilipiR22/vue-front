# Sistema de Gerenciamento de Recursos - Full Stack

Sistema completo de gerenciamento de recursos e subrecursos desenvolvido com **Vue.js 3** (frontend) e **Node.js + Express** (backend), incluindo autenticação JWT, controle de acesso e interface responsiva.

---

## 📋 Sobre o Projeto

Este é um sistema full-stack que permite:

- ✅ **Autenticação e Autorização** com JWT
- ✅ **Gerenciamento de Usuários** (CRUD completo)
- ✅ **Gerenciamento de Recursos** (CRUD com filtros avançados)
- ✅ **Gerenciamento de Subrecursos** (vinculados a recursos)
- ✅ **Interface Responsiva** com Bootstrap 5
- ✅ **API RESTful** documentada
- ✅ **Proteção de Rotas** no frontend
- ✅ **Validação de Dados** no backend e frontend

---

## 🏗️ Arquitetura

```
vue-front/
├── backend/          # API REST com Node.js + Express + SQLite
│   ├── models/       # Modelos Sequelize
│   ├── routes/       # Rotas da API
│   ├── middlewares/  # Middlewares (auth, admin, errors)
│   └── server.js    # Servidor Express
│
├── frontend/         # SPA com Vue.js 3 + Vite
│   ├── pages/       # Páginas/Views
│   ├── components/  # Componentes reutilizáveis
│   ├── services/    # Serviços de API
│   ├── router/      # Configuração de rotas
│   └── layouts/     # Layouts da aplicação
│
└── README.md        # Este arquivo
```

---

## 🛠️ Tecnologias

### Backend
- **Node.js** 20+
- **Express** 5.1.0
- **Sequelize** 6.37.7 (ORM)
- **SQLite3** 5.1.7
- **JWT** (jsonwebtoken) 9.0.2
- **bcrypt** 6.0.0
- **CORS** 2.8.5

### Frontend
- **Vue.js** 3.5.24
- **Vue Router** 4.6.3
- **Vite** 7.2.2
- **Axios** 1.13.2
- **Bootstrap** 5.3.0
- **Font Awesome** 7.0.1

---

## ⚙️ Requisitos

- **Node.js** 18 ou superior
- **npm** (vem com Node.js)
- **Git** (opcional, para clonar o repositório)

---

## 🚀 Instalação e Execução

### 1. Clonar/Obter o Projeto

```bash
# Se estiver usando Git
git clone <url-do-repositorio>
cd vue-front
```

### 2. Instalar Dependências do Backend

```bash
cd backend
npm install
```

### 3. Configurar Variáveis de Ambiente do Backend

Crie um arquivo `.env` na pasta `backend/`:

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

**⚠️ Importante**: Altere `JWT_SECRET` para uma chave secreta forte!

### 4. Instalar Dependências do Frontend

```bash
cd ../frontend
npm install
```

### 5. Configurar Variáveis de Ambiente do Frontend

Crie um arquivo `.env` na pasta `frontend/`:

```env
# URL da API Backend
VITE_API_URL=http://localhost:5000/api

# Nome da aplicação (opcional)
VITE_APP_NAME=CRUD - Recursos
```

### 6. Executar o Sistema

#### Opção A: Executar em Terminais Separados (Recomendado)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

O backend estará rodando em `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

#### Opção B: Executar em Background (Windows PowerShell)

**Backend:**
```powershell
cd backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
```

**Frontend:**
```powershell
cd frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
```

---

## 📡 Endpoints da API

### Base URL
```
http://localhost:5000/api
```

### Principais Endpoints

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/auth/login` | Login de usuário | ❌ |
| POST | `/auth/refresh` | Renovar token | ❌ |
| GET | `/health` | Status do servidor | ❌ |
| GET | `/usuarios` | Listar usuários | ❌ |
| POST | `/usuarios` | Criar usuário | ❌ |
| GET | `/recursos` | Listar recursos | ✅ |
| POST | `/recursos` | Criar recurso | ✅ |
| GET | `/recursos/:id` | Buscar recurso | ✅ |
| PUT | `/recursos/:id` | Atualizar recurso | ✅ |
| DELETE | `/recursos/:id` | Deletar recurso | ✅ |
| GET | `/subrecursos` | Listar subrecursos | ✅ |
| POST | `/subrecursos` | Criar subrecurso | ✅ |
| GET | `/subrecursos/:id` | Buscar subrecurso | ✅ |
| PUT | `/subrecursos/:id` | Atualizar subrecurso | ✅ |
| DELETE | `/subrecursos/:id` | Deletar subrecurso | ✅ |

**📚 Documentação completa**: Veja `backend/README.md` para detalhes completos da API.

---

## 🗺️ Rotas do Frontend

### Rotas Públicas
- `/login` - Página de login
- `/create-user` - Criar novo usuário

### Rotas Protegidas (requerem autenticação)
- `/home` - Dashboard inicial
- `/resources` - Lista de recursos
- `/resources/new` - Criar novo recurso
- `/resources/:id` - Detalhes do recurso
- `/resources/:id/edit` - Editar recurso
- `/resources/:id/subrecursos` - Gerenciar subrecursos

**📚 Documentação completa**: Veja `frontend/README.md` para detalhes das rotas.

---

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Cadastro de Usuário**
   - Acesse `/create-user` no frontend
   - Preencha nome, email e senha
   - Usuário é criado com perfil `USER`

2. **Login**
   - Acesse `/login`
   - Informe email e senha
   - Recebe `access_token` e `refreshToken`
   - Token é armazenado no `localStorage`

3. **Acesso às Rotas Protegidas**
   - O token é enviado automaticamente no header `Authorization: Bearer TOKEN`
   - O router verifica se o token é válido antes de permitir acesso

4. **Logout**
   - Remove token do `localStorage`
   - Redireciona para `/login`

### Criar Usuário Admin (Opcional)

Para criar um usuário administrador, você pode:

1. Editar o arquivo `backend/createAdmin.js` (descomentar o código)
2. Executar: `node backend/createAdmin.js`
3. Ou criar manualmente no banco de dados com `perfil: 'ADMIN'`

---

## 🧪 Testando o Sistema

### 1. Testar Backend (via curl ou Postman)

```bash
# Health check
curl http://localhost:5000/api/health

# Criar usuário
curl -X POST http://localhost:5000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@email.com","senha":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","senha":"123456"}'

# Listar recursos (com token)
curl http://localhost:5000/api/recursos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 2. Testar Frontend

1. Acesse `http://localhost:5173`
2. Crie uma conta em `/create-user`
3. Faça login em `/login`
4. Navegue pelas funcionalidades:
   - Criar/Editar/Deletar recursos
   - Gerenciar subrecursos
   - Usar filtros de busca

---

## 📦 Scripts Disponíveis

### Backend (`backend/`)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor em modo desenvolvimento |
| `npm run rebuild:linux` | Reinstala dependências (Linux/Mac) |
| `npm run rebuild:win` | Reinstala dependências (Windows) |

### Frontend (`frontend/`)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Cria build para produção |
| `npm run preview` | Visualiza build de produção |

---

## 🗄️ Banco de Dados

O projeto utiliza **SQLite** como banco de dados. O arquivo `backend/meubanco.db` é criado automaticamente na primeira execução.

### Modelos Principais

- **Usuario**: Usuários do sistema
- **Recurso**: Recursos principais
- **Subrecurso**: Subrecursos vinculados a recursos
- **RefreshToken**: Tokens de refresh para autenticação

### Sincronização

O banco é sincronizado automaticamente na inicialização do servidor. Em desenvolvimento, o Sequelize pode alterar a estrutura das tabelas automaticamente.

---

## 🔧 Configuração Avançada

### Portas

- **Backend**: `5000` (configurável via `PORT` no `.env`)
- **Frontend**: `5173` (porta padrão do Vite)

### CORS

O backend está configurado para aceitar requisições de `http://localhost:5173`. Para alterar, configure `CORS_ORIGIN` no `.env` do backend.

### Proxy do Vite

O frontend possui proxy configurado no `vite.config.js` que redireciona `/api/*` para `http://localhost:5000/api` durante o desenvolvimento, evitando problemas de CORS.

---

## 🐛 Troubleshooting

### Backend não inicia

- Verifique se a porta 5000 está livre
- Verifique se o arquivo `.env` existe e está configurado
- Verifique se as dependências foram instaladas (`npm install`)

### Frontend não conecta ao backend

- Verifique se o backend está rodando
- Verifique se `VITE_API_URL` no `.env` do frontend está correto
- Verifique o console do navegador para erros de CORS

### Erro de autenticação

- Limpe o `localStorage` do navegador
- Faça login novamente
- Verifique se o token não expirou (padrão: 30 minutos)

### Erro "Cannot GET /rota" no frontend

- Configure o servidor para redirecionar todas as rotas para `index.html` (veja seção Deploy no `frontend/README.md`)

---

## 📚 Documentação Detalhada

- **Backend**: Veja `backend/README.md` para documentação completa da API
- **Frontend**: Veja `frontend/README.md` para documentação completa do frontend

---

## 🚀 Deploy

### Backend

1. Configure variáveis de ambiente de produção
2. Use um processo manager como PM2
3. Configure um servidor web (Nginx) como reverse proxy

### Frontend

1. Execute `npm run build` na pasta `frontend/`
2. A pasta `dist/` contém os arquivos otimizados
3. Configure o servidor para servir a pasta `dist/` e redirecionar rotas para `index.html`

**📚 Detalhes completos**: Veja os READMEs individuais de cada projeto.

---

## 📝 Estrutura de Dados

### Recurso
```json
{
  "id": 1,
  "titulo": "Título do Recurso",
  "conteudo": "Conteúdo detalhado",
  "categoria": "Categoria",
  "autor": "Nome do Autor",
  "status": "ativo",
  "data": "2024-01-15T10:00:00Z",
  "idusuario": 1
}
```

### Subrecurso
```json
{
  "id": 1,
  "idrecurso": 1,
  "titulo": "Título do Subrecurso",
  "conteudo": "Conteúdo do subrecurso",
  "status": "pendente",
  "categoria": "geral",
  "autor": "Nome do Autor",
  "data": "2024-01-15T10:00:00Z",
  "idusuario": 1
}
```

---

## 🎯 Funcionalidades Principais

### ✅ Implementado

- [x] Autenticação JWT
- [x] CRUD de Usuários
- [x] CRUD de Recursos
- [x] CRUD de Subrecursos
- [x] Filtros avançados (status, categoria, data, texto, autor)
- [x] Proteção de rotas
- [x] Interface responsiva
- [x] Validação de dados
- [x] Tratamento de erros
- [x] Sistema de notificações

---

## 📄 Licença

Este projeto é parte de um sistema de gerenciamento de recursos desenvolvido para fins educacionais.

---