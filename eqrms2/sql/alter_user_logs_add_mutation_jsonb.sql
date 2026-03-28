alter table public.user_logs
  add column if not exists mutation_payload jsonb null;

