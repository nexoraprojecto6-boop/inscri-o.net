/**
 * Esquema da base de dados (PostgreSQL). É aplicado automaticamente, de forma
 * idempotente, no primeiro acesso à base (ver lib/db.ts). Não é preciso correr SQL à mão.
 * Uma cópia legível está em db/schema.sql.
 */
export const SCHEMA_SQL = String.raw`
create schema if not exists serios;

create table if not exists participants (
  id                uuid primary key default gen_random_uuid(),
  full_name         text        not null,
  email             text        not null,
  phone             text        not null,
  country_code      text        not null,
  has_deriv_account boolean     not null,
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

create index if not exists participants_created_at_idx
  on participants (created_at desc);
create index if not exists participants_has_deriv_idx
  on participants (has_deriv_account);

create table if not exists tracking_events (
  id             uuid primary key default gen_random_uuid(),
  event_type     text        not null default 'deriv_click'
                   check (event_type in ('deriv_click')),
  session_id     text        not null
                   check (session_id ~ '^[A-Za-z0-9_-]{8,64}$'),
  participant_id uuid        references participants (id) on delete set null,
  user_agent     text,
  created_at     timestamptz not null default now()
);

create index if not exists tracking_events_created_at_idx
  on tracking_events (created_at desc);
create index if not exists tracking_events_session_idx
  on tracking_events (session_id);
create index if not exists tracking_events_participant_idx
  on tracking_events (participant_id);
`;
