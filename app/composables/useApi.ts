import { ofetch } from "ofetch";
import { toast } from "vue-sonner";

let isFetchingToken = false;

export const useApi = (): ReturnType<typeof ofetch.create> => {
  const { apiBase } = useRuntimeConfig().public;
  const { token, refreshToken } = storeToRefs(useTokensStore());

  const api = ofetch.create({
    baseURL: apiBase,
    retry: 1,
    retryDelay: 1000,
    timeout: 3000,
    retryStatusCodes: [401],
    async onRequest({ options }) {
      options.headers = new Headers(options.headers);
      if (token.value)
        options.headers.set("Authorization", `Bearer ${token.value}`);
    },
    async onResponseError({ response }) {
      const statusCode = response.status;

      if (statusCode >= 500)
        toast.error("服务器错误", {
          description: "请稍候重试",
          closeButton: true,
        });
      else if (statusCode === 401) {
        if (isFetchingToken) return;

        isFetchingToken = true;

        console.log("获取新token中...");
        try {
          const tokens = await useRefreshToken();

          token.value = tokens.accessToken;
          refreshToken.value = tokens.refreshToken;
          console.log("获取新token成功");
        } catch (error) {
          console.log("获取新token失败");
          navigateTo("/login", { replace: true });
        } finally {
          isFetchingToken = false;
        }
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
      else if (statusCode === 409)
        toast.error("请求失败", {
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

  return api;
};
