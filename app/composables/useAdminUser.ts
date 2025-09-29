export type GetAdminUserProfileResponse = {
  createdAt: string;
  id: number;
  isActive: boolean;
  role: AdminUserRole;
  username: string;
};

export enum AdminUserRole {
  Admin = "admin",
  Superadmin = "superadmin",
}

export const useGetAdminUserProfile = async () => {
  const api = useApi();

  return await api<GetAdminUserProfileResponse>("/admin-users/profile");
};
