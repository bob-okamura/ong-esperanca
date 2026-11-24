# ONG Esperança

Sistema de gestão de adoções de animais da ONG Esperança (proteção animal).
Projeto Integrador Extensionista II (ADS).

Cadastro de animais e adotantes, registro de adoções e login de voluntário.
Roda em ambiente local: frontend com Vite+, API com Node.js e Express, banco MySQL ou MariaDB.

## Pré-requisitos

- Node.js 22 ou mais recente
- Vite+ (`vp`) e pnpm
- MySQL 8 ou MariaDB 10.6 (ou mais recentes) rodando na máquina, por exemplo pelo XAMPP
- Git

## Como rodar

1. Clone o repositório e entre na pasta:

   ```
   git clone https://github.com/bob-okamura/ong-esperanca.git
   cd ong-esperanca
   ```

2. Instale as dependências:

   ```
   vp install
   ```

3. Crie o banco e os dados de exemplo. No cliente do MySQL (`mysql -u root -p`), a partir da pasta do projeto:

   ```
   SOURCE database/schema.sql;
   SOURCE database/seed.sql;
   ```

   No XAMPP também funciona pelo phpMyAdmin: aba SQL, colar o conteúdo de `schema.sql` e executar; depois o mesmo com `seed.sql`.

4. Copie `.env.example` para `.env` e preencha a senha do banco e o `JWT_SECRET`:

   ```
   cp .env.example .env
   ```

   No Windows (PowerShell): `Copy-Item .env.example .env`

5. Em um terminal, inicie a API:

   ```
   pnpm api
   ```

6. Em outro terminal, inicie o frontend:

   ```
   vp dev
   ```

7. Abra http://localhost:5173 e entre com o usuário de demonstração.

## Usuário de demonstração

| E-mail                           | Senha        |
| -------------------------------- | ------------ |
| voluntario@esperanca.exemplo.com | esperanca123 |

Para trocar a senha, gere um novo hash com `node server/gerar-hash.js NOVA_SENHA`
e substitua o valor de `senha_hash` no `database/seed.sql`.

## Variáveis de ambiente

| Variável                 | Para que serve                                           |
| ------------------------ | -------------------------------------------------------- |
| `PORT`                   | Porta da API (padrão 3000)                               |
| `DB_HOST`, `DB_PORT`     | Endereço do banco. Use `127.0.0.1` em vez de `localhost` |
| `DB_USER`, `DB_PASSWORD` | Usuário e senha do banco (no XAMPP: `root`, sem senha)   |
| `DB_NAME`                | Nome do banco (`ong_esperanca`)                          |
| `JWT_SECRET`             | Segredo que assina os tokens de login                    |
| `JWT_EXPIRES_IN`         | Validade do token (padrão `8h`)                          |

## Rotas da API

| Método           | Rota               | Token? |
| ---------------- | ------------------ | ------ |
| GET              | /api/health        | não    |
| POST             | /api/auth/login    | não    |
| GET, POST        | /api/adotantes     | sim    |
| GET, PUT, DELETE | /api/adotantes/:id | sim    |
| GET, POST        | /api/animais       | sim    |
| DELETE           | /api/animais/:id   | sim    |
| GET              | /api/especies      | sim    |
| GET, POST        | /api/adocoes       | sim    |

Testes manuais da API em `api.http` (extensão REST Client do VS Code).

## Regras garantidas pelo banco e pela API

- Um animal só pode ser adotado uma vez, e só quando está disponível.
- Ao registrar a adoção, o animal passa para "adotado" na mesma transação.
- Adotante com adoção registrada não pode ser excluído (histórico protegido).
- Senhas ficam guardadas só como hash bcrypt.
- Todas as rotas com dados pessoais exigem token (LGPD).

## Estrutura

```
database/   schema.sql e seed.sql
server/     API Express (index.js, db.js, auth.js, validacao.js, routes/)
src/        frontend (main.js, api.js, ui.js, pages/, style.css)
```
