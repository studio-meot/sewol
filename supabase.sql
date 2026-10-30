-- 세월낚시터 장부 테이블. Supabase 대시보드 > SQL Editor에 붙여 넣고 실행하세요.
-- 사전 준비: Authentication > Sign In / Providers 에서 "Allow anonymous sign-ins"를 켜 주세요.

create table if not exists public.anglers (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 20),
  total integer not null default 0 check (total between 0 and 10000000),   -- 장부에 적은 세월(일)
  best integer not null default 0 check (best between 0 and 100000),       -- 한자리에서 가장 오래 앉은 세월(일)
  updated_at timestamptz not null default now()
);

alter table public.anglers enable row level security;

-- 누구나 장부를 읽을 수 있고, 각자 자기 줄만 쓰고 고칠 수 있다
drop policy if exists "anyone reads the ledger" on public.anglers;
create policy "anyone reads the ledger" on public.anglers
  for select using (true);

drop policy if exists "insert own row" on public.anglers;
create policy "insert own row" on public.anglers
  for insert to authenticated with check (auth.uid() = id);

drop policy if exists "update own row" on public.anglers;
create policy "update own row" on public.anglers
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create index if not exists anglers_best_idx on public.anglers (best desc);
