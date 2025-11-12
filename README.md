# CRUD Vue 3 — Execução rápida

Comandos essenciais para rodar e testar (Windows):

1. Abrir terminal na pasta do projeto
   cd "c:\Users\cruzf\OneDrive\Documentos\programing\front\pos-atvs\vue-front"

2. Instalar dependências
   npm install

3. Configurar backend (opcional — use remoto)
   - Para usar o backend local (json-server) deixe ou crie `.env` com:
     VITE_API_URL=http://localhost:3001
   Depois de alterar `.env` reinicie o frontend.

4. Rodar backend (json-server) — em outro terminal (se usar local)
   cd backend
   npx json-server --watch db.json --port 3001

5. Rodar frontend (Vite)
   npm run dev
   (abra a URL mostrada pelo Vite, ex.: http://localhost:5173)

6. Testes rápidos
   - API:
     curl http://localhost:3001/resources
     curl "http://localhost:3001/subresources?resourceId=<id>"
   - UI:
     - Criar / Editar / Excluir recurso
     - Abrir "Subitens" de um recurso e CRUD de subitens
     - Pesquisa por título, filtro por autor e status

7. Build (produção)
   npm run build
   (deploy: enviar `dist/` para o host desejado; para GitHub Pages configure `vite.config.js` `base` e use action ou gh-pages)

Dicas de debug
- DevTools → Console / Network para ver requisições e erros CORS/404.
- Se endpoints retornarem 404, verifique `VITE_API_URL` e se o json-server está rodando.
- Botões dentro de forms precisam `type="button"` para evitar submits indesejados.

Pronto — se quiser, aplico este README no seu projeto (responda "aplique o README").