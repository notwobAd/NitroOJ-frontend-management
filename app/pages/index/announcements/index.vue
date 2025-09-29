<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  type ColumnDef,
} from "@tanstack/vue-table";
import dayjs from "dayjs";
import { CircleX, Plus } from "lucide-vue-next";
import { AnnouncementsActionMenu } from "#components";

const isLoading = ref(true);
const isError = ref(false);
const isSuccess = computed(() => !(isLoading.value || isError.value));

const page = ref(1);
const size = ref(10);
const getAnnouncementListResponse = ref<GetAnnouncementListResponse>({
  rows: [],
  total: 0,
});

const fetchData = async () => {
  try {
    isLoading.value = true;

    getAnnouncementListResponse.value = await useGetAnnouncementList(
      page.value,
      size.value,
    );
  } catch (error) {
    console.log(error);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

await fetchData();

const columns: ColumnDef<AnnouncementListRow>[] = [
  {
    accessorKey: "id",
    header: () => h("div", "公告Id"),
    cell: ({ row }) => {
      const id = row.original.id;

      return h("div", { class: "font-medium" }, id);
    },
  },
  {
    accessorKey: "title",
    header: () => h("div", "标题"),
    cell: ({ row }) => {
      const title = row.original.title;

      return h("div", { class: "font-medium" }, title);
    },
  },
  {
    accessorKey: "createdAt",
    header: () => h("div", "发布时间"),
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
    id: "action",
    cell: ({ row }) => {
      const { id, title } = row.original;

      return h(AnnouncementsActionMenu, { id, title });
    },
  },
];

const table = useVueTable({
  get data() {
    return getAnnouncementListResponse.value.rows;
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
      <CardTitle class="text-2xl">公告管理</CardTitle>
    </CardHeader>

    <CardContent class="space-y-4">
      <div>
        <Button @click="$router.push('/announcements/add')">
          <Plus></Plus>
          添加公告
        </Button>
      </div>

      <div
        class="flex justify-center border rounded-xl"
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
          :total="getAnnouncementListResponse.total"
          @on-change-pagination="fetchData"
        ></TablePagination>
      </div>
    </CardContent>
  </Card>
</template>
