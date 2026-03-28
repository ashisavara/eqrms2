alter table public.client_group
  add column if not exists excalidraw_json jsonb null;

alter table public.client_group
  add column if not exists excalidraw_updated_at timestamptz null;
