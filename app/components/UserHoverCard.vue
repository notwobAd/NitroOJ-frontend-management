<script setup lang="ts">
import dayjs from "dayjs";
const { user } = defineProps<{
  user: User;
}>();

const { apiBase } = useRuntimeConfig().public;
</script>

<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <Button class="px-0" variant="link">
        {{ `#${user.id} ${user.username}` }}
      </Button>
    </HoverCardTrigger>

    <HoverCardContent class="w-full">
      <div class="flex justify-between items-center space-x-4">
        <Avatar class="size-12">
          <AvatarImage :src="`${apiBase}/users/${user.id}/avatar`" />
          <AvatarFallback>@{{ user.username }}</AvatarFallback>
        </Avatar>
        <div class="space-y-1">
          <h4 class="text-md font-semibold">@{{ user.username }}</h4>
          <div class="text-sm flex flex-col">
            <span> 邮箱: {{ user.email }} </span>
            <span>
              个人简介: {{ user.description ?? "这个人很懒,什么都没有写" }}
            </span>

            <span>
              注册时间: {{ dayjs(user.createdAt).format("YYYY-MM-DD") }}
            </span>
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>
