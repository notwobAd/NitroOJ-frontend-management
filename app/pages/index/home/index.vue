<script setup lang="ts"></script>

<template>
  <div class="h-screen w-full p-6 flex flex-col gap-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <NewUserCard></NewUserCard>
      <NewSubmissionCard></NewSubmissionCard>
      <TotalSubmissionCard></TotalSubmissionCard>
      <TotalProblemCard></TotalProblemCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <SubmissionChart class="min-h-[300px] lg:col-span-3"></SubmissionChart>
      <RateChart class="min-h-[300px] lg:col-span-1"></RateChart>
    </div>

    <div>
      <SubmissionsDataTable></SubmissionsDataTable>
    </div>
  </div>
</template>
