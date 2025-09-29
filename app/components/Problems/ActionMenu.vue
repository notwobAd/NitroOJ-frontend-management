<script setup lang="ts">
import { EllipsisVertical } from "lucide-vue-next";
import { toast } from "vue-sonner";

const { id, isActive, title } = defineProps<{
  id: number;
  isActive: boolean;
  title: string;
}>();
const emit = defineEmits(["changeProblem"]);

const onSwitchActive = async () => {
  try {
    await useUpdateProblem(id, { isActive: !isActive });

    toast.success(
      (isActive ? "停用" : "启用") + `题目 #[${id}] ${title} 成功`,
      {
        closeButton: true,
      },
    );

    emit("changeProblem");
  } catch (error) {
    console.log(error);
  }
};

const onRemove = async () => {
  try {
    await useRemoveProblem(id);

    toast.success(`删除题目 #[${id}] ${title} 成功`, { closeButton: true });

    emit("changeProblem");
  } catch (error) {
    console.log(error);
  }
};

const onRejudge = async () => {
  try {
    await useRejudgeProblem(id);

    toast.success(`重判题目 ${title} 操作下发成功`, { closeButton: true });
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button size="icon" variant="ghost">
        <EllipsisVertical></EllipsisVertical>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="$router.push(`/problems/${id}`)">
        <span>编辑题目</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="$router.push(`/problems/${id}/judge-points`)">
        <span>编辑测试数据</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator> </DropdownMenuSeparator>

      <AlertDialog>
        <AlertDialogTrigger as-child>
          <DropdownMenuItem @select.prevent="" variant="destructive">
            <span>{{ isActive ? "停用" : "启用" }}题目</span>
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {{ isActive ? "停用" : "启用" }}题目
            </AlertDialogTitle>
            <AlertDialogDescription
              >确定{{ isActive ? "停用" : "启用" }}题目#{{
                id
              }}吗?</AlertDialogDescription
            >
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction @click="onSwitchActive">确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger as-child>
          <DropdownMenuItem @select.prevent="" variant="destructive">
            <span>重新判题</span>
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>重新判题</AlertDialogTitle>
            <AlertDialogDescription
              >确定重新判题吗?该操作可能需要较长时间</AlertDialogDescription
            >
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction @click="onRejudge">确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger as-child>
          <DropdownMenuItem @select.prevent="" variant="destructive">
            <span>删除</span>
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除题目</AlertDialogTitle>
            <AlertDialogDescription
              >确定删除题目 #[{{ id }}]
              {{ title }}
              吗?
              <br />
              请注意此操作不可逆,删除后不可恢复</AlertDialogDescription
            >
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction @click="onRemove">确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
