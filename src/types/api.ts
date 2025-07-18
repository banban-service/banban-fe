// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface APIResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface APIError {
  message: string;
  status: number;
  code?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}
