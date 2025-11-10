# Frontend - CRUD Vue 3 (Trabalho)

## Requisitos
Node.js (>=14), npm

## Rodando
1. Backend (json-server)
   cd backend
   npm install -g json-server
   json-server --watch db.json --port 3000

2. Frontend
   cd frontend
   npm install
   npm run dev

## .env
Ajuste VITE_API_URL se necessário (ex.: http://localhost:3000)

## Observações
- O componente `ResourceForm.vue` recebe prop `model`. Se `model` for null => modo criar; se for objeto => editar.
- Subitens (subresources) estão relacionados via campo `resourceId`. Para listar subitens de um recurso use `?resourceId=<id>`.