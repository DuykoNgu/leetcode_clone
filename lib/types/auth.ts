export type AuthUser = {
  id: string | number;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  avatarUrl?: string | null;
  solvedCount?: number;
  streakDays?: number;
  lastActive?: string | null;
};

export type AuthSuccessResponse = {
  message: string;
  data: {
    user: AuthUser;
    token: string;
    refreshToken?: string;
  };
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type MeResponse = {
  data: {
    user: AuthUser;
  };
};