<script setup lang="ts">
import { Separator } from "@/components/ui/separator";
import { CircleX } from "lucide-vue-next";

const isLoading = ref(true);
const isError = ref(false);
const isSuccess = computed(() => !(isLoading.value || isError.value));

const getSubmissionTotal = ref<GetSubmissionTotalResponse[]>([]);
const sum = computed(() => {
  let sum = 0;
  getSubmissionTotal.value.forEach((value) => (sum += value.total));
  return sum;
});

const dountData = computed(() =>
  getSubmissionTotal.value.map((value) => value.total),
);
const acceptedRate = computed(
  () => (((dountData.value[0] ?? 0) / sum.value) * 100).toFixed(1) + "%",
);
const labels = [
  { name: "已通过", color: "#22c55e" },
  { name: "未通过", color: "#ef4444" },
  { name: "编译错误", color: "#fbbf24" },
];

const fetchData = async () => {
  try {
    isLoading.value = true;

    getSubmissionTotal.value = await Promise.all([
      useGetSubmissionTotal({ status: SubmissionStatus.Accepted }),
      useGetSubmissionTotal({ status: SubmissionStatus.Unaccepted }),
      useGetSubmissionTotal({ status: SubmissionStatus.CompileError }),
    ]);
  } catch (error) {
    isError.value = false;
  } finally {
    isLoading.value = false;
  }
};
fetchData();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-2xl">总通过率</CardTitle>
    </CardHeader>

    <CardContent class="h-full flex justify-center items-center">
      <div>
        <DonutChart
          v-if="isSuccess"
          :data="dountData"
          :height="300"
          :radius="0"
          :labels="labels"
          :arc-width="50"
        >
          <div class="absolute text-3xl text-center">
            <span>{{ acceptedRate }}</span>
          </div>

          <template #tooltip="{ values }">
            <div
              class="h-15 rounded-md border border-accent flex items-center px-2 py-1 space-x-2"
            >
              <span class="text-2xl text-secondary-foreground"
                >{{ (((values?.data ?? 0) / sum) * 100).toFixed(1) }}%</span
              >
              <Separator orientation="vertical"></Separator>
              <div class="h-full flex flex-col">
                <span class="text-xl">{{
                  labels[values?.index]?.name ?? 0
                }}</span>
                <span class="text-md">共{{ values?.data ?? 0 }}次</span>
              </div>
            </div>
          </template>
        </DonutChart>
      </div>

      <div v-if="!isSuccess">
        <Spinner v-if="isLoading" :message="'加载中...'"></Spinner>
        <div class="flex flex-col items-center space-y-2" v-else>
          <CircleX class="size-10"></CircleX>
          <span>获取数据失败,请重试</span>
          <Button class="p-2" @click="fetchData()">重新加载</Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
