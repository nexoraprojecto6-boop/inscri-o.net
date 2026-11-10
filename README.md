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

Next.js 15, React 19, TypeScript, Tailwind CSS, PostgreSQL (Render) com o driver `pg`, Zod. Hospedagem na Render.

## 3. Estrutura

```
app/            páginas (/, /admin, /login) e rotas /api
components/     secções da landing, formulário, contador, painel (admin/)
lib/            content.ts (textos), db.ts (PostgreSQL), schema-sql.ts (tabelas),
                session.ts + auth.ts (login do admin), validations.ts, ...
db/schema.sql   cópia legível do esquema
middleware.ts   protege /admin e /api/admin
render.yaml     Blueprint da Render (base de dados + serviço web)
```

## 4. Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | **Internal Database URL** da tua base PostgreSQL da Render (Dashboard → a base → Connections). As tabelas ficam no esquema `serios`, sem tocar noutras tabelas da mesma base |
| `ADMIN_EMAIL` | email de acesso ao `/admin` |
| `ADMIN_PASSWORD` | palavra-passe do `/admin` (usa uma forte, 12+ caracteres) |
| `AUTH_SECRET` | texto aleatório longo que assina a sessão (na Render é gerado automaticamente) |
| `NEXT_PUBLIC_DERIV_AFFILIATE_URL` | teu link de afiliado, começado por `https://` |

Estas variáveis são todas definidas no painel da Render e nunca vão para o GitHub. As tabelas são criadas automaticamente no primeiro acesso à base: não há SQL para correr à mão.

## 5. Publicar na Render (Blueprint)

1. Faz commit deste projeto no GitHub (a raiz do repositório deve ter `package.json` e `render.yaml`).
2. Em [dashboard.render.com](https://dashboard.render.com): **New → Blueprint** e escolhe o repositório.
3. A Render lê o `render.yaml` e propõe criar o serviço `projeto-serios`. Preenche quando pedir: `DATABASE_URL` (Internal Database URL da tua base existente; o serviço tem de estar na mesma região da base), `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `NEXT_PUBLIC_DERIV_AFFILIATE_URL`.
4. Clica em **Apply**. Espera o build terminar (alguns minutos) e abre o URL `https://projeto-serios.onrender.com` (ou o nome que a Render atribuir).
5. Faz uma inscrição de teste. Depois abre `/login` com `ADMIN_EMAIL` e `ADMIN_PASSWORD`.

Se preferires criar à mão: cria **PostgreSQL** (New → PostgreSQL), copia a *Internal Database URL*, cria um **Web Service** (Build: `npm install && npm run build`; Start: `npm start`) e define as 5 variáveis acima.

## 6. Executar localmente

```bash
npm install
cp .env.example .env.local     # preenche (DATABASE_URL = External Database URL da Render)
npm run dev
```

## 7. Segurança

- A base só é acedida pelo servidor (`lib/db.ts`, consultas parametrizadas). Nenhuma credencial vai para o browser.
- `/admin` e `/api/admin/*` exigem cookie de sessão assinado (HMAC), verificado no middleware e no servidor. Sem registo público. Cookie `httpOnly`, 8 horas de validade.
- Login com limite de tentativas e comparação em tempo constante.
- O CSV neutraliza fórmulas (`=`, `+`, `-`, `@`) no nome e no email.
- Cabeçalhos de segurança em `next.config.ts`.

## 8. Limitações e pendências

- **Planos gratuitos da Render:** o serviço web "adormece" após inatividade (o primeiro acesso demora) e a base de dados gratuita tem prazo de validade. Verifica as condições atuais no painel da Render e, para um evento a sério, usa um plano pago ou faz cópias do CSV regularmente.
- **Limite de pedidos** em memória (uma instância). A garantia final contra duplicados são as restrições `UNIQUE`.
- **Em falta, por não terem sido fornecidos:** data, local e contactos do evento, política de privacidade, imagens e logótipo definitivos.
- O Excel pode mostrar telefones longos em notação científica; importa o CSV com **Dados → De texto/CSV** e define a coluna Telefone como texto.
