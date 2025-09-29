<script setup lang="ts">
import dayjs from "dayjs";

const { apiBase } = useRuntimeConfig().public;

const route = useRoute();
if (typeof route.params.id !== "string" || isNaN(parseInt(route.params.id)))
  throw createError({
    statusCode: 404,
    statusText: `提交记录# [${route.params.id}] 不存在`,
    fatal: true,
  });

const submission = ref<GetSubmissionResponse>({
  id: 0,
  time: 0,
  memory: 0,
  source: "",
  status: SubmissionStatus.Pending,
  createdAt: "",
  problem: {
    id: 0,
    title: "",
    createdAt: "",
  },
  results: [],
  runtimeInfo: {
    id: 0,
    info: "",
    createdAt: "",
  },
  compileInfo: {
    id: 0,
    info: "",
    createdAt: "",
  },
  user: {
    id: 0,
    username: "",
    email: "",
    description: "",
    createdAt: "",
    isActive: false,
  },
});

try {
  submission.value = await useGetSubmission(parseInt(route.params.id));
} catch (error: any) {
  throw createError({
    statusCode: error.statusCode,
    statusText: error?.data.message,
    fatal: true,
  });
}

const decodeSource = decodeURIComponent(atob(submission.value.source));

const pollFetchData = async () => {
  try {
    if (
      submission.value.status === SubmissionStatus.Accepted ||
      submission.value.status === SubmissionStatus.Unaccepted ||
      submission.value.status === SubmissionStatus.CompileError
    )
      return;

    submission.value = await useGetSubmission(
      parseInt(route.params.id as string),
    );
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout(() => {
      pollFetchData();
    }, 3000);
  }
};

await pollFetchData();
</script>

<template>
  <Card class="border-none shadow-none">
    <CardHeader class="text-2xl">测评状态</CardHeader>

    <CardContent class="flex justify-center space-x-4">
      <Tabs default-value="info">
        <TabsList class="w-[60vw]">
          <TabsTrigger class="text-base" value="info"> 测试点信息 </TabsTrigger>
          <TabsTrigger class="text-base" value="source"> 源代码 </TabsTrigger>
          <TabsTrigger class="text-base" value="compileInfo">
            编译信息
          </TabsTrigger>
          <TabsTrigger class="text-base" value="runtimeInfo">
            运行信息
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardContent class="w-full flex gap-4">
              <ResultBlock
                v-if="submission.status !== SubmissionStatus.CompileError"
                v-for="(result, index) in submission.results"
                :key="result.id"
                :result
                :index="index + 1"
              ></ResultBlock>
              <span v-else>暂无测试点信息</span>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="source">
          <Card class="p-2">
            <CardContent class="w-full p-0">
              <MonacoEditor
                class="h-[1000px]"
                :value="decodeSource"
                :language="'cpp'"
                :options="{ readOnly: true }"
              ></MonacoEditor>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compileInfo">
          <Card>
            <CardContent class="whitespace-pre-wrap">
              {{
                submission.compileInfo.info
                  ? submission.compileInfo.info
                  : "暂无编译信息"
              }}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="runtimeInfo">
          <Card>
            <CardContent class="whitespace-pre-wrap">
              {{
                submission.runtimeInfo.info
                  ? submission.runtimeInfo.info
                  : "暂无运行时信息"
              }}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent
          class="flex flex-col justify-center items-center space-y-8"
        >
          <HoverCard>
            <HoverCardTrigger>
              <Avatar class="size-16">
                <AvatarImage
                  :src="`${apiBase}/users/${submission.user.id}/avatar`"
                ></AvatarImage>
                <AvatarFallback>{{ submission.user.username }}</AvatarFallback>
              </Avatar>
            </HoverCardTrigger>

            <HoverCardContent class="space-y-1">
              <h4 class="text-md font-semibold">
                @{{ submission.user.username }}
              </h4>
              <div class="text-sm flex flex-col">
                <span> 邮箱: {{ submission.user.email }} </span>
                <span>
                  个人简介:
                  {{ submission.user.description ?? "这个人很懒,什么都没有写" }}
                </span>

                <span>
                  注册时间:
                  {{ dayjs(submission.user.createdAt).format("YYYY-MM-DD") }}
                </span>
              </div>
            </HoverCardContent>
          </HoverCard>
          <div class="flex flex-col justify-center">
            <span>提交记录: #[{{ submission.id }}]</span>
            <span
              >测评题目: #[{{ submission.problem.id }}]
              {{ submission.problem.title }}</span
            >
            <div class="flex items-center space-x-2">
              <span>测评结果:</span>
              <StatusBadge :status="submission.status"></StatusBadge>
            </div>
            <span>时间: {{ submission.time ? submission.time : "-" }} ms</span>
            <span
              >内存: {{ submission.memory ? submission.memory : "-" }} kB</span
            >
            <span
              >提交时间:
              {{
                dayjs(submission.createdAt).format("YYYY-MM-DD HH:mm:ss")
              }}</span
            >
          </div>
        </CardContent>
      </Card>
    </CardContent>
  </Card>
</template>
