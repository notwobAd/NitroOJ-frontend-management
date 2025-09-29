export type CreateAnnouncementRequest = {
  content: string;
  title: string;
  priority: number;
};

export type CreateAnnouncementResponse = {
  id: number;
};

export type GetAnnouncementListRequest = {
  page: number;
  size: number;
};

export type GetAnnouncementListResponse = {
  rows: AnnouncementListRow[];
  total: number;
};

export type AnnouncementListRow = {
  id: number;
  createdAt: string;
  title: string;
};

export type GetAnnouncementResponse = {
  content: string;
  createdAt: string;
  id: number;
  title: string;
  priority: number;
};

export type UpdateAnnouncementRequest = {
  content?: string;
  priority?: number;
  title?: string;
};

export type UpdateAnnouncementResponse = {
  id: number;
};

export type RemoveAnnouncementResponse = {
  id: number;
};

export const useCreateAnnouncement = async (
  body: CreateAnnouncementRequest,
) => {
  const api = useApi();

  return await api<CreateAnnouncementResponse>("/announcements", {
    method: "POST",
    body,
  });
};

export const useGetAnnouncementList = async (page: number, size: number) => {
  const api = useApi();

  return await api<GetAnnouncementListResponse>("/announcements", {
    query: {
      page,
      size,
    },
  });
};

export const useGetAnnouncement = async (id: number) => {
  const api = useApi();

  return await api<GetAnnouncementResponse>(`/announcements/${id}`);
};

export const useUpdateAnnouncement = async (
  id: number,
  body: UpdateAnnouncementRequest,
) => {
  const api = useApi();

  return await api<UpdateAnnouncementResponse>(`/announcements/${id}`, {
    method: "PUT",
    body,
  });
};

export const useRemoveAnnouncement = async (id: number) => {
  const api = useApi();

  return await api<RemoveAnnouncementResponse>(`/announcements/${id}`, {
    method: "DELETE",
  });
};
