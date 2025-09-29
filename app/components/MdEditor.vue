<script setup lang="ts">
import { MdEditor, type Themes, type ToolbarNames } from "md-editor-v3";

const colorMode = useColorMode();
const toolBars: ToolbarNames[] = [
  "catalog",
  "-",
  "revoke",
  "next",
  "prettier",
  "-",
  "title",
  "bold",
  "underline",
  "italic",
  "strikeThrough",
  "-",
  "katex",
  "sub",
  "sup",
  "-",
  "codeRow",
  "code",
  "link",
  "=",
  "preview",
  "previewOnly",
  "pageFullscreen",
  "fullscreen",
];

const modelValue = defineModel<string>();
const emit = defineEmits(["onChange"]);
</script>

<template>
  <MdEditor
    v-model="modelValue"
    :max-length="3000"
    :theme="colorMode.value as Themes"
    preview-theme="vuepress"
    no-mermaid
    code-theme="github"
    :toolbars="toolBars"
    show-toolbar-name
    placeholder="在这里编辑题目"
    @on-change="$emit('onChange')"
  >
  </MdEditor>
</template>
