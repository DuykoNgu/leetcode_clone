import apiClient from "./client";
import type { ApiProblem, ProblemsResponse } from "@/lib/types";

export const getProblems = async (): Promise<ApiProblem[]> => {
  const response = await apiClient.get<ProblemsResponse>("/problems");
  return response.data.data;
};