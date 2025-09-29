import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  devServer: {
    port: 5000,
    cors: { origin: ["http://localhost:3001"] },
  },

  runtimeConfig: {
    public: {
      apiBase: "",
    },
  },

  ssr: false,

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/css/main.css", "md-editor-v3/lib/style.css"],

  modules: [
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-charts",
  ],
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  colorMode: {
    classSuffix: "",
  },
  pinia: {
    storesDirs: ["./app/stores/**"],
  },

  app: {
    head: {
      title: "NitroOj管理中心",
      // link: [{ rel: "icon", type: "image/x-icon", href: "public/favicon.ico" }],
    },
  },
});
