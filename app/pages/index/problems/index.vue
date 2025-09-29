<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  type ColumnDef,
} from "@tanstack/vue-table";
import type { DateRange } from "reka-ui";
import { ProblemsTagBadges, ProblemsActionMenu, RateSteper } from "#components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import dayjs from "dayjs";
import { CircleX, Search, Plus } from "lucide-vue-next";

const isLoading = ref(true);
const isError = ref(false);
const isSuccess = computed(() => !(isLoading.value || isError.value));

const page = ref(1);
const size = ref(10);
const getProblemListResponse = ref<GetProblemListResponse>({
  rows: [],
  total: 0,
});

const search = ref<string>();
const id = ref<number | string>("");
const active = ref<"all" | "true" | "false">();
const levelRange = ref([1, 5]);
const dateRange = ref<DateRange>({
  start: undefined,
  end: undefined,
}) as Ref<DateRange>;

const onChangeId = () => {
  if (typeof id.value === "number") {
    if (isNaN(id.value) || id.value < 1) id.value = 1;
    return;
  }
  if (id.value.length === 0) return;

  id.value = id.value.replace(/\D/g, "");
  id.value = parseInt(id.value);
  if (isNaN(id.value)) id.value = 1;
};

const fetchData = async () => {
  try {
    isLoading.value = true;

    const query: GetProblemListRequest = {
      page: page.value,
      size: size.value,
      search: search.value,
      "min-level": levelRange.value[0],
      "max-level": levelRange.value[1],
      "create-begin": dateRange.value.start?.toString(),
      "create-end": dateRange.value.end?.toString(),
    };
    if (active.value === "true") query.active = true;
    else if (active.value === "false") query.active = false;
    if (typeof id.value === "number") query.id = id.value;

    getProblemListResponse.value = await useGetProblemList(query);
  } catch (error) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

await fetchData();

const onSearch = async () => {
  page.value = 1;
  await fetchData();
};

const columns: ColumnDef<ProblemListRow>[] = [
  {
    accessorKey: "id",
    header: () => h("div", { class: "font-medium" }, "题目Id"),
    cell: ({ row }) => {
      const id = row.original.id;

      return h("div", { class: "font-medium" }, id);
    },
  },
  {
    accessorKey: "title",
    header: () => h("div", { class: "font-medium" }, "标题"),
    cell: ({ row }) => {
      const title = row.original.title;

      return h("div", { class: "font-medium" }, title);
    },
  },
  {
    accessorKey: "tags",
    header: () => h("div", { class: "font-medium" }, "标签"),
    cell: ({ row }) => {
      const tags = row.original.tags;

      return h(ProblemsTagBadges, { tags });
    },
  },
  {
    accessorKey: "level",
    header: () => h("div", { class: "font-medium" }, "难度"),
    cell: ({ row }) => {
      const level = row.original.level;

      return h(RateSteper, { level, max: 5 });
    },
  },
  {
    accessorKey: "timeLimit",
    header: () => h("div", { class: "font-medium" }, "时间限制"),
    cell: ({ row }) => {
      const timelimit = row.original.timeLimit;

      return h("div", { class: "font-medium" }, timelimit + "ms");
    },
  },
  {
    accessorKey: "memoryLimit",
    header: () => h("div", { class: "font-medium" }, "内存限制"),
    cell: ({ row }) => {
      const memoryLimit = row.original.memoryLimit;

      return h("div", { class: "font-medium" }, memoryLimit + "kB");
    },
  },
  {
    accessorKey: "createdAt",
    header: () => h("div", { class: "font-medium" }, "创建时间"),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;

      return h(
        "div",
        { class: "font-medium" },
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss"),
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => h("div", { class: "font-medium" }, "是否启用"),
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return h(
        "div",
        { class: "flex items-center font-medium" },
        h(Checkbox, { class: "ml-5.5", modelValue: isActive }),
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const { id, isActive, title } = row.original;

      return h(ProblemsActionMenu, {
        id,
        isActive,
        title,
        onChangeProblem: fetchData,
      });
    },
  },
];

const table = useVueTable({
  get data() {
    return getProblemListResponse.value.rows;
  },
  get columns() {
    return columns;
  },
  getCoreRowModel: getCoreRowModel(),
});
</script>

<template>
  <Card class="border-none shadow-none">
    <CardHeader>
      <CardTitle class="text-2xl">题目管理</CardTitle>
    </CardHeader>

    <CardContent class="space-y-4 w-full">
      <div class="flex justify-between items">
        <div class="flex items-center space-x-2">
          <div class="relative items-center shrink-0">
            <Input
              id="search"
              type="text"
              v-model="search"
              placeholder="通过题目标题搜索"
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
              v-model="id"
              @change="onChangeId"
              placeholder="通过题目Id搜索"
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

          <Select v-model="active">
            <SelectTrigger>
              <SelectValue placeholder="是否启用"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="true">启用</SelectItem>
              <SelectItem value="false">未启用</SelectItem>
            </SelectContent>
          </Select>

          <div class="flex items-center space-x-1">
            <span>难度:</span>
            <div class="mt-2 space-y-1">
              <Slider
                class="w-40"
                v-model="levelRange"
                :default-value="[1, 5]"
                :min="1"
                :max="5"
                :step="1"
              ></Slider>
              <div class="w-full flex justify-between">
                <span>最低:{{ levelRange[0] }}</span>
                <span>最高:{{ levelRange[1] }}</span>
              </div>
            </div>
          </div>

          <Button @click="onSearch">
            <Search class="size-4"></Search>
            <span>搜索</span>
          </Button>
        </div>

        <Button @click="$router.push('/problems/add')">
          <Plus></Plus>
          添加题目
        </Button>
      </div>

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
            <Button class="p-2" @click="fetchData">重新加载</Button>
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
          :total="getProblemListResponse.total"
          @on-change-pagination="fetchData"
        ></TablePagination>
      </div>
    </CardContent>
  </Card>
</template>
