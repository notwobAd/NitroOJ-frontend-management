<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { SquarePen, Trash2, Plus, Search } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { z } from "zod";
import { toast } from "vue-sonner";

const problemTags = ref<ProblemTag[]>([]);
const search = ref("");

const fetchData = async () => {
  try {
    problemTags.value = await useGetProblemTagList({ search: search.value });
  } catch (error) {
    console.log(error);
  }
};

await fetchData();

const formSchema = toTypedSchema(
  z.object({
    name: z
      .string("标签名不能为空")
      .min(1, { error: "标签名最少需要1个字符" })
      .max(8, { error: "标签名最多拥有8个字符" })
      .regex(/^[a-zA-Z0-9\u4E00-\u9FFF]{1,8}/, {
        error: "标签名必须由数字英文及中文构成",
      }),
  }),
);

const form = useForm({ validationSchema: formSchema });
const selectedId = ref(0);
const selectedName = ref("");

const onClick = (id: number, name: string) => {
  selectedId.value = id;
  selectedName.value = name;
  form.setFieldValue("name", name);
};

const onSave = form.handleSubmit(async (value) => {
  try {
    await useUpdateProblemTag(selectedId.value, { name: value.name });

    const index = problemTags.value.findIndex(
      (problemTag) => problemTag.id == selectedId.value,
    );
    if (index != -1) problemTags.value[index]!.name = value.name;

    toast.success("修改标签成功", { closeButton: true });
  } catch (error) {
    console.log(error);
  }
});

const onRemove = async () => {
  try {
    await useRemoveProblemTag(selectedId.value);

    problemTags.value = problemTags.value.filter(
      (problemTag) => problemTag.id !== selectedId.value,
    );

    toast.success(
      `删除标签 #[${selectedId.value}] ${selectedName.value} 成功`,
      { closeButton: true },
    );
  } catch (error) {
    console.log(error);
  }
};

const onCreate = form.handleSubmit(async (value) => {
  try {
    const { id } = await useCreateProblemTag({ name: value.name });

    problemTags.value.push({ id, name: value.name });
    toast.success(`添加标签 ${value.name} 成功`, { closeButton: true });
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <Card class="border-none shadow-none">
    <CardHeader>
      <CardTitle class="text-2xl">标签管理</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="flex space-x-2">
        <div class="relative items-center">
          <Input
            class="pl-10"
            id="search"
            type="text"
            placeholder="通过标签名搜索"
            v-model="search"
          ></Input>

          <span
            class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
          >
            <Search class="size-6 text-muted-foreground" />
          </span>
        </div>

        <Button @click="fetchData">搜索</Button>
      </div>

      <div class="w-full flex flex-wrap gap-4 border rounded-2xl p-4">
        <Badge
          class="p-2"
          v-for="problemTag in problemTags"
          :key="problemTag.id"
        >
          <span class="text-sm"
            >#{{ problemTag.id }} {{ problemTag.name }}</span
          >

          <Dialog>
            <DialogTrigger as-child>
              <Button
                class="size-5"
                variant="ghost"
                @click="onClick(problemTag.id, problemTag.name)"
              >
                <SquarePen class="size-4"></SquarePen>
              </Button>
            </DialogTrigger>

            <DialogContent class="w-100">
              <DialogHeader>
                <DialogTitle>编辑标签</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>

              <form>
                <FormField name="name" v-slot="{ componentField }">
                  <FormItem>
                    <FormLabel for="name">标签名</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        type="text"
                        v-bind="componentField"
                        maxlength="8"
                      ></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                </FormField>
              </form>

              <DialogFooter>
                <DialogClose as-child>
                  <Button @click="onSave">保存</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button
                class="size-5"
                variant="ghost"
                @click="onClick(problemTag.id, problemTag.name)"
              >
                <Trash2 class="size-4 text-destructive-foreground"></Trash2>
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent class="w-100">
              <AlertDialogHeader>
                <AlertDialogTitle>删除标签</AlertDialogTitle>
                <AlertDialogDescription
                  >确认删除标签吗?删除后不可恢复</AlertDialogDescription
                >
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction @click="onRemove">确认</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Badge>

        <Dialog>
          <DialogTrigger as-child>
            <Button>
              <Plus></Plus>
              添加标签
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加标签</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <form>
              <FormField name="name" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel for="name">标签名</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      type="text"
                      v-bind="componentField"
                      maxlength="8"
                    ></Input>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              </FormField>
            </form>

            <DialogFooter>
              <DialogClose as-child>
                <Button @click="onCreate">添加</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CardContent>
  </Card>
</template>
