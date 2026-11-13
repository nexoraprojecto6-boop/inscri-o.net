-- Inscri-Ticket — esquema PostgreSQL (referência).
-- A aplicação aplica este esquema automaticamente no primeiro acesso (lib/schema-sql.ts).
-- Só precisas de o correr manualmente se quiseres (idempotente).

-- As tabelas ficam num esquema próprio ("serios"), isolado de outros projetos na mesma base.
create schema if not exists serios;
set search_path to serios;

create table if not exists participants (
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
  constraint participants_email_key unique (email),
  constraint participants_phone_key unique (country_code, phone)
);

create index if not exists participants_created_at_idx on participants (created_at desc);
create index if not exists participants_has_deriv_idx on participants (has_deriv_account);

-- Cliques no link Deriv. Um clique NÃO significa que a pessoa criou conta.
create table if not exists tracking_events (
  id             uuid primary key default gen_random_uuid(),
  event_type     text        not null default 'deriv_click' check (event_type in ('deriv_click')),
  session_id     text        not null check (session_id ~ '^[A-Za-z0-9_-]{8,64}$'),
  participant_id uuid        references participants (id) on delete set null,
  user_agent     text,
  created_at     timestamptz not null default now()
);

create index if not exists tracking_events_created_at_idx on tracking_events (created_at desc);
create index if not exists tracking_events_session_idx on tracking_events (session_id);
create index if not exists tracking_events_participant_idx on tracking_events (participant_id);

create table if not exists settings (
  key        text primary key check (key in ('whatsapp_url', 'deriv_url')),
  value      text        not null,
  updated_at timestamptz not null default now()
);
