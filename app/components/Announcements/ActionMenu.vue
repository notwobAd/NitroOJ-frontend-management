<script setup lang="ts">
import { EllipsisVertical } from "lucide-vue-next";
import { toast } from "vue-sonner";

const { id, title } = defineProps<{ id: number; title: string }>();

const onRemove = async () => {
  try {
    await useRemoveAnnouncement(id);

    toast.success(`删除公告 #[${id}] ${title} 成功`);

    reloadNuxtApp({ force: true, ttl: 0 });
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <AlertDialog>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button size="icon" variant="ghost">
          <EllipsisVertical></EllipsisVertical>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem @click="$router.push(`/announcements/${id}`)">
          <span>编辑</span>
        </DropdownMenuItem>

        <AlertDialogTrigger as-child>
          <DropdownMenuItem variant="destructive">
            <span>删除</span>
          </DropdownMenuItem>
        </AlertDialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>删除公告</AlertDialogTitle>
        <AlertDialogDescription
          >确定删除公告{{
            ` #[${id}] ${title} `
          }}吗?删除后不可恢复</AlertDialogDescription
        >
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction @click="onRemove">确认</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
