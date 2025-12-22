# 인증/토큰 갱신 흐름 정리

## 토큰 저장 위치

- 액세스 토큰은 클라이언트 메모리(Zustand 스토어 `accessToken`)에만 저장합니다. 새로고침/탭 종료 시 사라지며, 필요할 때마다 리프레시 쿠키로 재발급합니다 (`src/store/useAuthStore.ts`).
- 리프레시 토큰은 HttpOnly + Secure 쿠키로만 저장되며 JS에서 읽지 않습니다. 모든 인증·갱신 요청에 `credentials: "include"`를 넣어 쿠키를 함께 전송합니다.

## 로그인 플로우

1. `/login` 페이지에서 `handleLogin`이 `${API}/api/auth/login/{provider}`를 호출해 리다이렉트 URL을 받아 즉시 이동 (`src/components/auth/LoginPage/LoginPage.tsx`).
2. 소셜 인증 후 콜백 URL(`/auth/{provider}/login?code=...&state=...`)로 돌아오면 `CallbackPage`가 `useAuthStore.login`을 실행 (`src/components/auth/CallbackPage.tsx`).
3. `login`은 `${API}/api/auth/oauth/{provider}/callback`을 `GET`으로 호출해 토큰을 교환하고, 응답의 `access_token`을 메모리에 저장한 뒤 `checkAuth()`로 프로필을 갱신 (`src/store/useAuthStore.ts`, `src/remote/auth.ts`).
4. 응답이 404이면 회원가입이 필요하다고 간주해 `OAUTH_DATA`를 `sessionStorage`에 남기고 오류 메시지를 설정합니다.

## 인증 상태 초기화 및 유지

- 루트 레이아웃이 클라이언트 컴포넌트 `AuthManager`를 주입해 첫 렌더에서 `checkAuth()`를 실행 (`src/app/layout.tsx`, `src/components/auth/AuthManager.tsx`).
- `checkAuth` (`src/store/useAuthStore.ts`)
  - 메모리에 액세스 토큰이 없으면 리프레시 쿠키로 `refreshToken(updateProfile: false)`을 1회 시도해 토큰을 확보. 실패 시 비로그인 상태로 전환.
  - 토큰이 있으면 `apiFetch("/users/profile")`로 프로필을 조회해 `user`/`isLoggedIn`을 업데이트.
  - 401/403이면 토큰을 지우고 비로그인 상태로 전환.
  - 기타 오류는 `silent` 모드에서는 무시, 일반 모드에서는 `error`를 세팅.
- `waitForAuthReady`는 `loading`이 끝날 때까지 대기하는 Promise를 제공해, 초기 인증 확인 전 요청이 나가지 않도록 함 (예: 투표 조회에서 사용).

## API 호출 및 토큰 갱신 (`src/lib/apiFetch.ts`)

- 기본 동작
  - `${API}/api${url}`로 요청하며, FormData가 아니면 `Content-Type: application/json`.
  - `skipAuth`가 false이고 토큰이 있으면 `Authorization: Bearer {token}`을 추가, 모든 요청에 `credentials: "include"` 적용.
  - 2xx 응답은 JSON을 camelCase로 변환해 반환(204/205는 `undefined`).
- 401 처리
  - `skipAuth` 요청이면 리프레시하지 않고 `ApiError(401)` throw.
  - 그 외에는 전역 `refreshPromise`에 합류해 중복 갱신을 방지. 없을 경우 `useAuthStore.refreshToken()`을 호출해 설정(메모리에 토큰이 없어도 쿠키 기반으로 시도).
  - 갱신 실패 시 `logout()`을 호출하고 `ApiError(401)` throw.
  - 갱신 성공 시 원래 요청을 `retry=false`로 재귀 호출해 한 번만 재시도.

## 리프레시 구현 (`useAuthStore.refreshToken`, `src/store/useAuthStore.ts`)

- `${API}/api/auth/refresh`를 `POST`로 호출(`credentials: "include"`). 서버에 있는 HttpOnly 리프레시 쿠키로만 갱신을 처리합니다.
- 실패 시 메모리 토큰과 상태를 초기화한 뒤 `false` 반환.
- 성공 시 응답의 `access_token`을 메모리에 저장하고, 기본값으로 `checkAuth({ silent: true })`로 사용자 정보를 다시 가져옴(`updateProfile` 옵션으로 생략 가능). 이후 `true` 반환.

## 자동 상태 점검 (`AuthManager`)

- 로그인 상태이며 토큰이 있을 때, 탭이 포커스/visible 상태로 돌아오면 최소 1분 간격으로 `checkAuth({ silent: true })` 실행. 최신 프로필/토큰 유효성을 조용히 확인.

## 로그아웃 플로우 (`useAuthStore.logout`)

- `${API}/api/auth/logout`을 `POST`로 호출(실패해도 무시), 토큰을 삭제하고 상태를 초기화.
- 클라이언트 환경에서는 마지막에 홈(`/`)으로 강제 이동.

## 익명/선택적 인증 요청

- `apiFetch`의 `skipAuth` 옵션으로 인증 헤더를 생략 가능.
- 예: `fetchPoll`은 `waitForAuthReady`로 초기 인증 여부를 기다린 뒤, 비로그인 상태라면 `skipAuth: true`로 호출 (`src/remote/poll.ts`).

## 사용자 피드백/리다이렉트

- `useAuth` 훅은 스토어의 `error`가 “회원가입이 필요합니다.”일 때 `/login`으로 리다이렉트 (`src/hooks/auth/useAuth.ts`). 이는 로그인 시 404 응답 처리 흐름과 연결됩니다.
