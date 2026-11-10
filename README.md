# Projeto Serio$

Landing page de inscrição para o evento **Projeto Serio$**, com base de dados PostgreSQL (Render), contagem pública de inscritos, rastreio de cliques no link de afiliado Deriv e painel administrativo simples em `/admin`.

> **Estado dos testes:** o código foi escrito sem executar `npm install`, `tsc`, lint ou build. Na primeira publicação, se o build falhar, copia o erro do log para o suporte e corrige.

## 1. Funcionalidades

- Landing page completa (header, hero, evento, benefícios, Deriv, processo, FAQ, chamada final, footer). Textos em `lib/content.ts`.
- Formulário de inscrição com validação no browser e no servidor, proteção contra duplicados (`UNIQUE` em email e telefone), honeypot, tempo mínimo e limite por IP.
- Se o participante não tem conta Deriv, aparece o botão de afiliado.
- Contador "Já somos X participantes inscritos!" lido da base de dados (só um número, nunca dados pessoais).
- Rastreio de cliques: `/api/tracking` regista o clique no servidor e redireciona. Um clique **não** é uma conta criada.
- `/admin` protegido por login: indicadores, tabela com pesquisa (nome, email, telefone), Atualizar, exportar CSV e Terminar sessão.

## 2. Tecnologias

Next.js 15, React 19, TypeScript, Tailwind CSS, PostgreSQL (Render) com o driver `pg`, Zod. Hospedagem: **Render** (API + `/admin` + base de dados) e **Vercel** (apenas a landing pública).

## 3. Estrutura

```
app/            páginas (/, /admin, /login) e rotas /api
components/     secções da landing, formulário, contador, painel (admin/)
lib/            content.ts (textos), db.ts (PostgreSQL), schema-sql.ts (tabelas),
                session.ts + auth.ts (login do admin), validations.ts, ...
db/schema.sql   cópia legível do esquema
middleware.ts   protege /admin e /api/admin
render.yaml     Blueprint da Render (serviço web; a base de dados já existe)
next.config.ts  proxy /api e redirects /admin, /login quando RENDER_API_URL existe (Vercel)
```

## 4. Variáveis de ambiente

### Render (serviço web) — tudo definido no dashboard da Render

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | **Internal Database URL** da base PostgreSQL da Render (Dashboard → a base → Connections). As tabelas ficam no esquema `serios`, sem tocar noutras tabelas da mesma base |
| `ADMIN_EMAIL` | email de acesso ao `/admin` |
| `ADMIN_PASSWORD` | palavra-passe do `/admin` (usa uma forte, 12+ caracteres) |
| `AUTH_SECRET` | texto aleatório longo que assina a sessão (gerado automaticamente pelo Blueprint) |
| `NEXT_PUBLIC_DERIV_AFFILIATE_URL` | teu link de afiliado, começado por `https://` |
| `DATABASE_POOL_MAX` | opcional, ligações máximas ao Postgres (por omissão 5) |

> **Não** definas `RENDER_API_URL` na Render.

### Vercel (landing pública) — uma única variável, sem credenciais

| Variável | Descrição |
|---|---|
| `RENDER_API_URL` | URL público do serviço da Render, ex.: `https://projeto-serios.onrender.com` (https, sem barra final) |

Com esta variável, a Vercel reencaminha `/api/*` para a Render (proxy no servidor, por isso **não há CORS**) e redireciona `/admin` e `/login` para o painel da Render. A Vercel nunca acede à base de dados e não guarda nenhuma credencial.

As tabelas são criadas automaticamente no primeiro acesso à base: não há SQL para correr à mão.

## 5. Publicar

### 5.1 Render (API + /admin)

1. Faz commit deste projeto no GitHub (a raiz do repositório deve ter `package.json` e `render.yaml`).
2. Em [dashboard.render.com](https://dashboard.render.com): **New → Blueprint** e escolhe o repositório.
3. Preenche quando pedir: `DATABASE_URL` (**Internal Database URL**; o serviço tem de estar na mesma região da base), `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `NEXT_PUBLIC_DERIV_AFFILIATE_URL`.
4. **Apply**. Quando o build terminar, abre o URL do serviço (ex.: `https://projeto-serios.onrender.com`), faz uma inscrição de teste e entra em `/login`.

### 5.2 Vercel (landing)

1. **Add New → Project** e escolhe o mesmo repositório (framework Next.js).
2. Em Environment Variables, cria só `RENDER_API_URL` com o URL do serviço da Render.
3. Deploy. A landing fica na Vercel; formulário, contador e cliques Deriv passam pelo proxy para a Render.

Podes ligar o domínio final à Vercel (landing). O `/admin` fica no URL da Render.

## 6. Executar localmente

```bash
npm install
cp .env.example .env.local     # preenche (em local, DATABASE_URL = External Database URL da Render)
npm run dev
```

## 7. Segurança

- A base só é acedida pelo serviço da Render pela rede privada (Internal URL) e por consultas parametrizadas (`lib/db.ts`). Nenhuma credencial vai para o browser nem para a Vercel.
- `/admin` e `/api/admin/*` exigem cookie de sessão assinado (HMAC), verificado no middleware e no servidor. Sem registo público. Cookie `httpOnly`, 8 horas de validade.
- Login com limite de tentativas e comparação em tempo constante.
- O CSV neutraliza fórmulas (`=`, `+`, `-`, `@`) no nome e no email.
- Cabeçalhos de segurança em `next.config.ts`.

## 8. Limitações e pendências

- **Planos gratuitos da Render:** o serviço web "adormece" após inatividade (o primeiro acesso demora) e a base de dados gratuita tem prazo de validade. Verifica as condições atuais no painel da Render e, para um evento a sério, usa um plano pago ou faz cópias do CSV regularmente.
- **Limite de pedidos** em memória: funciona porque só a Render (uma instância) trata os pedidos. Se escalares para várias instâncias, usa um limitador partilhado. A garantia final contra duplicados são as restrições `UNIQUE`.
- **Primeiro pedido lento:** no plano gratuito, a Render adormece; o primeiro pedido que chega pelo proxy da Vercel pode demorar.
- **Em falta, por não terem sido fornecidos:** data, local e contactos do evento, política de privacidade, imagens e logótipo definitivos.
- O Excel pode mostrar telefones longos em notação científica; importa o CSV com **Dados → De texto/CSV** e define a coluna Telefone como texto.
