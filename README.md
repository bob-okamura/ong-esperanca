# ONG Esperança

Projeto Integrador Extensionista II, feito com Vite+ e Express.

## Requisitos

- Node.js (LTS)
- Vite+
- pnpm

## Como rodar

```bash
git clone https://github.com/seu-usuario/ong-esperanca.git
cd ong-esperanca
vp install
cp .env.example .env
```

Em dois terminais:

```bash
pnpm api   # API em http://localhost:3000
vp dev     # Front em http://localhost:5173
```

Abra http://localhost:5173: a página mostra o status da rota `GET /api/health`.
