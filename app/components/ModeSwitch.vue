<script setup lang="ts">
import { Switch } from "@/components/ui/switch";
import { LucideSun, LucideMoon } from "lucide-vue-next";

const colorMode = useColorMode();

const isDark = ref<boolean>(colorMode.preference === "dark");
const changeMode = () => {
  colorMode.preference = isDark.value ? "dark" : "light";
};
</script>

<template>
  <Switch v-model="isDark" @update:model-value="changeMode">
    <template #thumb>
      <LucideSun v-if="!isDark" class="size-3"></LucideSun>
      <LucideMoon v-else class="size-3"></LucideMoon>
    </template>
  </Switch>
</template>
