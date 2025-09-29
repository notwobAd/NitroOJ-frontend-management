<script setup lang="ts">
import dayjs from "dayjs";
import { TrendingUp, TrendingDown } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";

const data = ref("");
const isLoading = ref(true);
const isError = ref(false);
const delta = ref(0);
const description = computed(
  () =>
    "相较于上月" +
    (delta.value >= 0 ? "增加" : "减少" + Math.abs(delta.value) + "次提交"),
);
const rate = ref(0);
const absRate = computed(() => Math.abs(rate.value).toFixed(1));

const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
const endDate = dayjs().endOf("month").format("YYYY-MM-DD");
const startDateLastMonth = dayjs()
  .subtract(1, "month")
  .startOf("month")
  .format("YYYY-MM-DD");
const endDateLastMonth = dayjs()
  .subtract(1, "month")
  .endOf("month")
  .format("YYYY-MM-DD");

const fetchData = async () => {
  try {
    isLoading.value = true;

    const [totalThisMonth, totalLastMonth] = await Promise.all([
      useGetSubmissionTotal({
        "create-begin": startDate,
        "create-end": endDate,
      }),
      useGetSubmissionTotal({
        "create-begin": startDateLastMonth,
        "create-end": endDateLastMonth,
      }),
    ]);

    data.value = "+" + totalThisMonth.total.toString();
    delta.value = totalThisMonth.total - totalLastMonth.total;
    rate.value =
      ((totalThisMonth.total - totalLastMonth.total) / totalLastMonth.total) *
      100;
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
  <DataCard
    :title="'本月新增提交'"
    :data="data"
    :is-loading="isLoading"
    :is-error="isError"
    @retry="fetchData()"
  >
    <template #action>
      <Badge variant="outline">
        <TrendingUp v-if="rate >= 0"></TrendingUp>
        <TrendingDown v-else></TrendingDown>
        {{ absRate }}%
      </Badge>
    </template>

    <template #footer>
      {{ description }}
      <TrendingUp class="size-4 ml-2" v-if="delta >= 0"></TrendingUp>
      <TrendingDown class="size-4 ml-2" v-else></TrendingDown>
    </template>
  </DataCard>
</template>
