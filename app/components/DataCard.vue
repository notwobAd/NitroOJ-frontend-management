<script setup lang="ts">
import { CircleX } from "lucide-vue-next";

const { title, data, isLoading, isError } = defineProps({
  title: { type: String, required: true },
  data: { type: String, required: true },
  isLoading: {
    type: Boolean,
    required: true,
  },
  isError: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["retry"]);

const isSuccess = computed(() => !(isLoading || isError));
</script>

<template>
  <Card class="h-50 bg-linear-to-t from-neutral-200 dark:from-neutral-800">
    <CardHeader v-if="isSuccess">
      <CardDescription>{{ title }}</CardDescription>
      <CardTitle class="text-5xl">{{ data }}</CardTitle>
      <CardAction>
        <slot name="action"></slot>
      </CardAction>
    </CardHeader>

    <CardContent
      class="flex justify-center items-center h-full"
      v-if="!isSuccess"
    >
      <Spinner v-if="isLoading" :message="'加载中...'"></Spinner>
      <div class="flex flex-col items-center space-y-2" v-else>
        <CircleX class="size-10"></CircleX>
        <span>获取数据失败,请重试</span>
        <Button class="p-2" @click="emit('retry')">重新加载</Button>
      </div>
    </CardContent>

    <CardFooter v-if="isSuccess" class="mt-8">
      <slot name="footer"></slot>
    </CardFooter>
  </Card>
</template>
