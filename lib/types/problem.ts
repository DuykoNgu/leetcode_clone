export type ProblemDifficulty = "Easy" | "Medium" | "Hard";

export type ProblemCategory = 
  | "all-code-essentials"
  | "algorithms"
  | "database"
  | "pandas"
  | "javascript"
  | "shell"
  | "concurrency";

export type DBProblem = {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  category: string;
  acceptanceRate?: number;  // Optional for mock data compatibility
  order?: number;
  videoId?: string;
  link?: string;
  createdAt?: string;
};

export type ApiProblem = {
  id: string;
  title: string;
  acceptanceRate: number;  // API returns string
  difficulty: number;  // 0 = Easy, 1 = Medium, 2 = Hard
  createdAt?: string;
};

export type ProblemsResponse = {
  message: string;
  data: ApiProblem[];
};