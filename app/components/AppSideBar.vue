<script setup lang="ts">
import {
  Sidebar,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logs, Home, User, Book, Tags, File, Newspaper } from "lucide-vue-next";
import type { FunctionalComponent } from "vue";

type NaviItem = {
  title: string;
  icon: FunctionalComponent;
  url: string;
};

type GroupItem = {
  title: string;
  items: NaviItem[];
};

const list = ref<GroupItem[]>([
  {
    title: "系统管理",
    items: [
      { title: "主页", url: "/home", icon: Home },
      { title: "用户", url: "/users", icon: User },
      { title: "题目", url: "/problems", icon: Book },
      { title: "标签", url: "/problem-tags", icon: Tags },
      { title: "提交记录", url: "/submissions", icon: File },
      { title: "公告", url: "/announcements", icon: Newspaper },
    ],
  },
  {
    title: "系统日志",
    items: [{ title: "日志", url: "/logs", icon: Logs }],
  },
]);
</script>

<template>
  <div>
    <Sidebar>
      <SidebarContent>
        <SidebarGroup v-for="groupItem in list">
          <SidebarGroupLabel class="text-sm">
            {{ groupItem.title }}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="naviItem in groupItem.items">
                <SidebarMenuButton as-child>
                  <NuxtLink :href="naviItem.url">
                    <component :is="naviItem.icon" />
                    <span>{{ naviItem.title }}</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NaviUser></NaviUser>
      </SidebarFooter>
    </Sidebar>
  </div>
</template>
