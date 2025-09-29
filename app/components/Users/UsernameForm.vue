<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

const { id, username } = defineProps<{ id: number; username: string }>();

const formSchema = toTypedSchema(
  z.object({
    currentUsername: z.string(),
    newUsername: z
      .string({ error: "用户名不能为空" })
      .min(5, { error: "用户名长度必须大于等于5" })
      .max(10, { error: "用户名长度必须小于等于10" })
      .regex(/^[a-zA-Z0-9]{5,10}$/, {
        error: "用户名必须由数字和大小写字母组成",
      }),
  }),
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: { currentUsername: username },
});

const emit = defineEmits(["onChangeUsername"]);

const onSubmit = form.handleSubmit(async (value) => {
  try {
    await useUpdateUser(id, { username: value.newUsername });

    toast.success("修改用户名成功", { closeButton: true });
    emit("onChangeUsername");
  } catch (error) {
    console.log(error);
  } finally {
    form.resetField("newUsername");
  }
});
</script>

<template>
  <div class="space-y-4">
    <form class="grid gap-4">
      <FormField name="currentUsername" v-slot="{ componentField }">
        <FormItem>
          <FormLabel for="currentUsername">当前用户名</FormLabel>
          <FormControl>
            <Input
              type="text"
              id="currentUsername"
              v-bind="componentField"
              disabled
            ></Input>
          </FormControl>
          <FormMessage> </FormMessage>
        </FormItem>
      </FormField>
      <FormField name="newUsername" v-slot="{ componentField }">
        <FormItem>
          <FormLabel for="newUsername">新用户名</FormLabel>
          <FormControl>
            <Input
              type="text"
              id="newUsername"
              placeholder="请输入新用户名"
              v-bind="componentField"
            ></Input>
          </FormControl>
          <FormMessage> </FormMessage>
        </FormItem>
      </FormField>
    </form>
    <div class="w-full flex justify-end">
      <Button @click="onSubmit">保存</Button>
    </div>
  </div>
</template>
