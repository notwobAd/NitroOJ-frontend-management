<script setup lang="ts">
const { tags } = defineProps<{ tags: Tag[] }>();
</script>

<template>
  <div class="flex items-center space-x-0.5">
    <Badge
      v-if="tags.length"
      v-for="tag in tags"
      :key="tag.id"
      class="rounded-full"
      >{{ tag.name }}</Badge
    >
    <span v-else>-</span>
  </div>
</template>
