<script setup lang="ts">
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import { SquarePen } from "lucide-vue-next";
import { toast } from "vue-sonner";

const route = useRoute();
if (typeof route.params.id !== "string" || isNaN(parseInt(route.params.id)))
  throw createError({
    statusCode: 404,
    statusText: `题目# [${route.params.id}] 不存在`,
    fatal: true,
  });

const problem = ref<GetProblemResponse>({
  content: "",
  createdAt: "",
  id: 0,
  isActive: false,
  level: 1,
  memoryLimit: 0,
  timeLimit: 0,
  tags: [],
  title: "",
});

try {
  problem.value = await useGetProblem(parseInt(route.params.id));
} catch (error: any) {
  throw createError({
    statusCode: error.statusCode,
    statusText: error.data.message,
    fatal: true,
  });
}
const modified = ref(false);

const selectedProblemTags = ref(problem.value.tags);
const search = ref("");
const problemTagList = ref<ProblemTag[]>([]);
const problemTagOptions = computed(() =>
  problemTagList.value.filter(
    (problemTag) =>
      !selectedProblemTags.value.some(({ id }) => id === problemTag.id),
  ),
);
const open = ref(false);

watch(search, async () => {
  problemTagList.value = await useGetProblemTagList({ search: search.value });
});

const onSave = async () => {
  try {
    await useUpdateProblem(problem.value.id, {
      title: problem.value.title,
      content: problem.value.content,
      level: problem.value.level,
      memoryLimit: problem.value.memoryLimit,
      timeLimit: problem.value.timeLimit,
      tags: selectedProblemTags.value.map(({ id }) => id),
    });

    toast.success("修改题目成功", { closeButton: true });

    navigateTo("/problems", { replace: true });
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <Card class="border-none shadow-none">
    <CardHeader class="flex flex-col items-center">
      <CardTitle class="flex items-center space-x-2">
        <span class="text-2xl">#{{ problem.id }}</span>
        <div class="relative max-w-100">
          <Input
            class="font-bold h-12 pr-10"
            style="font-size: 20px"
            id="title"
            type="text"
            placeholder="在这里输入标题"
            v-model="problem.title"
            maxlength="20"
          ></Input>
          <span
            class="absolute end-0 inset-y-0 flex items-center justify-center px-2"
          >
            <SquarePen class="size-6 text-muted-foreground"></SquarePen>
          </span>
        </div>
      </CardTitle>
    </CardHeader>

    <CardContent class="grid grid-cols-4 gap-4">
      <MdEditor
        class="col-span-4 lg:col-span-3 rounded-2xl"
        style="height: 1000px"
        v-model="problem.content"
        @on-change="modified = true"
      ></MdEditor>

      <Card class="col-span-3 lg:col-span-1">
        <CardContent class="flex flex-col items-center space-y-4">
          <NumberField
            class="flex flex-col items-center"
            v-model="problem.timeLimit"
            :min="200"
            :max="3000"
          >
            <Label class="text-md" for="timeLimit">时间限制(ms)</Label>
            <NumberFieldContent>
              <NumberFieldDecrement></NumberFieldDecrement>
              <NumberFieldInput id="timeLimit"></NumberFieldInput>
              <NumberFieldIncrement></NumberFieldIncrement>
            </NumberFieldContent>
          </NumberField>

          <Separator></Separator>

          <NumberField
            class="flex flex-col items-center"
            v-model="problem.memoryLimit"
            :min="16"
            :max="262144"
          >
            <Label class="text-md" for="memoryLimit">内存限制(kB)</Label>
            <NumberFieldContent>
              <NumberFieldDecrement></NumberFieldDecrement>
              <NumberFieldInput id="memoryLimit"></NumberFieldInput>
              <NumberFieldIncrement></NumberFieldIncrement>
            </NumberFieldContent>
          </NumberField>

          <Separator></Separator>

          <NumberField
            class="flex flex-col items-center"
            v-model="problem.level"
            :min="1"
            :max="5"
          >
            <Label class="text-md" for="level">难度</Label>
            <NumberFieldContent>
              <NumberFieldDecrement></NumberFieldDecrement>
              <NumberFieldInput id="level"></NumberFieldInput>
              <NumberFieldIncrement></NumberFieldIncrement>
            </NumberFieldContent>
          </NumberField>

          <Separator></Separator>

          <Combobox
            v-model="selectedProblemTags"
            v-model:open="open"
            :ignore-filter="true"
          >
            <ComboboxAnchor as-child>
              <TagsInput
                v-model="selectedProblemTags"
                class="flex flex-col items-start px-2 gap-2 w-80"
              >
                <div
                  v-if="selectedProblemTags.length"
                  class="flex gap-2 flex-wrap items-center"
                >
                  <TagsInputItem
                    v-for="problemTag in selectedProblemTags"
                    :key="problemTag.name"
                    :value="problemTag"
                  >
                    <span class="py-0.5 px-2 text-sm rounded bg-transparent">
                      {{ problemTag.name }}</span
                    >
                    <TagsInputItemDelete class="hover:cursor-pointer" />
                  </TagsInputItem>
                </div>

                <ComboboxInput v-model="search" as-child>
                  <TagsInputInput
                    placeholder="通过搜索添加标签"
                    class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                    @keydown.enter.prevent
                  />
                </ComboboxInput>
              </TagsInput>

              <ComboboxList v-if="search.length" class="overflow-scroll w-80">
                <ComboboxEmpty>搜索标签为空</ComboboxEmpty>
                <ComboboxGroup>
                  <ComboboxItem
                    v-for="problemTag in problemTagOptions"
                    :key="problemTag.id"
                    :value="problemTag"
                    @select.prevent="
                      ($event) => {
                        if (typeof $event.detail.value === 'object') {
                          search = '';
                          open = false;
                          const { id, name } = $event.detail
                            .value as ProblemTag;
                          selectedProblemTags.push({ id, name });
                        }

                        if (problemTagOptions.length === 0) {
                          open = false;
                        }
                      }
                    "
                  >
                    {{ problemTag.name }}
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxAnchor>
          </Combobox>
        </CardContent>
      </Card>
    </CardContent>

    <CardFooter class="flex justify-end">
      <div class="space-x-1 mr-2">
        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button variant="destructive">退出而不保存</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>退出而不保存吗?</AlertDialogTitle>
              <AlertDialogDescription></AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction @click="$router.replace('/problems')"
                >确认</AlertDialogAction
              >
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button :disabled="!modified" @click="onSave">保存</Button>
        <span class="align-top" v-if="modified">*</span>
      </div>
    </CardFooter>
  </Card>
</template>
