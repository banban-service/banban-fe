import { create } from "zustand";
import { ApiError, apiFetch } from "@/lib/apiFetch";
import { getToken } from "@/remote/auth";
import { UserInfoResponse } from "@/types/api";
import { TokenRequestResponse, User } from "@/types/auth";
import { logger } from "@/utils/logger";

type AuthProvider = "kakao" | "naver";

interface LoginParams {
  code: string;
  provider: AuthProvider;
  state?: string;
}

interface CheckAuthOptions {
  silent?: boolean;
}

interface RefreshTokenOptions {
  updateProfile?: boolean;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  accessToken: string | null;

  setAccessToken: (token: string | null) => void;
  login: (params: LoginParams) => Promise<boolean>;
  expireSession: () => void;
  logout: () => void;
  checkAuth: (options?: CheckAuthOptions) => Promise<void>;
  refreshToken: (options?: RefreshTokenOptions) => Promise<boolean>;
}

/**
 * 공통적으로 "로그아웃 상태"로 되돌릴 때 쓰는 헬퍼
 * - user / isLoggedIn / accessToken / error 를 항상 초기화
 * - loading 은 호출하는 쪽에서 필요할 때만 override
 */
const createLoggedOutState = (
  overrides: Partial<AuthState> = {},
): Partial<AuthState> => ({
  user: null,
  isLoggedIn: false,
  accessToken: null,
  error: null,
  ...overrides,
});

/**
 * refresh 응답에서 accessToken 을 추출하는 헬퍼
 * - 응답 body(data.data.access_token)
 * - Authorization 헤더
 */
const extractAccessTokenFromRefresh = (
  res: Response,
  data: TokenRequestResponse | null,
): string | null => {
  const headerToken =
    res.headers
      .get("authorization")
      ?.replace(/Bearer\s+/i, "")
      .trim() ?? null;

  const bodyToken = data?.data?.access_token ?? null;

  return bodyToken ?? headerToken ?? null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: true,
  error: null,
  accessToken: null,

  setAccessToken: (token) => {
    set({ accessToken: token });
  },

  checkAuth: async (options) => {
    const silent = options?.silent ?? false;

    /**
     * 왜 이렇게?
     * - apiFetch가 401에서 refresh + 원요청 재시도를 이미 처리함
     * - 그래서 여기서 refreshToken을 또 호출하면 중복 책임 + 로직 꼬임(이중 refresh/이중 로그아웃)이 생길 수 있음
     */
    if (!silent) {
      set({ loading: true, error: null });
    } else {
      // silent 모드는 UI를 흔들지 않고 에러만 초기화 정도만
      set({ error: null });
    }

    try {
      // apiFetch 내부에서:
      // - accessToken 헤더 부착
      // - 401이면 refreshToken 직렬화 수행
      // - refresh 성공 시 원요청 재시도
      const { data }: UserInfoResponse = await apiFetch("/users/profile");

      set({
        user: data,
        isLoggedIn: true,
        accessToken: get().accessToken, // 이미 store에 최신 토큰이 들어와있다는 전제(네 refresh 흐름상 OK)
        ...(silent ? {} : { loading: false }),
      });
    } catch (err) {
      logger.warn("인증 체크 실패", err);

      const status = err instanceof ApiError ? err.status : undefined;

      /**
       * 401/403의 의미(중요)
       * - apiFetch가 refresh+retry까지 했는데도 실패했다는 뜻
       * - 즉 세션이 끝났거나(리프레시 만료/폐기), 권한이 없거나(403), 토큰이 완전히 잘못됨
       *
       * 그래서 여기서는 "다시 refresh 시도" 같은 걸 하지 않고
       * 단일 책임으로 "로그아웃 상태로 정리"만 함.
       */
      if (status && [401, 403].includes(status)) {
        set(
          createLoggedOutState({
            ...(silent ? {} : { loading: false }),
          }),
        );

        return;
      }

      // silent 모드면 UI 에러 노출은 하지 않음(백그라운드 체크/갱신용)
      if (silent) return;

      const message =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";

      set({
        loading: false,
        error: message,
      });
    }
  },

  /**
   * 리프레시 토큰 기반 accessToken 갱신
   * - 실패 시: 토큰/상태 초기화
   * - 성공 시: accessToken 업데이트 (+ 옵션에 따라 프로필 재조회)
   */

  refreshToken: async (options) => {
    const updateProfile = options?.updateProfile ?? true;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (!res.ok) {
        logger.error("토큰 갱신 요청 실패", {
          status: res.status,
          statusText: res.statusText,
        });

        set(
          createLoggedOutState({
            loading: false,
          }),
        );

        return false;
      }

      let data: TokenRequestResponse | null = null;

      // 204 가 아닌 경우에만 body 파싱
      if (res.status !== 204) {
        try {
          const bodyText = await res.text();
          if (bodyText) {
            data = JSON.parse(bodyText) as TokenRequestResponse;
          }
        } catch (error) {
          logger.warn("토큰 갱신 응답 파싱 실패", error);

          set(
            createLoggedOutState({
              loading: false,
            }),
          );

          return false;
        }
      }

      const accessToken = extractAccessTokenFromRefresh(res, data);

      if (!accessToken) {
        logger.warn("토큰 갱신 응답에 access_token이 없습니다.");

        set(
          createLoggedOutState({
            loading: false,
          }),
        );

        return false;
      }

      set({ accessToken });

      if (updateProfile) {
        void get().checkAuth({ silent: true });
      }

      logger.info("토큰 갱신 및 사용자 상태 업데이트 성공");
      return true;
    } catch (error) {
      logger.error("토큰 갱신 중 예외 발생", error);

      set(
        createLoggedOutState({
          loading: false,
        }),
      );

      return false;
    }
  },

  /**
   * OAuth 로그인 처리
   * - deviceId 생성 및 저장
   * - 토큰 발급 후 accessToken 저장
   * - 이후 checkAuth 로 프로필 조회
   */
  login: async ({ code, provider, state }: LoginParams) => {
    set({ loading: true, error: null });

    try {
      const { response, data } = await getToken({ code, provider, state });

      if (response.ok) {
        set({ accessToken: data.data.access_token });
        await get().checkAuth();
        return true;
      }

      let errorMessage = "로그인 처리 중 문제가 발생했습니다.";

      switch (response.status) {
        case 404:
          errorMessage = "회원가입이 필요합니다.";
          break;
        case 409:
          errorMessage = "다른 플랫폼으로 가입된 계정입니다.";
          break;
        case 401:
          errorMessage = "인증 토큰이 유효하지 않습니다.";
          break;
        case 500:
          errorMessage = "서버 오류가 발생했습니다.";
          break;
        default:
          break;
      }

      throw new Error(errorMessage);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";

      set({
        error: message,
        loading: false,
        accessToken: null,
      });

      return false;
    }
  },
  expireSession: () => {
    set(createLoggedOutState({ loading: false }));
  },
  /**
   * 서버 로그아웃 API 호출 후
   * - 로컬 토큰/상태 초기화
   * - 홈으로 리다이렉트
   */
  logout: async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      logger.warn("서버 로그아웃 실패", e);
    } finally {
      set(
        createLoggedOutState({
          isLoggedIn: false,
        }),
      );

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  },
}));

/**
 * Zustand store 의 loading 이 false 가 될 때까지 대기하는 헬퍼
 * - SSR 환경에서는 즉시 resolve
 */
export const waitForAuthReady = (): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  const { loading } = useAuthStore.getState();
  if (!loading) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      if (!state.loading) {
        unsubscribe();
        resolve();
      }
    });
  });
};
