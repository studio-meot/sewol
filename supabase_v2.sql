-- 세월낚시터 2차: 이번 주 장부, 다시 온 사람 집계. supabase.sql 다음에 실행하세요.

-- 이번 주 장부: 월요일(한국 시간)마다 새로 펼친다. week 는 그 주 월요일 날짜 'YYYY-MM-DD'
alter table public.anglers add column if not exists week text check (week is null or char_length(week) <= 10);
alter table public.anglers add column if not exists week_best integer not null default 0 check (week_best between 0 and 100000);
create index if not exists anglers_week_idx on public.anglers (week, week_best desc);

-- 찾아온 날: 한 사람이 하루에 한 줄. 누구도 읽을 수 없고, 각자 자기 줄만 넣는다 (집계는 sewol_stats 로만)
create table if not exists public.visits (
  uid uuid not null references auth.users (id) on delete cascade,
  day date not null,
  primary key (uid, day)
);
alter table public.visits enable row level security;
drop policy if exists "insert own visit" on public.visits;
create policy "insert own visit" on public.visits
  for insert to authenticated with check (auth.uid() = uid and day between (now() at time zone 'Asia/Seoul')::date - 1 and (now() at time zone 'Asia/Seoul')::date + 1);
grant insert on public.visits to authenticated;

-- 현황판 숫자. returning_today 와 daily[].r 이 새로 생겼다
create or replace function public.sewol_stats()
returns json language sql stable security definer set search_path = public, auth as $$
  with today as (select (now() at time zone 'Asia/Seoul')::date as d)
  select json_build_object(
    'visitors', (select count(*) from auth.users where is_anonymous),
    'visitors_today', (select count(*) from auth.users, today where is_anonymous and (created_at at time zone 'Asia/Seoul')::date = today.d),
    'returning_today', (select count(*) from public.visits v join auth.users u on u.id = v.uid, today
                         where v.day = today.d and (u.created_at at time zone 'Asia/Seoul')::date < today.d),
    'recorders', (select count(*) from public.anglers),
    'total_days', (select coalesce(sum(total), 0) from public.anglers),
    'best', (select coalesce(max(best), 0) from public.anglers),
    'daily', (select coalesce(json_agg(json_build_object('d', x.d, 'n', x.n, 'r', x.r) order by x.d), '[]'::json) from (
      select g::date as d,
        (select count(*) from auth.users u where u.is_anonymous and (u.created_at at time zone 'Asia/Seoul')::date = g::date) as n,
        (select count(*) from public.visits v join auth.users u on u.id = v.uid
          where v.day = g::date and (u.created_at at time zone 'Asia/Seoul')::date < g::date) as r
      from today, generate_series(today.d - 13, today.d, interval '1 day') g) x)
  );
$$;
revoke all on function public.sewol_stats() from public;
grant execute on function public.sewol_stats() to anon, authenticated;
select public.sewol_stats();
