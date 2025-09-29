import type { ColumnDef } from "@tanstack/vue-table";
import UserHoverCard from "../UserHoverCard.vue";
import { StatusBadge, SubmissionsActionMenu } from "#components";
import dayjs from "dayjs";

export const columns: ColumnDef<SubmissionListRow>[] = [
  {
    accessorKey: "id",
    header: () => h("div", "提交记录Id"),
    cell: ({ row }) => {
      const id = row.original.id;

      return h("div", { class: "font-medium" }, id);
    },
  },
  {
    accessorKey: "problem",
    header: () => h("div", "题目"),
    cell: ({ row }) => {
      const id = row.original.problem.id;
      const title = row.original.problem.title;

      return h("div", { class: "px-0", variant: "link" }, `#${id} ${title}`);
    },
  },
  {
    accessorKey: "user",
    header: () => h("div", "用户"),
    cell: ({ row }) => {
      const user = row.original.user;

      return h("div", { class: "font-medium" }, h(UserHoverCard, { user }));
    },
  },
  {
    accessorKey: "time",
    header: () => h("div", "运行时间"),
    cell: ({ row }) => {
      const time = row.original.time;

      return h(
        "div",
        { class: "font-medium" },
        time !== null ? time + "ms" : "-",
      );
    },
  },
  {
    accessorKey: "memory",
    header: () => h("div", "内存"),
    cell: ({ row }) => {
      const memory = row.original.memory;

      return h(
        "div",
        { class: "font-medium" },
        memory !== null ? memory + "kB" : "-",
      );
    },
  },
  {
    accessorKey: "status",
    header: () => h("div", "状态"),
    cell: ({ row }) => {
      const status = row.original.status;

      return h(StatusBadge, { status });
    },
  },
  {
    accessorKey: "createdAt",
    header: () => h("div", "提交时间"),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;

      return h(
        "div",
        { class: "font-medium" },
        dayjs(createdAt).format("YYYY-MM-DD hh:mm:ss"),
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const { id } = row.original;

      return h(SubmissionsActionMenu, { id });
    },
  },
];
