<script setup lang="ts">
import { useGetProblemTotal } from "#imports";

const data = ref("");
const isLoading = ref(true);
const isError = ref(false);

const fetchData = async () => {
  try {
    isLoading.value = true;

    const getProblemTotalResponse = await useGetProblemTotal();

    data.value = getProblemTotalResponse.total.toString();
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
    :title="'历史题目总数'"
    :data="data"
    :is-loading="isLoading"
    :is-error="isError"
    @retry="fetchData()"
  >
  </DataCard>
</template>
