<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EllipsisVertical } from "lucide-vue-next";
import { toast } from "vue-sonner";

const { user } = defineProps<{ user: UserListRow }>();
const emit = defineEmits(["changeUser"]);

const onSwitchActive = async () => {
  try {
    await useUpdateUser(user.id, { isActive: !user.isActive });

    toast.success((user.isActive ? "封禁" : "解封") + `用户#${user.id}成功`, {
      closeButton: true,
    });

    emit("changeUser");
  } catch (error) {
    console.log(error);
  }
};

const onRemove = async () => {
  try {
    await useRemoveUser(user.id);

    toast.success(`删除用户#${user.id}成功`, { closeButton: true });

    emit("changeUser");
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <Dialog>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="icon" variant="ghost">
          <EllipsisVertical></EllipsisVertical>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DialogTrigger as-child>
          <DropdownMenuItem>
            <span>编辑</span>
          </DropdownMenuItem>
        </DialogTrigger>

        <DropdownMenuSeparator></DropdownMenuSeparator>

        <AlertDialog>
          <AlertDialogTrigger as-child>
            <DropdownMenuItem @select.prevent="" variant="destructive">
              <span>{{ user.isActive ? "封禁" : "解封" }}用户</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle
                >{{ user.isActive ? "封禁" : "解封" }}用户</AlertDialogTitle
              >
              <AlertDialogDescription
                >确定{{ user.isActive ? "封禁" : "解封" }}用户@{{
                  user.username
                }}吗?</AlertDialogDescription
              >
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction @click="onSwitchActive"
                >确认</AlertDialogAction
              >
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
              <AlertDialogTitle>删除用户</AlertDialogTitle>
              <AlertDialogDescription
                >确定删除用户 @{{ user.username }} 吗?
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

    <DialogContent>
      <DialogHeader>
        <DialogTitle>修改用户信息</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>

      <Tabs default-value="username">
        <TabsList>
          <TabsTrigger value="username">用户名</TabsTrigger>
          <TabsTrigger value="password">密码</TabsTrigger>
        </TabsList>

        <TabsContent value="username">
          <UsersUsernameForm
            :id="user.id"
            :username="user.username"
            @on-change-username="$emit('changeUser')"
          ></UsersUsernameForm>
        </TabsContent>

        <TabsContent value="password">
          <UsersPasswordForm
            :id="user.id"
            @on-change-password="$emit('changeUser')"
          ></UsersPasswordForm>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>
