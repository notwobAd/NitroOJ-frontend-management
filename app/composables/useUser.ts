export type GetUserTotalResponse = {
  total: number;
};

export type GetUserTotalRequest = {
  active?: boolean;
  "create-begin"?: string;
  "create-end"?: string;
};

export type GetUserListRequest = {
  active?: boolean;
  "create-begin"?: string;
  "create-end"?: string;
  id?: number;
  page: number;
  search?: string;
  size: number;
};

export type GetUserListResponse = {
  rows: UserListRow[];
  total: number;
};

export type UserListRow = {
  createdAt: string;
  description: null | string;
  email: string;
  id: number;
  isActive: boolean;
  username: string;
};

export type UpdateUserResponse = {
  id: number;
};

export type UpdateUserRequest = {
  isActive?: boolean;
  /**
   * 密码sha256值
   */
  password?: string;
  username?: string;
};

export type RemoveUserResponse = {
  id: number;
};

export const useGetUserTotal = async (query?: GetUserTotalRequest) => {
  const api = useApi();

  return await api<GetUserTotalResponse>("/users/total", {
    query,
  });
};

export const useGetUserList = async (query: GetUserListRequest) => {
  const api = useApi();

  return await api<GetUserListResponse>("/users", { query });
};

export const useUpdateUser = async (id: number, body: UpdateUserRequest) => {
  const api = useApi();

  return await api<UpdateUserResponse>(`/users/${id}`, {
    method: "PUT",
    body,
  });
};

export const useRemoveUser = async (id: number) => {
  const api = useApi();

  return await api<RemoveUserResponse>(`/users/${id}`, { method: "DELETE" });
};
