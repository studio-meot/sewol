# 세월낚시터

태공망처럼 미끼 없는 곧은 바늘을 드리우고 세월을 낚는 3D 강가입니다.
숨 한 번(3초)에 하루가 흐르고, 한자리에서 10년(약 3시간)을 버티면 문왕이 찾아옵니다.

- 같은 시간에 접속한 사람들이 강가 바위에 함께 앉습니다 (Supabase Realtime Presence).
- 닉네임은 자동으로 지어집니다. 로그인은 없고, 익명 계정으로 각자 자기 장부 줄만 씁니다.
- `장부에 적기`를 누르면 이번에 낚은 세월이 공유 장부에 기록됩니다. 순위는 한자리에서 가장 오래 앉은 세월 순입니다.

## 구성

| 파일 | 내용 |
| --- | --- |
| `index.html` | 게임 전체 (three.js, supabase-js는 CDN) |
| `config.js` | Supabase 주소와 공개(anon) 키. 비워 두면 혼자 낚시하는 모드 |
| `supabase.sql` | 장부 테이블과 RLS 정책 |
| `og.jpg` | 링크 미리보기 이미지 |

## Supabase 설정

1. Authentication > Sign In / Providers 에서 **Allow anonymous sign-ins** 켜기
2. SQL Editor 에서 `supabase.sql` 실행
3. `config.js`에 Project URL과 anon(공개) 키 넣기. service_role/secret 키는 절대 넣지 마세요.
