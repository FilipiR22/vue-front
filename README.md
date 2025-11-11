# CRUD Vue 3 — Frontend (Trabalho)

Este README descreve como configurar, rodar e testar a aplicação (frontend + json-server backend) no Windows.

## Requisitos
- Node.js (>=14) e npm
- Navegador (Chrome/Edge/Firefox)
- Opcional: json-server instalado globalmente (ou usar npx)

## Estrutura importante
- frontend raiz do projeto: (este diretório)
  - App.vue, main.js, index.html, style.css
  - components/ (ResourceList.vue, ResourceForm.vue, SubResourceList.vue, SubResourceForm.vue, Notification.vue)
  - services/ (api.js, resourceService.js, subresourceService.js)
  - .env (VITE_API_URL)
  - package.json, vite.config.js
- backend/
  - db.json (dados do json-server)

## Configuração (antes de rodar)
1. Abra PowerShell / CMD na pasta do projeto:
   cd "c:\Users\cruzf\OneDrive\Documentos\programing\front\pos-atvs\vue-front"

2. Verifique .env
   - Abra `.env` e confirme:
     VITE_API_URL=http://localhost:3001
   - Se trocar a porta do json-server, atualize aqui.

## Instalar dependências
No diretório do projeto (vue-front):
```bash
npm install
```

## Rodar o backend (json-server)
Você pode usar npx (recomendado) ou json-server global.

Opção 1 — npx (recomendado):
```bash
cd backend
npx json-server --watch db.json --port 3001
```

Opção 2 — instalado globalmente:
```bash
npm install -g json-server
cd backend
json-server --watch db.json --port 3001
```

- O json-server ficará disponível em `http://localhost:3001`
- Endpoints esperados:
  - GET /resources
  - GET /subresources
  - Para listar subitens de um recurso: GET /subresources?resourceId=<id>

## Rodar o frontend (Vite)
Abra outro terminal na raiz do projeto:
```bash
npm run dev
```
- Vite normalmente abre em `http://localhost:5173` (veja o terminal do Vite para a URL exata).

## Testes básicos manuais (UI)
1. Abrir o app no navegador.
2. Verificar listagem inicial — todos os recursos do `db.json` aparecem.
3. Criar recurso:
   - Clicar `+ Novo`
   - Preencher título/autor/data/status
   - Salvar → deve aparecer notificação de sucesso e o item na lista.
4. Editar recurso:
   - Clicar `Editar` em um recurso → modal/form abre com dados preenchidos.
   - Alterar e salvar → notificação e atualização da lista.
5. Excluir recurso:
   - Clicar `Excluir` → confirmar → item removido.
6. Subitens:
   - Abrir `Subitens` em um recurso → deve listar subresources relacionados.
   - Criar/editar/excluir subitem via modal (mesmo fluxo de CRUD).
7. Filtros:
   - Pesquisar por título (campo texto) — deve filtrar apenas por título.
   - Filtrar por autor — campo separado.
   - Filtrar por status — dropdown.
   - Quando todos os campos vazios, todos os recursos devem aparecer.

## Testes da API (opcional)
No terminal (PowerShell) execute:
```bash
curl http://localhost:3001/resources
curl "http://localhost:3001/subresources?resourceId=1a2b"
```

## Verificação e debugging
- Abra DevTools (F12) → Console e Network:
  - Verifique requisições GET/POST/PUT/DELETE para `/resources` e `/subresources`.
  - Se receber 404, confirme porta e URL em `.env` e `services/api.js`.
- Se botões não funcionarem:
  - Verifique console por erros de runtime (linha e arquivo apontados).
  - Assegure que os botões possuem `type="button"` (se estiverem dentro de um form).
  - Verifique se modal aparece com `z-index` acima de outros elementos.
- Se o frontend não compilar:
  - Rode `npm install` novamente.
  - Verifique versão do Node.

## Mensagens e UX
- O componente Notification exibe mensagens enviadas pelos forms e services.
- Em caso de falha em requisição, uma notificação deve aparecer (ver console se faltar).

## Scripts úteis
- Iniciar frontend: npm run dev
- Build: npm run build
- Pré-visualizar build: npm run preview

## Observações para entrega (requisitos da atividade)
- Confirme que estão presentes:
  - components/ ResourceList, ResourceForm (uso do prop model), SubResourceList, SubResourceForm, Notification
  - services/ api.js (usa VITE_API_URL), resourceService.js, subresourceService.js
  - backend/db.json com exemplos
  - .env com VITE_API_URL configurado
- Validações mínimas: formulário valida título obrigatório.
- Filters: título, autor e status implementados (client-side).
- CRUD de recurso e sub-recurso implementado via json-server.

## Problemas comuns e soluções rápidas
- json-server 404 → rodar json-server no backend e confirmar porta.
- CORS → json-server permite requisições locais; se erro, verifique URL em .env.
- Erro "Cannot read properties of undefined" → campo v-model apontando para propriedade inexistente; abrir console para ver arquivo/linha.

Se quiser, eu atualizo automaticamente o README neste projeto com este conteúdo — diga "aplique o README".