-- =====================================================================
-- Projeto Serio$ — Esquema da base de dados (Supabase / PostgreSQL)
-- Executar uma única vez em: Supabase → SQL Editor → New query → Run
-- O script é idempotente (pode ser executado novamente sem erros).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Participantes
-- ---------------------------------------------------------------------
create table if not exists public.participants (
  id                uuid primary key default gen_random_uuid(),
  full_name         text        not null,
  email             text        not null,
  phone             text        not null,   -- apenas dígitos, sem indicativo
  country_code      text        not null,   -- ex.: +244
  has_deriv_account boolean     not null,   -- declaração do participante (não verificada)
  sms_consent       boolean     not null default false,
  whatsapp_consent  boolean     not null default false,
  created_at        timestamptz not null default now(),

  constraint participants_full_name_len
    check (char_length(btrim(full_name)) between 3 and 120),
  constraint participants_email_format
    check (email = lower(email)
           and char_length(email) <= 254
           and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint participants_country_code_format
    check (country_code ~ '^\+[0-9]{1,4}$'),
  constraint participants_phone_format
    check (phone ~ '^[0-9]{6,14}$'),

  -- Proteção contra inscrições duplicadas
  constraint participants_email_key unique (email),
  constraint participants_phone_key unique (country_code, phone)
);

create index if not exists participants_created_at_idx
  on public.participants (created_at desc);
create index if not exists participants_has_deriv_idx
  on public.participants (has_deriv_account);

-- ---------------------------------------------------------------------
-- 2. Eventos de rastreamento (cliques no link Deriv)
--    Um clique NÃO significa que a pessoa criou uma conta.
-- ---------------------------------------------------------------------
create table if not exists public.tracking_events (
  id             uuid primary key default gen_random_uuid(),
  event_type     text        not null default 'deriv_click'
                   check (event_type in ('deriv_click')),
  session_id     text        not null
                   check (session_id ~ '^[A-Za-z0-9_-]{8,64}$'),
  participant_id uuid        references public.participants (id) on delete set null,
  user_agent     text,
  created_at     timestamptz not null default now()
);

create index if not exists tracking_events_created_at_idx
  on public.tracking_events (created_at desc);
create index if not exists tracking_events_session_idx
  on public.tracking_events (session_id);
create index if not exists tracking_events_participant_idx
  on public.tracking_events (participant_id);

-- ---------------------------------------------------------------------
-- 3. Administradores
--    Não existe registo público. Os administradores são adicionados
--    manualmente (ver README → "Como criar o primeiro administrador").
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 4. Row Level Security (RLS)
--    Nenhuma tabela é acessível com a chave anon/authenticated.
--    Todo o acesso é feito no servidor com a service_role key,
--    que contorna o RLS. Os dados pessoais nunca ficam expostos.
-- ---------------------------------------------------------------------
alter table public.participants     enable row level security;
alter table public.tracking_events  enable row level security;
alter table public.admins           enable row level security;

revoke all on public.participants, public.tracking_events, public.admins
  from anon, authenticated;

drop policy if exists participants_no_client_access on public.participants;
create policy participants_no_client_access on public.participants
  for all to anon, authenticated using (false) with check (false);

drop policy if exists tracking_events_no_client_access on public.tracking_events;
create policy tracking_events_no_client_access on public.tracking_events
  for all to anon, authenticated using (false) with check (false);

drop policy if exists admins_no_client_access on public.admins;
create policy admins_no_client_access on public.admins
  for all to anon, authenticated using (false) with check (false);

-- ---------------------------------------------------------------------
-- 5. Estatísticas do painel (apenas service_role)
-- ---------------------------------------------------------------------
create or replace function public.get_admin_stats()
returns json
language sql
security definer
set search_path = public
stable
as $$
  select json_build_object(
    'total_participants',    (select count(*) from public.participants),
    'total_phones',          (select count(*) from public.participants where phone is not null and phone <> ''),
    'with_deriv_account',    (select count(*) from public.participants where has_deriv_account),
    'without_deriv_account', (select count(*) from public.participants where not has_deriv_account),
    'total_clicks',          (select count(*) from public.tracking_events where event_type = 'deriv_click'),
    'unique_clicks',         (select count(distinct session_id) from public.tracking_events where event_type = 'deriv_click')
  );
$$;

revoke all on function public.get_admin_stats() from public, anon, authenticated;
grant execute on function public.get_admin_stats() to service_role;
