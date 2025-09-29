<script setup lang="ts">
import { CircleX } from "lucide-vue-next";

const isLoading = ref(true);
const isError = ref(false);
const isSuccess = computed(() => !(isLoading.value || isError.value));

const submissionChartData = ref<GetSubmissionTotalByDayResponse[]>([]);
const categories = {
  accepted: {
    name: "已通过",
    color: "#10b981",
  },
  unaccepted: {
    name: "未通过",
    color: "#ef4444",
  },
  total: {
    name: "total",
    color: "#3b82f6",
  },
};
const xFormatter = (index: number) => submissionChartData.value[index]!.date;

const fetchData = async () => {
  try {
    isLoading.value = true;

    submissionChartData.value = await useGetSubmissionTotalByDay({ days: 31 });
  } catch (error) {
    console.log(error);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

fetchData();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-2xl"> 历史31天总提交量 </CardTitle>
    </CardHeader>

    <CardContent class="h-full flex justify-center items-center">
      <AreaChart
        class="w-full"
        v-if="isSuccess"
        :data="submissionChartData"
        :categories="categories"
        :height="300"
        xLabel="日期"
        yLabel="提交量"
        :xFormatter="xFormatter"
        yGridLine
        :legend-position="LegendPosition.Top"
      ></AreaChart>

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
