<script setup lang="ts">
import {
  VueMonacoEditor,
  loader,
  type EditorProps,
} from "@guolao/vue-monaco-editor";

loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs",
  },
  "vs/nls": {
    availableLanguages: {
      "*": "zh-cn",
    },
  },
});

const colorMode = useColorMode();
const theme = computed(() => (colorMode.value === "dark" ? "vs-dark" : "vs"));

const props = defineProps<Partial<EditorProps>>();
</script>

<template>
  <div class="h-[800px] w-full">
    <VueMonacoEditor
      v-bind="{ ...$attrs, ...props }"
      :theme
      :options="{
        contextmenu: false,
        automaticLayout: true,
        readOnly: props.options?.readOnly,
      }"
    >
      <template #default> 正在加载编辑器中... </template>
      <template #failure> 加载编辑器失败😨,请尝试刷新页面 </template>
    </VueMonacoEditor>
  </div>
</template>
