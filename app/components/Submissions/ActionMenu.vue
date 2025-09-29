<script setup lang="ts">
import { EllipsisVertical } from "lucide-vue-next";
import { toast } from "vue-sonner";

const { id } = defineProps<{ id: number }>();

const onRejudge = async () => {
  try {
    await useRejudgeSubmission(id);

    toast.success(`重新测评提交记录 ${id} 操作下发成功`, { closeButton: true });

    reloadNuxtApp({ ttl: 0 });
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
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="$router.push(`/submissions/${id}`)">
          <span>查看详情</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator></DropdownMenuSeparator>

        <AlertDialogTrigger as-child>
          <DropdownMenuItem variant="destructive">
            <span>重新测评</span>
          </DropdownMenuItem>
        </AlertDialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>重新测评</AlertDialogTitle>
        <AlertDialogDescription
          >确定重新测评提交记录
          {{ `#[${id}]` }} 吗?此操作可能需要一定时间</AlertDialogDescription
        >
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction @click="onRejudge">确认</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
