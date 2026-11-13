# Painel Inscri-Ticket (Vercel)

Painel simples e separado do site. Mostra inscritos com contactos, quantos clicaram no link da Deriv,
guarda o link do grupo de WhatsApp e o link da Deriv, e abre o email com todos os inscritos em BCC.
Não liga diretamente à base de dados: fala com o backend da Render através de uma chave secreta.

## Publicar na Vercel
1. Vercel → **Add New Project** → escolhe este repositório.
2. Em **Root Directory** escolhe `admin-vercel`.
3. Variáveis de ambiente (ver `.env.example`):
   - `RENDER_API_URL` – URL do serviço da Render (https, sem barra final)
   - `ADMIN_API_KEY` – chave secreta (≥ 24 caracteres). **A mesma tem de existir na Render.**
   - `ADMIN_PASSWORD` – palavra-passe para entrar no painel
   - `AUTH_SECRET` – texto aleatório com ≥ 32 caracteres
4. Deploy.

## Na Render (serviço do site/API)
Adiciona a variável `ADMIN_API_KEY` (a mesma do painel) e volta a fazer deploy.
A tabela `settings` é criada automaticamente.

Nota: na Render gratuita, o primeiro carregamento pode demorar cerca de 1 minuto (o serviço "acorda").
