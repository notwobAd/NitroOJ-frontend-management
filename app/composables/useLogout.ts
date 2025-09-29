export type LogoutResponse = {
  id: number;
};

export const useLogout = async () => {
  const api = useApi();

  const logoutResponse = await api<LogoutResponse>("/auth/logout", {
    method: "POST",
  });

  return logoutResponse;
};
