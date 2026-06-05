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
  isSolved?: boolean;
};

export type CodeTemplate = {
  id: string;
  language: string;
  starterCode: string;
  solutionCode?: string;
};

export type TestCase = {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
};

export type Submission = {
  id: string;
  language: string;
  code: string;
  status: string;
  runtimeMs?: number;
  memoryKb?: number;
  submittedAt: string;
   // THÊM
  passedCases?: number;  
  totalCases?: number;  
  errorMessage?: string;
};

export type ProblemExample = {
  id?: string;
  input: string;
  output: string;
  explanation?: string;
  orderIndex?: number;
};

export type ProblemConstraint = {
  id?: string;
  content: string;
  orderIndex?: number;
};

export type ApiProblem = {
  id: string;
  title: string;
  description: string;
  acceptanceRate: number;
  difficulty: number;
  createdAt?: string;
  codeTemplates?: CodeTemplate[];
  testCases?: TestCase[];
  submissions?: Submission[];
  examples?: ProblemExample[];
  constraints?: ProblemConstraint[];
  isSolved?: boolean;
};

export type UpdateProblemPayload = {
  title?: string;
  description?: string;
  difficulty?: number;
  codeTemplates?: { language: string; starterCode: string; solutionCode?: string }[];
  testCases?: { input: string; expectedOutput: string; isHidden?: boolean }[];
  examples?: { input: string; output: string; explanation?: string }[];
  constraints?: { content: string }[];
  problemTags?: { tag: { name: string; slug: string } }[];
};

export type ProblemsResponse = {
  message: string;
  data: ApiProblem[];
  userStats?: {
    solvedCount: number;
    streakDays: number;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};