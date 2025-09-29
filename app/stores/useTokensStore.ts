export const useTokensStore = defineStore(
  "tokens",
  () => {
    const token = ref<string>();
    const refreshToken = ref<string>();

    const clear = () => {
      token.value = undefined;
      refreshToken.value = undefined;
    };

    return { token, refreshToken, clear };
  },
  { persist: true },
);
