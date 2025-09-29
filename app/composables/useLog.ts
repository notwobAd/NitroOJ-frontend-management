export type GetLogRequest = {
  month: number;
  year: number;
};

export type GetLogResponse = {
  fileName: string;
};

export const useGetLogResponse = async (query: GetLogRequest) => {
  const api = useApi();

  return await api<GetLogResponse[]>("/logs", {
    query,
  });
};

export const useGetLogFile = async (file: string) => {
  const api = useApi();

  return api<string>(`/logs/${file}`);
};
