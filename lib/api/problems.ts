import apiClient from "./client";
import type { ApiProblem, ProblemsResponse, UpdateProblemPayload } from "@/lib/types";

export const getProblems = async (params?: {
  category?: string;
  difficulty?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<ProblemsResponse> => {
  const response = await apiClient.get<ProblemsResponse>("/problems", { params });
  return response.data;
};

export const getProblemDetail = async (id: string): Promise<ApiProblem> => {
  const response = await apiClient.get<{ data: ApiProblem }>(`/problems/${id}`);
  return response.data.data;
};

export const getAdminStats = async (): Promise<any> => {
  const response = await apiClient.get("/problems/admin/stats");
  return response.data;
};

export const updateProblem = async (id: string, data: UpdateProblemPayload): Promise<ApiProblem> => {
  const response = await apiClient.put<{ data: ApiProblem }>(`/problems/${id}`, data);
  return response.data.data;
};

export const deleteProblem = async (id: string): Promise<void> => {
  await apiClient.delete(`/problems/${id}`);
};

export interface ExecuteResult {
  success: boolean;
  status: string;
  passed: number;
  total: number;
  message: string;
  submissionId: number | null;
}

export const runCode = async (
  problemId: string,
  code: string,
  language: string,
  isSubmit: boolean
): Promise<ExecuteResult> => {
  const response = await apiClient.post<ExecuteResult>("/execute/run", {
    problemId,
    code,
    language,
    isSubmit,
  });
  return response.data;
};
export const getRandomProblem = async (): Promise<string | null> => {
  try {
    const response = await apiClient.get("/problems/random");
    return response.data.data.id;
  } catch (error) {
    throw error;
  }
};