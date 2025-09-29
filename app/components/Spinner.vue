<script setup lang="ts">
import { LoaderCircle } from "lucide-vue-next";

const { message } = defineProps({
  message: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <div class="flex flex-col justify-center items-center space-y-2">
    <LoaderCircle class="size-10 animate-spin"></LoaderCircle>
    <span v-if="message">{{ message }}</span>
  </div>
</template>
