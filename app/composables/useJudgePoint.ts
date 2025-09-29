import { strToU8 } from "fflate";

export type UpdateJudgePointResponse = {
  id: number;
};

export const useGetJudgePointInputFile = async (id: number) => {
  const api = useApi();

  return await api<Blob>(`/judge-points/${id}/input`);
};

export const useGetJudgePointOutputFile = async (id: number) => {
  const api = useApi();

  return await api<Blob>(`/judge-points/${id}/output`);
};

export type RemoveJudgePointResponse = {
  id: number;
};

export const useUpdateJudgePoint = async (
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
  else formData.append("description", "");

  return await api<UpdateJudgePointResponse>(`/judge-points/${id}`, {
    method: "PUT",
    body: formData,
  });
};

export const useRemoveJudgePoint = async (id: number) => {
  const api = useApi();

  return await api<RemoveJudgePointResponse>(`/judge-points/${id}`, {
    method: "DELETE",
  });
};
