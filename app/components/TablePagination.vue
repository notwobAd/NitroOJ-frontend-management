<script setup lang="ts">
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
} from "@/components/ui/pagination";
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-vue-next";

const emit = defineEmits(["onChangePagination"]);

const page = defineModel<number>("page", { default: 1 });
const size = defineModel<number>("size", { default: 10 });
const { total } = defineProps<{ total: number }>();
const sizeList = [10, 20, 50, 100];

const lastPage = computed(() => Math.ceil(total / size.value));
</script>

<template>
  <div class="flex items-center space-x-4">
    <div class="flex items-center space-x-1">
      <span>每页</span>
      <Select
        @update:model-value="
          ($event) => {
            size = $event as number;
            page = 1;
            $emit('onChangePagination');
          }
        "
        @update="((page = 1), $emit('onChangePagination'))"
        :model-value="size"
      >
        <SelectTrigger size="sm">
          <SelectValue></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="size in sizeList" :key="size" :value="size">{{
            size
          }}</SelectItem>
        </SelectContent>
      </Select>
      <span>条</span>
    </div>

    <span>共{{ total }}条数据</span>

    <span>第{{ page }}/{{ lastPage }}页</span>

    <div>
      <Pagination
        v-slot="{ page }"
        v-model:page="page"
        @update:page="
          (newPage) => {
            page = newPage;
            $emit('onChangePagination');
          }
        "
        :items-per-page="size"
        :total="total"
        :default-page="1"
        show-edges
      >
        <PaginationContent v-slot="{ items }">
          <PaginationFirst class="size-9 border">
            <ChevronsLeft></ChevronsLeft>
          </PaginationFirst>
          <PaginationPrevious class="size-9 border">
            <ChevronLeft></ChevronLeft>
          </PaginationPrevious>

          <template v-for="(item, index) in items" :key="index">
            <PaginationItem
              v-if="item.type === 'page'"
              :value="item.value"
              :is-active="item.value === page"
            >
              {{ item.value }}
            </PaginationItem>

            <PaginationEllipsis
              v-else
              :key="item.type"
              :index="index"
            ></PaginationEllipsis>
          </template>

          <PaginationNext class="size-9 border">
            <ChevronRight></ChevronRight>
          </PaginationNext>
          <PaginationLast class="size-9 border">
            <ChevronsRight></ChevronsRight>
          </PaginationLast>
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>
