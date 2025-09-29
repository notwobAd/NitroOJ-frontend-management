import { toast } from "vue-sonner";

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export const useRefreshToken = async () => {
  const { apiBase } = useRuntimeConfig().public;
  const { refreshToken } = storeToRefs(useTokensStore());

  const refreshTokenResponse = await $fetch<RefreshTokenResponse>(
    "/auth/refresh",
    {
      baseURL: apiBase,
      retry: false,
      timeout: 900,
      headers: {
        Authorization: "Bearer" + " " + refreshToken.value,
      },
      async onResponseError({ response }) {
        const statusCode = response.status;

        if (statusCode >= 500)
          toast.error("服务器错误", {
            description: "请稍候重试",
            closeButton: true,
          });
        else if (statusCode === 401) {
          toast.warning("认证失败", {
            description: response._data.message,
            closeButton: true,
          });
        } else if (statusCode === 403)
          toast.warning("禁止访问", {
            description: response._data.message,
            closeButton: true,
          });
        else if (statusCode === 404)
          toast.error("找不到所需资源", {
            description: response._data.message,
            closeButton: true,
          });
        else
          toast.info("请求失败", {
            description: "请稍候重试",
            closeButton: true,
          });
      },
    },
  );

  return refreshTokenResponse;
};
