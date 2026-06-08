export type AuthUser = {
  id: string | number;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  avatarUrl?: string | null;
  birthday?: string | null;
  solvedCount?: number;
  streakDays?: number;
  lastActive?: string | null;
  difficultyStats?: {
    Easy: { solved: number; total: number };
    Medium: { solved: number; total: number };
    Hard: { solved: number; total: number };
  };
  submissions?: { submittedAt: string; status: string }[];
  recentAC?: {
    problem: { title: string; slug: string };
    submittedAt: string;
  }[];
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

export type UpdateProfilePayload = {
  username?: string;
  email?: string;
  avatarUrl?: string | null;
  birthday?: string | null;
};

export type UpdateProfileResponse = {
  success: boolean;
  data: {
    user: AuthUser;
  };
};