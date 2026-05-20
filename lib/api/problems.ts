import apiClient from "./client";
import type { ApiProblem, ProblemsResponse } from "@/lib/types";

export const getProblems = async (params?: any): Promise<any> => {
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