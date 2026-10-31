-- 세월낚시터 v3: 산 아래 돌탑
-- 한 사람이 하루에 돌 하나. 표는 직접 읽고 쓸 수 없고, 아래 두 함수로만 센다.

create table if not exists public.stones (
  uid uuid not null default auth.uid(),
  day date not null default (now() at time zone 'Asia/Seoul')::date,
  at timestamptz not null default now(),
  primary key (uid, day)
);
alter table public.stones enable row level security;

-- 돌 하나 얹기. 오늘 이미 얹었으면 fresh=false 로 지금까지의 돌 수만 돌려준다
create or replace function public.add_stone() returns json
language plpgsql security definer set search_path = public as $$
declare
  u uuid := auth.uid();
  added int := 0;
begin
  if u is not null then
    insert into stones (uid) values (u) on conflict do nothing;
    get diagnostics added = row_count;
  end if;
  return json_build_object('n', (select count(*) from stones), 'fresh', added > 0);
end $$;

-- 돌탑 높이를 그릴 때 쓰는 전체 돌 수
create or replace function public.stone_count() returns bigint
language sql stable security definer set search_path = public as $$
  select count(*) from stones
$$;

revoke all on function public.add_stone() from public;
revoke all on function public.stone_count() from public;
grant execute on function public.add_stone() to authenticated;
grant execute on function public.stone_count() to anon, authenticated;
