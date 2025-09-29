<script setup lang="ts">
import { Star } from "lucide-vue-next";

const { level, max } = defineProps<{ level: number; max: number }>();
const LimitedLevel = computed(() => {
  let value = Math.max(level, 0);
  value = Math.min(level, max);

  return value;
});
const rest = computed(() => Math.max(max - level, 0));
</script>

<template>
  <div class="flex items-center">
    <Star
      v-for="_ in LimitedLevel"
      class="size-4 text-primary fill-primary"
    ></Star>
    <Star v-for="_ in rest" class="size-4 text-muted-foreground"></Star>
  </div>
</template>
