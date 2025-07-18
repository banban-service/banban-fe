import { APIResponse } from "@/types/api";
import { extractErrorMessage } from "@/utils/errorMessages";
import { logger } from "@/utils/logger";

let refreshPromise: Promise<boolean> | null = null;

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  retry = true,
  context?: string,
): Promise<APIResponse> {
  const startTime = Date.now();

  if (refreshPromise) {
    console.log("Waiting for ongoing token refresh...");
    const success = await refreshPromise;
    if (!success) {
      logger.error("토큰 갱신 실패로 인한 요청 중단", { url });
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }
  }

  const token = getAccessToken();

  // 요청 시작 로그
  logger.debug("API 요청 시작", {
    url,
    method: options.method || "GET",
    hasToken: !!token,
    headers: options.headers,
    context,
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const duration = Date.now() - startTime;

  if (res.ok) {
    logger.info("API 요청 성공", {
      url,
      status: res.status,
      duration: `${duration}ms`,
      context,
    });
    return res.json();
  }

  if (res.status === 401 && retry) {
    logger.warn("액세스 토큰 만료 감지", { url, duration: `${duration}ms` });

    if (!refreshPromise) {
      logger.info("토큰 갱신 시작");
      refreshPromise = tryRefreshToken();
    }

    const success = await refreshPromise;
    refreshPromise = null;

    if (success) {
      logger.info("토큰 갱신 성공, 요청 재시도", { url });
      return apiFetch<T>(url, options, false, context);
    } else {
      logger.error("토큰 갱신 실패", { url });
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }
  }

  const errorBody = await res.json().catch(() => ({}));
  const errorMessage =
    extractErrorMessage(errorBody, res.status, context) || errorBody.message;

  logger.error("API 요청 실패", {
    url,
    status: res.status,
    duration: `${duration}ms`,
    errorMessage,
    errorBody,
    context,
  });

  throw new Error(errorMessage);
}

// 액세스 토큰 가져오기
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("access_token");
  logger.debug("액세스 토큰 조회", { hasToken: !!token });

  return localStorage.getItem("access_token");
}

// 리프레시 토큰으로 새 액세스 토큰 요청
async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    logger.warn("리프레시 토큰이 없어 갱신 불가");
    return false;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (!res.ok) {
      logger.error("토큰 갱신 요청 실패", {
        status: res.status,
        statusText: res.statusText,
      });
      return false;
    }

    const data = await res.json();
    localStorage.setItem("access_token", data.accessToken);

    logger.info("토큰 갱신 성공");
    return true;
  } catch (error) {
    logger.error("토큰 갱신 중 예외 발생", error);
    return false;
  }
}
