<script setup lang="ts">
const { index, result } = defineProps<{ index: number; result: Result }>();
const text = computed(() => {
  if (result.status === Status.Accepted) return "AC";
  else if (result.status === Status.WrongAnswer) return "WA";
  else if (result.status === Status.MemoryLimitExceeded) return "MLE";
  else if (result.status === Status.TimeLimitExceeded) return "TLE";
  else if (result.status === Status.RuntimeError) return "RE";
  else if (result.status === Status.UnknownError) return "UKE";
  else return "测评中...";
});

const bgColor = computed(() => {
  if (result.status === Status.Accepted) return "bg-green-500";
  else if (result.status === Status.WrongAnswer) return "bg-red-500";
  else if (result.status === Status.MemoryLimitExceeded) return "bg-slate-600";
  else if (result.status === Status.TimeLimitExceeded) return "bg-slate-600";
  else if (result.status === Status.RuntimeError) return "bg-purple-500";
  else if (result.status === Status.UnknownError) return "bg-blue-900";
  else return "bg-secondary";
});
</script>

<template>
  <div
    class="size-25 relative flex justify-center items-center"
    :class="bgColor"
  >
    <span class="absolute inset-x-1 inset-y-0.5 text-xs"># {{ index }}</span>
    <span class="text-2xl">{{ text }}</span>
    <span class="absolute inset-y-18 text-xs text-nowrap"
      >{{ result.time ? result.time : "-" }} ms /
      {{ result.memory ? result.memory : "-" }} kB</span
    >
  </div>
</template>
