<script setup lang="ts">
import type { NuxtError } from "#app";

const { error } = defineProps<{ error: NuxtError }>();
</script>

<template>
  <div
    class="h-screen w-full flex flex-col items-center justify-center space-y-4"
  >
    <h1 class="font-bold text-9xl">{{ error.statusCode }}</h1>
    <h1 class="text-2xl">{{ error.statusMessage }}</h1>
    <h1 class="text-lg">不好,发生了些意外😱</h1>
    <Button variant="outline" @click="$router.replace('/home')"
      >返回首页</Button
    >
  </div>
</template>
