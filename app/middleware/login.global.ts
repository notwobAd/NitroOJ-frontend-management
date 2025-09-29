export default defineNuxtRouteMiddleware((to, from) => {
  const { token, refreshToken } = storeToRefs(useTokensStore());
  if (to.path !== "/login" && (!token.value || !refreshToken.value))
    return navigateTo("/login", { replace: true });
});
