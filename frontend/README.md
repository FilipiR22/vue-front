# Frontend - Sistema de Gerenciamento de Recursos

Aplicação frontend desenvolvida em Vue.js 3 para gerenciamento de recursos e subrecursos, com autenticação JWT e interface responsiva.

---

## 📋 Descrição

Esta é uma Single Page Application (SPA) desenvolvida com Vue.js 3 que fornece uma interface moderna e intuitiva para:

- **Autenticação**: Login e registro de usuários
- **Gerenciamento de Recursos**: CRUD completo com filtros avançados
- **Gerenciamento de Subrecursos**: CRUD de subrecursos vinculados a recursos
- **Interface Responsiva**: Design moderno com Bootstrap 5
- **Proteção de Rotas**: Guardas de navegação para rotas protegidas

---

## 🛠️ Tecnologias

- **Vue.js** 3.5.24 (Framework JavaScript)
- **Vue Router** 4.6.3 (Roteamento)
- **Vite** 7.2.2 (Build tool e dev server)
- **Axios** 1.13.2 (Cliente HTTP)
- **Bootstrap** 5.3.0 (Framework CSS - via CDN)
- **Font Awesome** 7.0.1 (Ícones - via CDN)

---

## 📁 Estrutura do Projeto

```
frontend/
├── components/          # Componentes reutilizáveis
│   ├── FilterPanel.vue
│   ├── LoginForm.vue
│   ├── Navbar.vue
│   ├── Notification.vue
│   ├── ResourceForm.vue
│   ├── ResourceList.vue
│   ├── SubResourceForm.vue
│   └── SubResourceList.vue
├── layouts/            # Layouts da aplicação
│   └── DefaultLayout.vue
├── pages/              # Páginas/Views
│   ├── CreateUsuario.vue
│   ├── Home.vue
│   ├── LoginPage.vue
│   ├── NotFoundPage.vue
│   ├── ResourceDetailsPage.vue
│   ├── ResourceEditPage.vue
│   ├── ResourceListPage.vue
│   ├── ResourceNewPage.vue
│   └── SubResourcePage.vue
├── router/             # Configuração de rotas
│   └── index.js
├── services/           # Serviços de API
│   ├── api.js          # Configuração base do Axios
│   ├── auth.js         # Serviço de autenticação
│   ├── resourceService.js
│   ├── subresourceService.js
│   └── user.js
├── App.vue             # Componente raiz
├── main.js             # Ponto de entrada
├── index.html          # HTML principal
├── style.css           # Estilos globais
├── vite.config.js      # Configuração do Vite
└── package.json        # Dependências e scripts
```

---

## ⚙️ Requisitos

- **Node.js** 18 ou superior
- **npm** (geralmente vem com Node.js)
- **Backend API** rodando (veja README do backend)

---

## 🚀 Instalação

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto `frontend/` com o seguinte conteúdo:

```env
# URL da API Backend
VITE_API_URL=http://localhost:5000/api

# Nome da aplicação (opcional)
VITE_APP_NAME=CRUD - Recursos
```

**⚠️ Importante**: 
- A URL da API deve corresponder à porta onde o backend está rodando
- Por padrão, o Vite usa a porta **5173** para o servidor de desenvolvimento
- O proxy configurado no `vite.config.js` redireciona `/api` para `http://localhost:5000/api`

---

## ▶️ Execução

### Modo Desenvolvimento

```bash
npm run dev
```

O servidor de desenvolvimento será iniciado em `http://localhost:5173` (ou outra porta se 5173 estiver ocupada).

### Build para Produção

```bash
npm run build
```

Isso criará uma pasta `dist/` com os arquivos otimizados para produção.

### Preview da Build de Produção

```bash
npm run preview
```

Inicia um servidor local para testar a build de produção.

---

## 🔧 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento com hot-reload |
| `npm run build` | Cria uma build otimizada para produção |
| `npm run preview` | Visualiza a build de produção localmente |

---

## 🗺️ Rotas da Aplicação

### Rotas Públicas (sem autenticação)

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/login` | `LoginPage` | Página de login |
| `/create-user` | `CreateUsuario` | Página de registro de usuário |

### Rotas Protegidas (requerem autenticação)

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | Redireciona para `/home` | Rota raiz |
| `/home` | `Home` | Dashboard inicial |
| `/resources` | `ResourceListPage` | Lista de recursos |
| `/resources/new` | `ResourceNewPage` | Criar novo recurso |
| `/resources/:id` | `ResourceDetailsPage` | Detalhes do recurso |
| `/resources/:id/edit` | `ResourceEditPage` | Editar recurso |
| `/resources/:id/subrecursos` | `SubResourcePage` | Gerenciar subrecursos |

### Rota de Fallback

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/:pathMatch(.*)*` | `NotFoundPage` | Página 404 |

---

## 🔐 Autenticação

### Sistema de Autenticação

A aplicação utiliza JWT (JSON Web Tokens) para autenticação:

1. **Login**: O usuário faz login e recebe um `access_token`
2. **Armazenamento**: O token é armazenado no `localStorage`
3. **Interceptação**: O Axios adiciona automaticamente o token no header `Authorization` de todas as requisições
4. **Validação**: O router verifica se o token está válido antes de permitir acesso a rotas protegidas
5. **Expiração**: Tokens expirados são detectados e o usuário é redirecionado para login

### Guardas de Navegação

O Vue Router possui guardas que:

- **Verificam autenticação** antes de acessar rotas protegidas
- **Redirecionam para login** se o usuário não estiver autenticado
- **Verificam expiração do token** automaticamente
- **Previnem acesso duplicado** a páginas de login/cadastro quando já autenticado

### Funções de Autenticação

```javascript
// services/api.js
isAuthenticated()    // Verifica se há token válido
setAuthToken(token)  // Define o token de autenticação
clearAuth()          // Limpa dados de autenticação
getCurrentUser()     // Obtém dados do usuário logado
```

---

## 📡 Serviços de API

### Configuração Base (`services/api.js`)

O serviço base configura o Axios com:

- **Base URL**: Configurável via `VITE_API_URL`
- **Interceptores de Requisição**: Adiciona token JWT automaticamente
- **Interceptores de Resposta**: Trata erros de autenticação e redireciona para login
- **Tratamento de Erros**: Centraliza tratamento de erros HTTP

### Serviços Disponíveis

#### `services/auth.js`
- `login(credentials)` - Autentica usuário
- `logout()` - Faz logout
- `getToken()` - Obtém token atual
- `getUser()` - Obtém dados do usuário
- `isAuthenticated()` - Verifica autenticação

#### `services/resourceService.js`
- `list(params)` - Lista recursos com filtros
- `get(id)` - Busca recurso por ID
- `create(data)` - Cria novo recurso
- `update(id, data)` - Atualiza recurso
- `remove(id)` - Deleta recurso
- Métodos de filtro: `listByStatus()`, `listByCategory()`, `search()`, etc.

#### `services/subresourceService.js`
- `list(params)` - Lista subrecursos
- `get(id)` - Busca subrecurso por ID
- `listByRecurso(recursoId)` - Lista subrecursos de um recurso
- `create(data)` - Cria novo subrecurso
- `update(id, data)` - Atualiza subrecurso
- `remove(id)` - Deleta subrecurso
- Métodos de filtro: `listByStatus()`, `listByCategory()`, `search()`, etc.

#### `services/user.js`
- `list(params)` - Lista usuários
- `create(data)` - Cria novo usuário
- `update(id, data)` - Atualiza usuário
- `remove(id)` - Deleta usuário

---

## 🎨 Componentes Principais

### Layouts

#### `DefaultLayout.vue`
Layout padrão da aplicação com:
- Navbar com navegação
- Container principal para conteúdo
- Footer
- Sistema de notificações

### Componentes de Página

#### `LoginPage.vue`
Página de autenticação com formulário de login.

#### `ResourceListPage.vue`
Lista todos os recursos com filtros e paginação.

#### `ResourceNewPage.vue`
Formulário para criar novo recurso.

#### `ResourceEditPage.vue`
Formulário para editar recurso existente.

#### `ResourceDetailsPage.vue`
Visualização detalhada de um recurso.

#### `SubResourcePage.vue`
Gerenciamento de subrecursos de um recurso.

### Componentes Reutilizáveis

#### `ResourceForm.vue`
Formulário reutilizável para criar/editar recursos.

#### `ResourceList.vue`
Lista de recursos com cards e ações.

#### `FilterPanel.vue`
Painel de filtros para recursos.

#### `Notification.vue`
Sistema de notificações toast.

#### `Navbar.vue`
Barra de navegação superior.

---

## ⚙️ Configuração do Vite

O arquivo `vite.config.js` contém:

### Proxy de API

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

Isso permite que requisições para `/api/*` sejam redirecionadas para o backend durante o desenvolvimento, evitando problemas de CORS.

### Aliases de Caminho

```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

Permite usar `@/` como alias para o diretório `src/` (se existir).

---

## 🔄 Fluxo de Autenticação

1. **Usuário acessa rota protegida**
   - Router verifica se está autenticado
   - Se não, redireciona para `/login?redirect=/rota-desejada`

2. **Usuário faz login**
   - Envia credenciais para `/api/auth/login`
   - Recebe `access_token`
   - Token é salvo no `localStorage`
   - Usuário é redirecionado para a rota original ou `/home`

3. **Requisições à API**
   - Axios intercepta requisições
   - Adiciona `Authorization: Bearer TOKEN` no header
   - Se receber 401/403, limpa autenticação e redireciona para login

4. **Logout**
   - Remove token do `localStorage`
   - Redireciona para `/login`

---

## 🎯 Funcionalidades Principais

### Gerenciamento de Recursos

- ✅ Listar recursos com filtros (status, categoria, data, texto, autor)
- ✅ Criar novo recurso
- ✅ Visualizar detalhes do recurso
- ✅ Editar recurso existente
- ✅ Deletar recurso
- ✅ Interface responsiva

### Gerenciamento de Subrecursos

- ✅ Listar subrecursos de um recurso
- ✅ Criar subrecurso vinculado a um recurso
- ✅ Editar subrecurso
- ✅ Deletar subrecurso
- ✅ Filtros avançados

### Autenticação e Autorização

- ✅ Login com JWT
- ✅ Proteção de rotas
- ✅ Validação de token
- ✅ Logout seguro
- ✅ Tratamento de sessão expirada

---

## 🐛 Tratamento de Erros

A aplicação possui tratamento centralizado de erros:

### Tipos de Erro Tratados

- **401 Unauthorized**: Token inválido ou expirado → Redireciona para login
- **403 Forbidden**: Sem permissão → Mostra mensagem de erro
- **404 Not Found**: Recurso não encontrado → Mostra mensagem
- **422 Validation Error**: Erro de validação → Mostra erros do formulário
- **500 Server Error**: Erro do servidor → Mostra mensagem genérica
- **Network Error**: Erro de conexão → Mostra mensagem de rede

### Eventos Customizados

A aplicação emite eventos customizados para comunicação entre componentes:

- `auth-expired`: Quando a sessão expira
- `api-error`: Quando ocorre erro na API
- `validation-error`: Quando há erro de validação
- `server-error`: Quando há erro no servidor

---

## 📱 Responsividade

A aplicação utiliza **Bootstrap 5** para garantir:

- Layout responsivo em todos os dispositivos
- Grid system flexível
- Componentes adaptáveis
- Navegação mobile-friendly

---

## 🔧 Variáveis de Ambiente

### Desenvolvimento

Crie um arquivo `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CRUD - Recursos
```

### Produção

Configure as variáveis de ambiente no servidor de produção:

```env
VITE_API_URL=https://api.seudominio.com/api
VITE_APP_NAME=CRUD - Recursos
```

**⚠️ Importante**: Variáveis de ambiente no Vite devem começar com `VITE_` para serem expostas ao código do cliente.

---

## 🚀 Deploy

### Build para Produção

```bash
npm run build
```

Isso gera uma pasta `dist/` com arquivos otimizados.

### Servir Arquivos Estáticos

Os arquivos em `dist/` podem ser servidos por:

- **Nginx**: Configure para servir a pasta `dist/`
- **Apache**: Configure DocumentRoot para `dist/`
- **Netlify/Vercel**: Faça deploy da pasta `dist/`
- **GitHub Pages**: Publique a pasta `dist/`

### Configuração de Roteamento

Para SPAs, configure o servidor para redirecionar todas as rotas para `index.html`:

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🐛 Troubleshooting

### Erro: "Cannot GET /rota"

**Problema**: Ao acessar rotas diretamente, o servidor retorna 404.

**Solução**: Configure o servidor para redirecionar todas as rotas para `index.html` (veja seção Deploy).

### Erro: "Network Error" ou CORS

**Problema**: Requisições à API falham com erro de CORS.

**Solução**: 
- Verifique se o backend está rodando
- Verifique se a URL da API está correta no `.env`
- Verifique se o proxy do Vite está configurado corretamente

### Erro: "Token inválido" mesmo após login

**Problema**: Token não está sendo salvo ou enviado corretamente.

**Solução**:
- Verifique se o `localStorage` está habilitado no navegador
- Limpe o `localStorage` e faça login novamente
- Verifique se o backend está retornando o token no formato correto

### Página em branco após build

**Problema**: Após fazer build, a página fica em branco.

**Solução**:
- Verifique se os caminhos dos assets estão corretos
- Configure `base` no `vite.config.js` se estiver em subdiretório
- Verifique o console do navegador para erros

---

## 📝 Observações Importantes

1. **CORS**: Durante desenvolvimento, o proxy do Vite resolve problemas de CORS. Em produção, configure CORS no backend.

2. **Tokens**: Tokens JWT são armazenados no `localStorage`. Para maior segurança, considere usar `httpOnly` cookies em produção.

3. **Refresh Tokens**: A aplicação suporta refresh tokens, mas a implementação completa depende do backend.

4. **Validação**: Validações de formulário são feitas tanto no frontend quanto no backend.

5. **Performance**: O Vite otimiza automaticamente o código em produção com code splitting e tree shaking.

---

## 🔗 Integração com Backend

A aplicação frontend se comunica com o backend através da API REST:

- **Base URL**: Configurada via `VITE_API_URL` (padrão: `http://localhost:5000/api`)
- **Autenticação**: JWT via header `Authorization: Bearer TOKEN`
- **Formato**: JSON (Content-Type: application/json)

Certifique-se de que o backend está rodando antes de iniciar o frontend.

---

## 📄 Licença

Este projeto é parte de um sistema de gerenciamento de recursos desenvolvido para fins educacionais.

---

**Desenvolvido com ❤️ usando Vue.js 3 e Vite**

