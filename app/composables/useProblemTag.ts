export type GetProblemTagListRequest = {
  search?: string;
};

export type ProblemTag = {
  id: number;
  name: string;
};

export type UpdateProblemTagRequest = {
  name: string;
};

export type UpdateProblemTagResponse = {
  id: number;
};

export type RemoveProblemTagResponse = {
  id: number;
};

export type CreateProblemTagRequest = {
  name: string;
};

export type CreateProblemTagResponse = {
  id: number;
};

export const useGetProblemTagList = async (
  query?: GetProblemTagListRequest,
) => {
  const api = useApi();

  return await api<ProblemTag[]>("/problem-tags", { query });
};

export const useUpdateProblemTag = async (
  id: number,
  body: UpdateProblemTagRequest,
) => {
  const api = useApi();

  return await api<UpdateProblemTagResponse>(`/problem-tags/${id}`, {
    method: "PUT",
    body,
  });
};

export const useRemoveProblemTag = async (id: number) => {
  const api = useApi();

  return await api<RemoveProblemTagResponse>(`/problem-tags/${id}`, {
    method: "DELETE",
  });
};

export const useCreateProblemTag = async (body: CreateProblemTagRequest) => {
  const api = useApi();

  return await api<CreateProblemTagResponse>("/problem-tags", {
    method: "POST",
    body,
  });
};
