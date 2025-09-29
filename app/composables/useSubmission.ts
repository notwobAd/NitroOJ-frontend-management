export type GetSubmissionTotalResponse = {
  total: number;
};

export type GetSubmissionTotalRequest = {
  "create-begin"?: string;
  "create-end"?: string;
  problem?: number;
  status?: SubmissionStatus;
  user?: number;
};

export enum SubmissionStatus {
  Accepted = "accepted",
  CompileError = "compile_error",
  Compiling = "compiling",
  Judging = "judging",
  Pending = "pending",
  Unaccepted = "unaccepted",
}

export type GetSubmissionTotalByDayRequest = {
  days: number;
};

export type GetSubmissionTotalByDayResponse = {
  date: string;
  accepted: number;
  unaccepted: number;
  total: number;
};

export type GetSubmissionListRequest = {
  "create-begin"?: string;
  "create-end"?: string;
  page: number;
  problem?: number;
  size: number;
  status?: SubmissionStatus;
  user?: number;
};

export type GetSubmissionListResponse = {
  rows: SubmissionListRow[];
  total: number;
};

export type GetSubmissionListRowRequest = {
  ids: number[];
};

export type SubmissionListRow = {
  createdAt: string;
  id: number;
  time: number | null;
  memory: number | null;
  problem: Problem;
  status: SubmissionStatus;
  user: User;
};

export type GetSubmissionResponse = {
  compileInfo: CompileInfo;
  createdAt: string;
  id: number;
  memory: number | null;
  problem: Problem;
  results: Result[];
  runtimeInfo: RuntimeInfo;
  source: string;
  status: SubmissionStatus;
  time: number | null;
  user: User;
};

export enum Status {
  Accepted = "accepted",
  Judging = "judging",
  MemoryLimitExceeded = "memory_limit_exceeded",
  RuntimeError = "runtime_error",
  TimeLimitExceeded = "time_limit_exceeded",
  UnknownError = "unknown_error",
  WrongAnswer = "wrong_answer",
}

export type Problem = {
  createdAt: string;
  id: number;
  title: string;
};

export type User = {
  createdAt: string;
  description: string | null;
  email: string;
  id: number;
  isActive: boolean;
  username: string;
};

export type Result = {
  createdAt: string;
  id: number;
  memory: number | null;
  status: Status;
  time: number | null;
};

export type RuntimeInfo = {
  createdAt: string;
  id: number;
  info: string | null;
};

export type CompileInfo = {
  createdAt: string;
  id: number;
  info: string | null;
};

export type RejudgeSubmissionResponse = {
  id: number;
};

export const useGetSubmissionTotal = async (
  query?: GetSubmissionTotalRequest,
) => {
  const api = useApi();

  return await api<GetSubmissionTotalResponse>("/submissions/total", {
    query,
  });
};

export const useGetSubmissionTotalByDay = async (
  query: GetSubmissionTotalByDayRequest,
) => {
  const api = useApi();

  return await api<GetSubmissionTotalByDayResponse[]>(
    "/submissions/total/by-day",
    { query },
  );
};

export const useGetSubmissionList = async (query: GetSubmissionListRequest) => {
  const api = useApi();

  return await api<GetSubmissionListResponse>("/submissions", { query });
};

export const useGetSubmissionListRow = async (
  query: GetSubmissionListRowRequest,
) => {
  const api = useApi();

  return await api<SubmissionListRow[]>("/submissions/row", {
    query,
  });
};

export const useGetSubmission = async (id: number) => {
  const api = useApi();

  return await api<GetSubmissionResponse>(`/submissions/${id}`);
};

export const useRejudgeSubmission = async (id: number) => {
  const api = useApi();

  return await api<RejudgeSubmissionResponse>(`/submissions/${id}`, {
    method: "PUT",
  });
};
