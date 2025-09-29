<script setup lang="ts">
import { FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns } from "@/components/Submissions/extendedColumns";
import { CircleX, Search } from "lucide-vue-next";
import type { DateRange } from "reka-ui";

const isLoading = ref(true);
const isError = ref(false);
const isSuccess = computed(() => !(isLoading.value || isError.value));

const page = ref(1);
const size = ref(10);
const problemId = ref<number | string>("");
const userId = ref<number | string>("");
const status = ref<SubmissionStatus | "all">();
const dateRange = ref<DateRange>({
  start: undefined,
  end: undefined,
}) as Ref<DateRange>;

const onChangeProblemId = () => {
  if (typeof problemId.value === "number") {
    if (isNaN(problemId.value) || problemId.value < 1) problemId.value = 1;
    return;
  }
  if (problemId.value.length === 0) return;

  problemId.value = problemId.value.replace(/\D/g, "");
  problemId.value = parseInt(problemId.value);
  if (isNaN(problemId.value)) problemId.value = 1;
};
const onChangeUserId = () => {
  if (typeof userId.value === "number") {
    if (isNaN(userId.value) || userId.value < 1) userId.value = 1;
    return;
  }
  if (userId.value.length === 0) return;

  userId.value = userId.value.replace(/\D/g, "");
  userId.value = parseInt(userId.value);
  if (isNaN(userId.value)) userId.value = 1;
};
const getSubmissionListResponse = ref<GetSubmissionListResponse>({
  rows: [],
  total: 0,
});

const fetchData = async () => {
  try {
    isLoading.value = true;

    const query: GetSubmissionListRequest = {
      page: page.value,
      size: size.value,
      "create-begin": dateRange.value.start?.toString(),
      "create-end": dateRange.value.end?.toString(),
    };
    if (status.value !== "all") query.status = status.value;
    if (typeof userId.value === "number") query.user = userId.value;
    if (typeof problemId.value === "number") query.problem = problemId.value;

    getSubmissionListResponse.value = await useGetSubmissionList(query);
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

const onSearch = async () => {
  page.value = 1;
  await fetchData();
};

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
  <Card class="h-full w-full border-none shadow-none">
    <CardHeader class="text-2xl">提交记录管理</CardHeader>
    <CardContent class="space-y-4">
      <div class="flex space-x-2">
        <div class="relative items-center shrink-0">
          <Input
            id="search"
            type="text"
            v-model="problemId"
            @change="onChangeProblemId"
            placeholder="通过题目Id搜索"
            class="pl-10"
          ></Input>
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
          >
            <Search class="size-6 text-muted-foreground" />
          </span>
        </div>

        <div class="relative items-center shrink-0">
          <Input
            id="search"
            type="text"
            v-model="userId"
            @change="onChangeUserId"
            placeholder="通过用户Id搜索"
            class="pl-10"
          ></Input>
          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
          >
            <Search class="size-6 text-muted-foreground" />
          </span>
        </div>

        <DateRangePicker
          v-model:date-range="dateRange"
          :placeholder="'按创建日期范围搜索'"
        ></DateRangePicker>

        <Select v-model="status" default-value="all">
          <SelectTrigger>
            <SelectValue placeholder="测评状态"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="pending">等待中</SelectItem>
            <SelectItem value="compiling">编译中</SelectItem>
            <SelectItem value="judging">测评中</SelectItem>
            <SelectItem value="compile_error">编译错误</SelectItem>
            <SelectItem value="accepted">通过</SelectItem>
            <SelectItem value="unaccepted">未通过</SelectItem>
          </SelectContent>
        </Select>

        <Button @click="onSearch">
          <Search class="size-4"></Search>
          <span>搜索</span>
        </Button>
      </div>

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
                <TableHead
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                >
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
                  <TableCell
                    v-for="cell in row.getVisibleCells()"
                    :key="cell.id"
                  >
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
    </CardContent>
  </Card>
</template>
