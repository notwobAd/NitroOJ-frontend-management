<script setup lang="ts" generic="TData, TValue">
import { FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns } from "./columns";
import { CircleX } from "lucide-vue-next";

const isLoading = ref(true);
const isError = ref(false);
const isSuccess = computed(() => !(isLoading.value || isError.value));

const page = ref(1);
const size = ref(10);
const getSubmissionListResponse = ref<GetSubmissionListResponse>({
  rows: [],
  total: 0,
});

const fetchData = async () => {
  try {
    isLoading.value = true;

    getSubmissionListResponse.value = await useGetSubmissionList({
      page: page.value,
      size: size.value,
    });
  } catch (error) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};
await fetchData();

const pollFetchData = async () => {
  try {
    const idToIndexMap = new Map<number, number>();

    getSubmissionListResponse.value.rows.forEach(({ id, status }, index) => {
      if (
        status === SubmissionStatus.Compiling ||
        status === SubmissionStatus.Judging ||
        status === SubmissionStatus.Pending
      )
        idToIndexMap.set(id, index);
    });

    if (idToIndexMap.size === 0) return;

    const ids: number[] = [];
    for (const [id] of idToIndexMap) ids.push(id);

    const submissionListRows: SubmissionListRow[] =
      await useGetSubmissionListRow({
        ids,
      });

    submissionListRows.forEach((submission) => {
      getSubmissionListResponse.value.rows[
        idToIndexMap.get(submission.id)!
      ]!.time = submission.time;
      getSubmissionListResponse.value.rows[
        idToIndexMap.get(submission.id)!
      ]!.memory = submission.memory;
      getSubmissionListResponse.value.rows[
        idToIndexMap.get(submission.id)!
      ]!.status = submission.status;
    });
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout(() => {
      pollFetchData();
    }, 5 * 1000);
  }
};

await pollFetchData();

const table = useVueTable({
  get data() {
    return getSubmissionListResponse.value.rows;
  },
  get columns() {
    return columns;
  },
  getCoreRowModel: getCoreRowModel(),
});
</script>

<template>
  <div>
    <div class="space-y-4">
      <div
        class="flex justify-center border rounded-xl min-h-[400px]"
        :class="{ 'items-center': isError }"
      >
        <div
          v-if="!isSuccess"
          class="flex flex-col items-center justify-center"
        >
          <Spinner v-if="isLoading" :message="'加载中...'"></Spinner>
          <div class="flex flex-col items-center space-y-2" v-else>
            <CircleX class="size-10"></CircleX>
            <span>获取数据失败,请重试</span>
            <Button class="p-2" @click="fetchData()">重新加载</Button>
          </div>
        </div>

        <Table v-else>
          <TableHeader>
            <TableRow
              v-for="headerGroup in table.getHeaderGroups()"
              :key="headerGroup.id"
            >
              <TableHead v-for="header in headerGroup.headers" :key="header.id">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <template v-if="table.getRowModel().rows?.length">
              <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
            </template>
            <template v-else>
              <TableRow>
                <TableCell :colspan="columns.length" class="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </div>

      <div class="flex justify-end mb-4 px-4">
        <TablePagination
          v-model:page="page"
          v-model:size="size"
          :total="getSubmissionListResponse.total"
          @on-change-pagination="fetchData"
        ></TablePagination>
      </div>
    </div>
  </div>
</template>
