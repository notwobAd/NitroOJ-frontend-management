<script setup lang="ts">
import { useTokensStore, type GetAdminUserProfileResponse } from "#imports";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, LogOut } from "lucide-vue-next";
import { toast } from "vue-sonner";

const adminUser = ref<GetAdminUserProfileResponse | null>(null);

try {
  adminUser.value = await useGetAdminUserProfile();
} catch (error) {
  console.log(error);
}

const tokensStore = useTokensStore();

const onLogout = async () => {
  try {
    await useLogout();

    toast.success("已退出登录");
    tokensStore.clear();
    navigateTo("/login");
  } catch (error) {
    tokensStore.clear();
    navigateTo("/login");
  }
};
</script>

<template>
  <div>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <SidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state]:text-sidebar-accent-foreground"
            >
              <div class="grid flex-1 text-left leading-tight">
                <span class="truncate">{{ adminUser?.username }}</span>
                <span class="truncate">{{
                  adminUser?.role === AdminUserRole.Superadmin
                    ? "超级管理员"
                    : "普通管理员"
                }}</span>
              </div>
              <ChevronsUpDown></ChevronsUpDown>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56">
            <DropdownMenuItem @click="onLogout">
              <LogOut></LogOut>
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  </div>
</template>
