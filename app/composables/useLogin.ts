import { sha256 } from "js-sha256";
import { toast } from "vue-sonner";

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export const useLogin = async (username: string, password: string) => {
  const { apiBase } = useRuntimeConfig().public;

  const loginResponse = await $fetch<LoginResponse>("/auth/login", {
    baseURL: apiBase,
    retry: false,
    method: "POST",
    body: {
      username,
      password: sha256(password),
    },
    async onResponseError({ request, options, response, error }) {
      const statusCode = response.status;

      if (statusCode < 400) return;

      if (statusCode >= 500)
        toast.error("服务器错误", {
          description: "请稍候重试",
          closeButton: true,
        });
      else if (statusCode === 401)
        toast.warning("认证失败", {
          description: response._data.message,
          closeButton: true,
        });
      else if (statusCode === 403)
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
  });

  return loginResponse;
};
