<script setup lang="ts">
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import { toTypedSchema } from "@vee-validate/zod";
import { SquarePen } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

const problem = ref<CreateProblemRequest>({
  title: "",
  content:
    "## 题目描述\n\n在这里补充题目描述\n\n## 输入描述\n\n在这里补充输入描述\n\n## 输出描述\n\n在这里补充输出描述\n\n## 输入样例1\n\n```\n在这里补充输入样例1数据\n```\n\n ## 输出样例1\n\n```\n在这里补充输出样例1数据\n```\n\n## 数据范围/说明\n\n在这里补充数据范围\n",
  memoryLimit: 10 * 1024,
  timeLimit: 200,
  level: 1,
  tags: [],
});

const modified = ref(false);

watch(problem, () => (modified.value = true), { deep: true });

const selectedProblemTags = ref<Tag[]>([]);
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

const formSchema = toTypedSchema(
  z.object({
    title: z
      .string({ error: "标题不能为空" })
      .min(1, { error: "标题长度必须大于等于1" })
      .max(20, { error: "标题长度必须小于等于20" }),
    content: z
      .string({ error: "题目内容不能为空" })
      .min(20, { error: "题目内容长度必须大于等于20" })
      .max(3000, { error: "题目内容长度必须小于等于3000" }),
    timeLimit: z
      .number({ error: "时间限制不能为空" })
      .min(200, { error: "时间限制必须大于等于200ms" })
      .max(3000, { error: "时间限制必须小于等于3000ms" }),
    memoryLimit: z
      .number({ error: "空间限制不能为空" })
      .min(16, { error: "空间限制必须大于等于16kB" })
      .max(262144, { error: "空间限制必须小于等于262144kB" }),
    level: z
      .number({ error: "难度不能为空" })
      .min(1, { error: "难度必须大于等于1" })
      .max(5, { error: "难度必须小于等于5" }),
  }),
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: "",
    content:
      "## 题目描述\n\n在这里补充题目描述\n\n## 输入描述\n\n在这里补充输入描述\n\n## 输出描述\n\n在这里补充输出描述\n\n## 输入样例1\n\n```\n在这里补充输入样例1数据\n```\n\n ## 输出样例1\n\n```\n在这里补充输出样例1数据\n```\n\n## 数据范围/说明\n\n在这里补充数据范围\n",
    memoryLimit: 10 * 1024,
    timeLimit: 200,
    level: 1,
  },
});

const onCreate = form.handleSubmit(async (value) => {
  try {
    await useCreateProblem({
      title: value.title,
      content: value.content,
      timeLimit: value.timeLimit,
      memoryLimit: value.memoryLimit,
      level: value.level,
      tags: selectedProblemTags.value.map(({ id }) => id),
    });

    toast.success(`添加题目 ${value.title} 成功`, { closeButton: true });
    navigateTo("/problems", { replace: true });
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <Card class="border-none shadow-none">
    <CardHeader class="flex flex-col items-center">
      <CardTitle class="flex items-center space-x-2">
        <FormField
          class="relative max-w-100 h-10"
          name="title"
          v-slot="{ componentField }"
        >
          <FormItem>
            <FormControl>
              <div class="relative max-w-100">
                <Input
                  class="font-bold h-12 pr-10"
                  style="font-size: 20px"
                  type="text"
                  placeholder="在这里编辑标题"
                  v-bind="componentField"
                  maxlength="20"
                ></Input>
                <span
                  class="absolute end-0 inset-y-0 flex items-center justify-center px-2"
                >
                  <SquarePen class="size-6 text-muted-foreground"></SquarePen>
                </span>
              </div>
            </FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        </FormField>
      </CardTitle>
    </CardHeader>

    <CardContent class="grid grid-cols-4 gap-4">
      <FormField name="content" v-slot="{ componentField }">
        <FormItem class="col-span-4 lg:col-span-3">
          <FormControl>
            <FormMessage></FormMessage>
            <MdEditor
              class="rounded-2xl"
              style="height: 1000px"
              v-bind="componentField"
              @on-save="onCreate"
            ></MdEditor>
          </FormControl>
        </FormItem>
      </FormField>

      <Card class="col-span-3 lg:col-span-1">
        <CardContent class="flex flex-col items-center space-y-4">
          <FormField name="timeLimit" v-slot="{ componentField }">
            <FormItem>
              <FormControl>
                <NumberField
                  class="flex flex-col items-center"
                  v-bind="componentField"
                  :min="200"
                  :max="3000"
                  locale=""
                >
                  <Label class="text-md" for="timeLimit">时间限制(ms)</Label>
                  <NumberFieldContent>
                    <NumberFieldDecrement></NumberFieldDecrement>
                    <NumberFieldInput id="timeLimit"></NumberFieldInput>
                    <NumberFieldIncrement></NumberFieldIncrement>
                  </NumberFieldContent>
                </NumberField>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          </FormField>

          <Separator></Separator>

          <FormField name="memoryLimit" v-slot="{ componentField }">
            <FormItem>
              <FormControl>
                <NumberField
                  class="flex flex-col items-center"
                  v-bind="componentField"
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
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          </FormField>

          <Separator></Separator>

          <FormField name="level" v-slot="{ componentField }">
            <FormItem>
              <FormControl>
                <NumberField
                  class="flex flex-col items-center"
                  v-bind="componentField"
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
                <FormMessage></FormMessage>
              </FormControl>
            </FormItem>
          </FormField>

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
        <Button @click="onCreate">添加</Button>
        <span class="align-top" v-if="modified">*</span>
      </div>
    </CardFooter>
  </Card>
</template>
