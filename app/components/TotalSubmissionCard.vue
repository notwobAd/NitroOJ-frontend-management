<script setup lang="ts">
const data = ref("");
const isLoading = ref(true);
const isError = ref(false);

const fetchData = async () => {
  try {
    isLoading.value = true;

    const getSubmissionTotalResponse = await useGetSubmissionTotal();

    data.value = getSubmissionTotalResponse.total.toString();
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
    :title="'历史提交记录总数'"
    :data="data"
    :is-loading="isLoading"
    :is-error="isError"
    @retry="fetchData()"
  >
  </DataCard>
</template>
