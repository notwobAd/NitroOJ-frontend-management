<script setup lang="ts">
import dayjs from 'dayjs';

const date = dayjs();
const logs = await useGetLogResponse({year: date.year(), month: date.month() + 1})
const fileName = ref(logs[0]?.fileName)
const logContent = ref("")

const fetchData = async () => {
  try {
    if (!fileName.value) return

    logContent.value = await useGetLogFile(fileName.value)
  } catch (error) {
    console.log(error)
  }
}

await fetchData()

const onDownload = () => {
    if (!fileName.value) return

    const fileURL = URL.createObjectURL(new Blob([ logContent.value ], {type: "text/x-log"}))
    const link = document.createElement('a')
    link.href = fileURL
    link.download = fileName.value
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(fileURL)
}
</script>

<template>
  <Card class=" border-none shadow-none">
    <CardHeader>
      <CardTitle class="text-2xl">查看日志</CardTitle>
    </CardHeader>

    <CardContent class="flex space-x-2">
      <Tabs class="shrink-0 rounded-md border p-2 overflow-scroll" v-model:model-value="fileName" orientation="vertical">
        <TabsList class="bg-transparent grid grid-cols-1">
          <TabsTrigger @click="fetchData" v-for="log in logs" :key="log.fileName" :value="log.fileName">
            {{log.fileName}}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div class="w-full">
      <MonacoEditor  v-model:value="logContent" :options="{readOnly: true}"></MonacoEditor>
      </div>
    </CardContent>

    <CardFooter class="justify-end">
      <div class="px-2">
        <Button @click="onDownload">下载日志</Button>
      </div>
    </CardFooter>
  </Card>
</template>
