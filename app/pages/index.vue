<script setup lang="ts"></script>

<template>
  <div class="h-screen w-full">
    <SidebarProvider>
      <AppSideBar></AppSideBar>
      <SidebarInset>
        <header class="flex items-center justify-between p-2">
          <div class="flex items-center">
            <SidebarTrigger></SidebarTrigger>
          </div>
          <div class="flex items-center">
            <ModeSwitch></ModeSwitch>
          </div>
        </header>
        <Separator></Separator>
        <main>
          <NuxtPage />
        </main>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>
