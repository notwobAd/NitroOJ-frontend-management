<script setup lang="ts">
import { strFromU8 } from "fflate/browser";
import { Plus } from "lucide-vue-next";
import { Textarea } from "@/components/ui/textarea";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const route = useRoute();
if (typeof route.params.id !== "string" || isNaN(parseInt(route.params.id)))
  throw createError({
    statusCode: 404,
    statusText: `题目#${route.params.id}不存在`,
    fatal: true,
  });

const judgePoints = ref<GetProblemJudgePointsResponse[]>([]);
const selectedId = ref(0);
const input = ref("");
const output = ref("");

const formSchema = toTypedSchema(
  z.object({
    description: z
      .string({ error: "测试点描述不能为空" })
      .min(1, { error: "测试点描述最少需要1个字符" })
      .max(20, { error: "测试点描述最多拥有20个字符" })
      .optional()
      .nullable(),
  }),
);

const form = useForm({ validationSchema: formSchema });

const fetchFile = async (id: number) => {
  const [inputBlob, outputBlob] = await Promise.all([
    useGetJudgePointInputFile(id),
    useGetJudgePointOutputFile(id),
  ]);

  const [inputGzip, outputGzip] = await Promise.all([
    inputBlob.arrayBuffer(),
    outputBlob.arrayBuffer(),
  ]);

  const [inputDecompress, outputDecompress] = await Promise.all([
    useDecompress(new Uint8Array(inputGzip)),
    useDecompress(new Uint8Array(outputGzip)),
  ]);
  input.value = strFromU8(inputDecompress);
  output.value = strFromU8(outputDecompress);

  selectedId.value = id;
};

try {
  judgePoints.value = await useGetProblemJudgePoints(parseInt(route.params.id));

  if (judgePoints.value.length) {
    selectedId.value = judgePoints.value[0]!.id;
    const index = judgePoints.value.findIndex(
      (judgePoint) => judgePoint.id === selectedId.value,
    );
    form.setFieldValue("description", judgePoints.value[index]?.description);
    await fetchFile(selectedId.value);
  } else selectedId.value = 0;
} catch (error: any) {
  console.log(error);
  throw createError({
    statusCode: error.statusCode,
    statusText: error.data.message,
    fatal: true,
  });
}

const onClick = async (id: number) => {
  await fetchFile(id);
  const index = judgePoints.value.findIndex(
    (judgePoint) => judgePoint.id === id,
  );
  form.setFieldValue("description", judgePoints.value[index]?.description);
};

const onAdd = () => {
  selectedId.value = 0;
  input.value = "";
  output.value = "";
  form.setFieldValue("description", undefined);
};

const onCreate = form.handleSubmit(async (value) => {
  try {
    const description = value.description ? value.description : undefined;

    const id = parseInt(route.params.id as string);
    const createJudgePointResponse = await useCreateJudgePoint(
      id,
      input.value,
      output.value,
      description,
    );

    judgePoints.value.push({
      id: createJudgePointResponse.id,
      description: value.description ? value.description : null,
    });

    toast.success(`添加测试点 #${createJudgePointResponse.id} 成功`, {
      closeButton: true,
    });
  } catch (error) {
    console.log(error);
  }
});

const onSave = form.handleSubmit(async (value) => {
  try {
    const description = value.description ? value.description : undefined;

    await useUpdateJudgePoint(
      selectedId.value,
      input.value,
      output.value,
      description,
    );

    const index = judgePoints.value.findIndex(
      (judgePoint) => judgePoint.id === selectedId.value,
    );
    if (index !== -1)
      judgePoints.value[index]!.description = value.description
        ? value.description
        : null;

    toast.success(`修改测试点 #${selectedId.value} 成功`, {
      closeButton: true,
    });
  } catch (error) {
    console.log(error);
  }
});

const onRemove = async () => {
  try {
    await useRemoveJudgePoint(selectedId.value);

    judgePoints.value = judgePoints.value.filter(
      (judgePoint) => judgePoint.id !== selectedId.value,
    );
    selectedId.value = judgePoints.value.length ? judgePoints.value[0]!.id : 0;

    toast.success(`删除测试点 #${selectedId.value} 成功`, {
      closeButton: true,
    });
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div class="h-screen w-full border-none shadow-none p-6">
    <Card>
      <CardContent class="flex space-x-2 p-2">
        <div
          class="flex-none flex flex-col space-y-2 p-2 border rounded-md overflow-y-scroll"
        >
          <Button
            class="size-12"
            :variant="selectedId === 0 ? 'default' : 'outline'"
            @click="onAdd"
          >
            <Plus></Plus>
          </Button>
          <Button
            class="size-12"
            v-for="judgePoint in judgePoints"
            :key="judgePoint.id"
            :variant="judgePoint.id === selectedId ? 'default' : 'outline'"
            @click="onClick(judgePoint.id)"
          >
            {{ judgePoint.id }}
          </Button>
        </div>

        <div class="flex-2 space-y-4">
          <FormField name="description" v-slot="{ componentField }">
            <FormItem class="w-80">
              <FormLabel class="text-xl" for="description"
                >测试点描述</FormLabel
              >
              <FormControl>
                <Textarea
                  class="max-h-20"
                  id="description"
                  maxlength="20"
                  v-bind="componentField"
                ></Textarea>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          </FormField>

          <div class="flex-2 flex space-x-2">
            <div class="flex-1 space-y-2">
              <Label class="text-xl">输入文件内容</Label>
              <MonacoEditor v-model:value="input"></MonacoEditor>
            </div>

            <Separator orientation="vertical"></Separator>

            <div class="flex-1 space-y-2">
              <Label class="text-xl">输出文件内容</Label>
              <MonacoEditor v-model:value="output"></MonacoEditor>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter class="flex justify-end space-x-2">
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive" v-if="selectedId !== 0">删除</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>删除测试点</AlertDialogTitle>
              <AlertDialogDescription
                >确定删除测试点?删除后不可恢复</AlertDialogDescription
              >
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction @click="onRemove">确认</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button v-if="selectedId === 0" @click="onCreate">
          保存为新测试点
        </Button>
        <Button v-else @click="onSave"> 保存 </Button>
      </CardFooter>
    </Card>
  </div>
</template>
