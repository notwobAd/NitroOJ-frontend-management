<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  type ColumnDef,
} from "@tanstack/vue-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { UsersActionMenu } from "#components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { CircleX, Search } from "lucide-vue-next";
import { type DateRange } from "reka-ui";

const isLoading = ref(true);
const isError = ref(false);
const isSuccess = computed(() => !(isLoading.value || isError.value));

const page = ref(1);
const size = ref(10);
const getUserListResponse = ref<GetUserListResponse>({ rows: [], total: 0 });

const search = ref<string>();
const id = ref<number | string>("");
const active = ref<"all" | "true" | "false">();
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

    const query: GetUserListRequest = {
      page: page.value,
      size: size.value,
      search: search.value,
      "create-begin": dateRange.value.start?.toString(),
      "create-end": dateRange.value.end?.toString(),
    };
    if (active.value === "true") query.active = true;
    else if (active.value === "false") query.active = false;
    if (typeof id.value === "number") query.id = id.value;

    getUserListResponse.value = await useGetUserList(query);
  } catch (error) {
    console.log(error);
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

const columns: ColumnDef<UserListRow>[] = [
  {
    accessorKey: "id",
    header: () => h("div", "用户Id"),
    cell: ({ row }) => {
      const id = row.original.id;

      return h("div", { class: "font-medium" }, id);
    },
  },
  {
    accessorKey: "username",
    header: () => h("div", "用户"),
    cell: ({ row }) => {
      const { username, id } = row.original;
      const { apiBase } = useRuntimeConfig().public;

      return h("div", { class: "flex items-center space-x-2" }, [
        h(Avatar, { class: "size-12" }, () => [
          h(AvatarImage, { src: `${apiBase}/users/${id}/avatar` }),
          h(AvatarFallback, () => `@${username}`),
        ]),
        h("span", username),
      ]);
    },
  },
  {
    accessorKey: "description",
    header: () => h("div", "个人简介"),
    cell: ({ row }) => {
      const description = row.original.description;

      return h(
        "div",
        { class: "font-medium" },
        description ?? "这个人很懒,什么都没有写",
      );
    },
  },
  {
    accessorKey: "email",
    header: () => h("div", "邮箱"),
    cell: ({ row }) => {
      const email = row.original.email;

      return h("div", { class: "font-medium" }, email);
    },
  },
  {
    accessorKey: "createdAt",
    header: () => h("div", "注册时间"),
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
    header: () => h("div", "封禁中"),
    cell: ({ row }) => {
      const isBanned = !row.original.isActive;

      return h(
        "div",
        { class: "flex items-center font-medium" },
        h(Checkbox, { class: "ml-3", modelValue: isBanned }),
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const user = row.original;

      return h(UsersActionMenu, { user, onChangeUser: fetchData });
    },
  },
];

const table = useVueTable({
  get data() {
    return getUserListResponse.value.rows;
  },
  get columns() {
    return columns;
  },
  getCoreRowModel: getCoreRowModel(),
});
</script>

<template>
  <Card class="border-0 shadow-none">
    <CardHeader>
      <CardTitle class="text-2xl">用户管理</CardTitle>
    </CardHeader>

    <CardContent>
      <div class="space-y-4 w-full">
        <div class="flex items-center space-x-2">
          <div class="relative items-center">
            <Input
              id="search"
              type="text"
              v-model="search"
              placeholder="通过用户名或邮箱搜索"
              class="pl-10"
            ></Input>

            <span
              class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
            >
              <Search class="size-6 text-muted-foreground" />
            </span>
          </div>
          <div class="relative items-center">
            <Input
              id="search"
              type="text"
              v-model="id"
              @change="onChangeId"
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
            :placeholder="'按注册日期范围搜索'"
          ></DateRangePicker>

          <Select v-model="active">
            <SelectTrigger>
              <SelectValue placeholder="是否封禁"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="false">已封禁</SelectItem>
              <SelectItem value="true">未封禁</SelectItem>
            </SelectContent>
          </Select>

          <Button @click="onSearch">
            <Search class="size-4"></Search>
            <span>搜索</span>
          </Button>
        </div>

        <div
          class="flex justify-center border rounded-xl min-h-[700px]"
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
            :total="getUserListResponse.total"
            @on-change-pagination="fetchData"
          ></TablePagination>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
