import { TokenRequestResponse } from "@/types/auth";

export async function getToken({
  code,
  provider,
  state,
}: {
  code: string;
  provider: "kakao" | "naver";
  state?: string;
}) {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/oauth/${provider}/callback`;
  const target = new URL(baseUrl);
  target.searchParams.set("code", code);
  if (state) {
    target.searchParams.set("state", state);
  }
  const response = await fetch(target.toString(), {
    method: "GET",
    credentials: "include",
  });

  let data: TokenRequestResponse;
  try {
    data = await response.json();
  } catch {
    throw new Error("서버 응답을 파싱하는 데 실패했습니다.");
  }

  return { data, response };
}
