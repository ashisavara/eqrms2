# FreeJun Call Logs - Supabase Setup

## 1. Create Table

Run this SQL in your Supabase SQL Editor:

```sql
-- FreeJun Call Logs Table
-- Stores call data synced from FreeJun API
-- Run in Supabase SQL Editor

create table public.frejun_call_logs (
  id bigserial primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- FreeJun identifiers
  frejun_id bigint unique,           -- FreeJun's internal id
  call_id text unique not null,      -- FreeJun call_id (e.g. "X2RrZQZ")
  
  -- Call metadata
  transaction_id text,
  job_id text,
  candidate_id text,
  
  -- Candidate / destination
  candidate_number text not null,    -- Raw value from FreeJun (may not match any lead)
  candidate_name text,
  lead_id bigint references public.leads_tagging(lead_id),  -- FK when candidate_number matches phone_e164; null otherwise
  
  -- Caller / agent
  creator_number text,
  virtual_number text,
  recruiter text,                     -- email of person who made the call
  
  -- Call details
  status text,                       -- answered, not-answered, not_available (from FreeJun)
  call_type text,                    -- outgoing, incoming
  call_start_time timestamptz,
  call_end_time timestamptz,
  call_duration numeric,              -- in minutes (e.g. 0.3363)
  
  -- Optional fields from FreeJun
  call_reason text,
  call_outcome text,
  recruiter_notes text,
  recording_url text,
  link text,                          -- shared interview link
  campaign_name text,
  call_transcript text,
  ai_insights text,
  cost text
);

-- Indexes for common queries
create index idx_frejun_call_logs_call_id on public.frejun_call_logs(call_id);
create index idx_frejun_call_logs_candidate_number on public.frejun_call_logs(candidate_number);
create index idx_frejun_call_logs_recruiter on public.frejun_call_logs(recruiter);
create index idx_frejun_call_logs_call_start_time on public.frejun_call_logs(call_start_time);
create index idx_frejun_call_logs_status on public.frejun_call_logs(status);
create index idx_frejun_call_logs_lead_id on public.frejun_call_logs(lead_id);

-- Trigger to update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger frejun_call_logs_updated_at
  before update on public.frejun_call_logs
  for each row
  execute function public.set_updated_at();

-- RLS (adjust based on your auth setup)
alter table public.frejun_call_logs enable row level security;

create policy "Authenticated users can view call logs"
  on public.frejun_call_logs
  for select
  using (auth.role() = 'authenticated');

create policy "Service role can manage call logs"
  on public.frejun_call_logs
  for all
  using (auth.role() = 'service_role');
```

## 2. Column Design: candidate_number vs lead_id

| Column            | Purpose                                                                 |
|-------------------|-------------------------------------------------------------------------|
| `candidate_number`| Raw phone from FreeJun; always stored; no FK. May not match any lead.   |
| `lead_id`         | FK to `leads_tagging(lead_id)`. Populated when `candidate_number` matches `phone_e164`; null otherwise. |

`phone_e164` is unique in `leads_tagging`, so each match resolves to at most one lead. During sync: match `candidate_number` to `leads_tagging.phone_e164`; if found, set `lead_id`; otherwise leave null.

## 3. API Response → Table Mapping

| FreeJun API Field | Table Column      | Type   |
|-------------------|-------------------|--------|
| `id`              | `frejun_id`       | bigint |
| `call_id`         | `call_id`         | text   |
| `transaction_id`  | `transaction_id`  | text   |
| `job_id`          | `job_id`          | text   |
| `candidate_id`    | `candidate_id`    | text   |
| `candidate_number`| `candidate_number`| text   |
| `candidate_name`  | `candidate_name`  | text   |
| `creator_number`  | `creator_number`  | text   |
| `virtual_number`  | `virtual_number`  | text   |
| `recruiter`       | `recruiter`       | text   |
| `status`          | `status`          | text   |
| `call_start_time` | `call_start_time` | timestamptz |
| `call_end_time`   | `call_end_time`   | timestamptz |
| `call_duration`   | `call_duration`   | numeric |
| `call_type`       | `call_type`       | text   |
| `call_reason`     | `call_reason`     | text   |
| `call_outcome`    | `call_outcome`    | text   |
| `recruiter_notes` | `recruiter_notes` | text   |
| `recording_url`   | `recording_url`   | text   |
| `link`            | `link`            | text   |
| `campaign_name`   | `campaign_name`   | text   |
| `call_transcript` | `call_transcript` | text   |
| `ai_insights`     | `ai_insights`     | text   |
| `cost`            | `cost`            | text   |

## 4. Edge Function: sync-frejun-calls

An Edge Function fetches all call logs from FreeJun and upserts them into `frejun_call_logs`, resolving `lead_id` by matching `candidate_number` to `phone_e164`.

### Deploy the function

1. Install Supabase CLI: `npm install -g supabase`
2. Log in: `supabase login`
3. Link project (if not already): `supabase link --project-ref YOUR_PROJECT_REF`
4. Set secrets:
   ```bash
   supabase secrets set FREJUN_API_KEY=your_api_key
   supabase secrets set FREJUN_USER_EMAIL=your_frejun_email
   ```
5. Deploy:
   ```bash
   supabase functions deploy sync-frejun-calls
   ```

### Run manually

**Option A – cURL**
```bash
curl -X POST "https://YOUR_PROJECT_REF.supabase.co/functions/v1/sync-frejun-calls" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

**Option B – Supabase Dashboard**
1. Go to **Edge Functions** in the Supabase Dashboard
2. Open `sync-frejun-calls`
3. Use the **Invoke** button

**Option C – Supabase CLI**
```bash
supabase functions invoke sync-frejun-calls
```

### Response

- Success: `{"success":true,"message":"Synced N calls to frejun_call_logs","count":N}`
- Error: `{"success":false,"error":"..."}`

---

## 5. Upsert Example (for reference)

When syncing from FreeJun API, use `call_id` as the conflict target:

```sql
insert into public.frejun_call_logs (
  frejun_id, call_id, transaction_id, job_id, candidate_id,
  candidate_number, candidate_name, lead_id, creator_number, virtual_number, recruiter,
  status, call_type, call_start_time, call_end_time, call_duration,
  call_reason, call_outcome, recruiter_notes, recording_url, link,
  campaign_name, call_transcript, ai_insights, cost
)
values (...)
on conflict (call_id) do update set
  frejun_id = excluded.frejun_id,
  status = excluded.status,
  call_end_time = excluded.call_end_time,
  call_duration = excluded.call_duration,
  recording_url = excluded.recording_url,
  -- ... other fields
  updated_at = now();
```
