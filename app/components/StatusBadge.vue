<script setup lang="ts">
import { Loader } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";

const { status } = defineProps<{ status: SubmissionStatus }>();
const text = computed(() => {
  if (status === SubmissionStatus.Accepted) return "AC";
  else if (status === SubmissionStatus.Unaccepted) return "WA";
  else if (status === SubmissionStatus.CompileError) return "CE";
  else if (status === SubmissionStatus.Compiling) return "Compiling";
  else if (status === SubmissionStatus.Judging) return "Judging";
  if (status === SubmissionStatus.Pending) return "Pending";
});
</script>

<template>
  <Badge
    :class="{
      'bg-green-500': status === SubmissionStatus.Accepted,
      'bg-red-500': status === SubmissionStatus.Unaccepted,
      'bg-amber-400': status === SubmissionStatus.CompileError,
    }"
    :variant="
      status === SubmissionStatus.Compiling ||
      status === SubmissionStatus.Judging ||
      status === SubmissionStatus.Pending
        ? 'outline'
        : 'default'
    "
  >
    <Loader
      v-if="
        status === SubmissionStatus.Compiling ||
        status === SubmissionStatus.Judging ||
        status === SubmissionStatus.Pending
      "
      class="size-5 animate-spin"
    ></Loader>
    <span>{{ text }}</span>
  </Badge>
</template>
