<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { SquarePen } from "lucide-vue-next";
import { z } from "zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";

const route = useRoute();
if (typeof route.params.id !== "string" || isNaN(parseInt(route.params.id)))
  throw createError({
    statusCode: 404,
    statusText: `公告 #[${route.params.id}] 不存在`,
    fatal: true,
  });

const announcement = ref<GetAnnouncementResponse>({
  id: 0,
  title: "",
  content: "",
  createdAt: "",
  priority: 0,
});

try {
  announcement.value = await useGetAnnouncement(parseInt(route.params.id));
} catch (error: any) {
  throw createError({
    statusCode: error.statusCode,
    statusText: error.data.message,
    fatal: true,
  });
}

const modified = ref(false);

const formSchema = toTypedSchema(
  z.object({
    title: z
      .string({ error: "标题不能为空" })
      .min(1, { error: "标题最少需要1个字符" })
      .max(30, { error: "标题最多拥有30个字符" }),
    content: z
      .string({ error: "公告内容不能为空" })
      .min(1, { error: "公告最少需要1个字符" })
      .max(5000, { error: "公告最多拥有5000个字符" }),
    priority: z
      .int({ error: "请选择公告优先级" })
      .min(1, { error: "公告优先级最低为1" })
      .max(10, { error: "公告优先级最高为10" }),
  }),
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: announcement.value.title,
    content: announcement.value.content,
    priority: announcement.value.priority,
  },
});

const onSave = form.handleSubmit(async (value) => {
  try {
    await useUpdateAnnouncement(announcement.value.id, {
      title: value.title,
      content: value.content,
      priority: value.priority,
    });

    toast.success("修改公告成功", { closeButton: true });

    navigateTo("/announcements");
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <Card class="border-none shadow-none">
    <CardHeader class="flex justify-center items-center">
      <CardTitle class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <span class="text-2xl">#{{ announcement.id }}</span>
          <FormField name="title" v-slot="{ componentField }">
            <FormItem>
              <FormControl>
                <div class="relative max-w-100">
                  <Input
                    class="font-bold h-12 pr-10"
                    style="font-size: 20px"
                    type="text"
                    placeholder="在这里输入标题"
                    maxlength="30"
                    v-bind="componentField"
                    @change="modified = true"
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
        </div>

        <FormField name="priority" v-slot="{ componentField }">
          <FormItem class="flex items-center space-x-2">
            <Label class="text-base" for="priority">优先级:</Label>
            <FormControl>
              <Select id="priority" v-bind="componentField">
                <SelectTrigger class="w-20">
                  <SelectValue placeholder=""></SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem :value="priority" v-for="priority in 10">
                    {{ priority }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        </FormField>
      </CardTitle>
    </CardHeader>

    <CardContent class="space-y-4">
      <FormField name="content" v-slot="{ componentField }">
        <FormItem>
          <FormMessage></FormMessage>
          <FormControl>
            <MdEditor
              placeholder="在这里输入公告内容"
              v-bind="componentField"
              @on-change="modified = true"
            ></MdEditor>
          </FormControl>
        </FormItem>
      </FormField>
    </CardContent>

    <CardFooter class="flex justify-end">
      <div class="flex space-x-1">
        <Button class="mr-2" @click="onSave">保存</Button>
        <span class="align-top" v-if="modified">*</span>
      </div>
    </CardFooter>
  </Card>
</template>
