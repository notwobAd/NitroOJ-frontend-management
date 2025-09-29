import { strToU8 } from "fflate";

export type GetProblemTotalRequest = {
  active?: boolean;
  "create-begin"?: string;
  "create-end"?: string;
};

export type GetProblemTotalResponse = {
  total: number;
};

export type GetProblemListRequest = {
  active?: boolean;
  "create-begin"?: string;
  "create-end"?: string;
  id?: number;
  "max-level"?: number;
  "min-level"?: number;
  page: number;
  search?: string;
  size: number;
};

export type GetProblemListResponse = {
  rows: ProblemListRow[];
  total: number;
};

export type ProblemListRow = {
  createdAt: string;
  id: number;
  isActive: boolean;
  level: number;
  memoryLimit: number;
  tags: Tag[];
  timeLimit: number;
  title: string;
};

export type Tag = {
  id: number;
  name: string;
};

export type UpdateProblemRequest = {
  content?: string;
  isActive?: boolean;
  level?: number;
  memoryLimit?: number;
  tags?: number[];
  timeLimit?: number;
  title?: string;
};

export type UpdateProblemResponse = {
  id: number;
};

export type RemoveProblemResponse = {
  id: number;
};

export type GetProblemResponse = {
  content: string;
  createdAt: string;
  id: number;
  isActive: boolean;
  level: number;
  memoryLimit: number;
  tags: Tag[];
  timeLimit: number;
  title: string;
};

export type GetProblemJudgePointsResponse = {
  description: null | string;
  id: number;
};

export type CreateProblemRequest = {
  content: string;
  level: number;
  memoryLimit: number;
  tags: number[];
  timeLimit: number;
  title: string;
};

export type CreateJudgePointResponse = {
  id: number;
};

export type RejudgeProblemResponse = {
  id: number;
};

export const useGetProblemTotal = async () => {
  const api = useApi();

  return await api<GetProblemTotalResponse>("/problems/total");
};

export const useGetProblemList = async (query: GetProblemListRequest) => {
  const api = useApi();

  return await api<GetProblemListResponse>("/problems", {
    query,
  });
};

export const useUpdateProblem = async (
  id: number,
  body: UpdateProblemRequest,
) => {
  const api = useApi();

  return await api<UpdateProblemResponse>(`/problems/${id}`, {
    method: "PUT",
    body,
  });
};

export const useRemoveProblem = async (id: number) => {
  const api = useApi();

  return await api<RemoveProblemResponse>(`/problems/${id}`, {
    method: "DELETE",
  });
};

export const useGetProblem = async (id: number) => {
  const api = useApi();

  return await api<GetProblemResponse>(`/problems/${id}`);
};

export const useCreateProblem = async (body: CreateProblemRequest) => {
  const api = useApi();

  return await api<CreateProblemRequest>("/problems", { method: "POST", body });
};

export const useRejudgeProblem = async (id: number) => {
  const api = useApi();

  return await api<RejudgeProblemResponse>(`/problems/${id}/submissions`, {
    method: "PUT",
  });
};

export const useGetProblemJudgePoints = async (id: number) => {
  const api = useApi();

  return await api<GetProblemJudgePointsResponse[]>(
    `/problems/${id}/judge-points`,
  );
};

export const useCreateJudgePoint = async (
  id: number,
  input: string,
  output: string,
  description?: string,
) => {
  const api = useApi();

  const formData = new FormData();
  const [inputGzip, outputGzip] = await Promise.all([
    useCompress(strToU8(input)),
    useCompress(strToU8(output)),
  ]);

  formData.append(
    "input",
    new Blob([inputGzip], { type: "application/gzip" }),
    "input.gz",
  );
  formData.append(
    "output",
    new Blob([outputGzip], { type: "application/gzip" }),
    "output.gz",
  );
  if (description) formData.append("description", description);

  return await api<CreateJudgePointResponse>(`/problems/${id}/judge-points`, {
    method: "POST",
    body: formData,
  });
};
