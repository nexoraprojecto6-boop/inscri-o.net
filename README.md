# Projeto Serio$

Landing page de inscrição para o evento **Projeto Serio$**, com base de dados de participantes, contagem pública de inscritos, rastreio de cliques no link de afiliado Deriv e um painel administrativo simples em `/admin`.

> **Estado dos testes:** este projeto foi escrito sem executar `npm install`, `tsc`, `lint` ou `build` no ambiente de desenvolvimento. Antes de publicar, corre uma vez `npm install && npm run typecheck && npm run build` no teu computador (ver secção 5) e corrige qualquer aviso que apareça.

---

## 1. Funcionalidades

**Página pública (`/`)**
- Header com navegação, hero, apresentação do evento, benefícios, secção sobre a Deriv, processo de participação, FAQ, chamada final e footer.
- Formulário de inscrição (nome, email, indicativo + telefone, "Já tens conta na Deriv?", consentimentos opcionais de SMS e WhatsApp) com validação no frontend e no servidor, mensagens de erro, indicador de carregamento e mensagem de sucesso.
- Se o participante indicar que **não** tem conta Deriv, aparece um botão para criar conta através do link de afiliado.
- Contador "Já somos X participantes inscritos!" lido da base de dados (nunca números fictícios) e atualizado após cada inscrição. Só é exposto um número, nunca dados pessoais.
- Proteções: validação server-side (Zod), restrições `UNIQUE` (email e telefone) contra duplicados, botão bloqueado durante o envio, campo isco (honeypot), tempo mínimo de preenchimento e limite de pedidos por IP.

**Rastreio de cliques Deriv**
- O botão Deriv aponta para `/api/tracking`, que regista o clique no servidor (data/hora, sessão anónima, participante quando conhecido) e redireciona para o link de afiliado.
- Um clique **não** significa que a conta foi criada. O painel mostra "cliques", nunca "contas verificadas".

**Painel administrativo (`/admin`)**
- Acesso por email e palavra-passe (Supabase Auth). Não existe registo público: só contas listadas na tabela `admins` entram.
- Indicadores: total de inscritos, telefones recolhidos, declarações de ter / não ter conta Deriv, total de cliques (e sessões únicas).
- Tabela de participantes com pesquisa por nome, email e telefone, botão Atualizar, exportação de todos os contactos em CSV e Terminar sessão.

## 2. Tecnologias

Next.js 15 (App Router, route handlers), React 19, TypeScript, Tailwind CSS 3, Supabase (PostgreSQL + Auth), Zod, hospedagem na Vercel.

## 3. Estrutura de pastas

```
projeto-serios/
├── app/
│   ├── api/
│   │   ├── registrations/route.ts   # POST: inscrição | GET: contagem pública
│   │   ├── tracking/route.ts        # regista clique e redireciona para a Deriv
│   │   └── admin/
│   │       ├── data/route.ts        # estatísticas + participantes (só admin)
│   │       ├── export/route.ts      # CSV (só admin)
│   │       └── logout/route.ts
│   ├── admin/page.tsx               # painel
│   ├── login/page.tsx               # início de sessão
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                     # landing page
├── components/                      # secções da landing, formulário, contador
│   └── admin/                       # AdminDashboard, ParticipantsTable, StatisticsCards
├── lib/
│   ├── content.ts                   # TODOS os textos da landing page
│   ├── countries.ts                 # lista de indicativos
│   ├── validations.ts               # esquemas Zod (cliente + servidor)
│   ├── auth.ts                      # verificação de administrador
│   ├── rate-limit.ts, utils.ts, types.ts
│   └── supabase/                    # clientes: admin (servidor), server, browser
├── public/                          # imagens e ícones
├── supabase/schema.sql              # tabelas, RLS e funções
├── middleware.ts                    # protege /admin e /api/admin
├── .env.example
└── vercel.json
```

## 4. Alterar textos e informações

Todos os textos estão em **`lib/content.ts`**. A **data, o local e os contactos do evento ainda não foram fornecidos**, por isso aparecem como "A anunciar" (`about.eventDetails`). Os textos de benefícios, FAQ e da secção Deriv são uma proposta inicial: revê-os antes de publicar.

## 5. Executar localmente

Requisitos: Node.js 18.18 ou superior.

```bash
npm install            # instala dependências e gera o package-lock.json
cp .env.example .env.local
# preenche o .env.local (secção 7)
npm run dev            # http://localhost:3000
```

Verificações antes de publicar:

```bash
npm run typecheck      # tsc --noEmit
npm run lint
npm run build
```

> O ZIP não inclui `package-lock.json` porque não foi feita nenhuma instalação. O `npm install` gera-o: faz commit dele no GitHub.

## 6. Criar a base de dados no Supabase

1. Cria um projeto em [supabase.com](https://supabase.com).
2. Abre **SQL Editor → New query**, cola o conteúdo de `supabase/schema.sql` e clica em **Run**. O script é idempotente.
3. Ele cria `participants`, `tracking_events`, `admins`, ativa **RLS** em todas (nenhuma é acessível pelo navegador), revoga permissões a `anon`/`authenticated` e cria a função `get_admin_stats()` (só executável pela `service_role`).

## 7. Variáveis de ambiente

Em **Supabase → Project Settings → API**:

| Variável | Onde obter | Notas |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | pública |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` / public key | pública (sem acesso às tabelas, por causa do RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key | **SECRETA**. Só no servidor. Nunca com prefixo `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_DERIV_AFFILIATE_URL` | o teu link de afiliado Deriv | tem de começar por `https://` |

Sem `NEXT_PUBLIC_DERIV_AFFILIATE_URL`, os botões Deriv devolvem uma mensagem a dizer que o link não está configurado.

## 8. Criar o primeiro administrador

1. No Supabase: **Authentication → Users → Add user → Create new user**. Indica email e palavra-passe forte e marca "Auto Confirm User".
2. Em **Authentication → Sign In / Providers**, desativa **"Allow new users to sign up"**, para ninguém se registar por conta própria.
3. No **SQL Editor**, autoriza essa conta como administradora:

```sql
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'o-teu-email@exemplo.com';
```

4. Abre `/login` e entra. Uma conta que exista no Supabase mas não esteja na tabela `admins` é recusada.

Para adicionar outro administrador, repete os passos 1 e 3.

## 9. Publicar no GitHub

```bash
cd projeto-serios
git init
git add .
git commit -m "Projeto Serio$"
git branch -M main
git remote add origin https://github.com/O-TEU-UTILIZADOR/projeto-serios.git
git push -u origin main
```

O `.gitignore` já exclui `node_modules`, `.next` e todos os ficheiros `.env*` (exceto `.env.example`). **Nunca** faças commit do `.env.local`.

## 10. Publicar na Vercel

1. Em [vercel.com](https://vercel.com): **Add New → Project** e importa o repositório do GitHub.
2. A framework é detetada como Next.js.
3. Em **Environment Variables**, adiciona as 4 variáveis da secção 7 (a `SUPABASE_SERVICE_ROLE_KEY` como variável normal de servidor, sem prefixo `NEXT_PUBLIC_`).
4. Clica em **Deploy**. Depois, abre o domínio, faz uma inscrição de teste e confirma em `/admin`.

## 11. Segurança: o que está implementado

- A `service_role` key só é usada em código de servidor (`lib/supabase/admin.ts` importa `server-only`). Se alguém a importar num componente de cliente, o build falha.
- RLS ativo em todas as tabelas, sem políticas de acesso para `anon`/`authenticated`. Contactos nunca ficam expostos.
- As rotas `/api/admin/*` e a página `/admin` exigem sessão (middleware) **e** pertencer à tabela `admins` (verificado no servidor em cada pedido).
- Todas as escritas passam pelas rotas do servidor, com validação Zod.
- O CSV neutraliza células que começam por `=`, `+`, `-`, `@` nos campos escritos pelo utilizador (nome e email).
- Cabeçalhos de segurança definidos em `next.config.ts`. As rotas não enviam cabeçalhos CORS: só o próprio site as usa.

## 12. Limitações e pendências

- **Limite de pedidos em memória:** em ambiente serverless cada instância tem o seu contador, por isso é uma proteção de melhor esforço. A garantia final contra duplicados está nas restrições `UNIQUE` da base de dados. Para proteção mais forte, ativa o Vercel Firewall / Bot Protection.
- **Cliques únicos** distinguem-se por um identificador de sessão guardado no navegador; quem limpar os dados do navegador conta como nova sessão.
- **Tabela do painel** mostra até 500 linhas; o CSV exporta todos os participantes.
- **Em falta, por não terem sido fornecidos:** data, local e contactos do evento, política de privacidade / termos (recomendado, por recolheres dados pessoais e consentimentos), imagens e logótipo definitivos (coloca em `public/images`).
- O Excel pode mostrar números de telefone longos em notação científica ao abrir o CSV; importa o ficheiro com **Dados → De texto/CSV** definindo a coluna Telefone como texto.
