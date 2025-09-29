<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { sha256 } from "js-sha256";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

const { id } = defineProps<{ id: number }>();

const formSchema = toTypedSchema(
  z
    .object({
      password: z
        .string({ error: "新密码不能为空" })
        .min(8, { error: "新密码长度必须大于等于8" })
        .max(16, { error: "新密码长度必须小于等于16" })
        .regex(
          /^[a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\-\_\+\=\[\]\{\}\:\;\>\<\?\|\~\,\.]{8,16}$/,
          { error: "新密码必须由数字、大小写字母及特殊字符组成" },
        ),
      confirmPassword: z.string({ error: "确认密码不能为空" }),
    })
    .refine((data) => data.confirmPassword === data.password, {
      error: "两次输入的密码不一致",
      path: ["confirmPassword"],
    }),
);

const form = useForm({
  validationSchema: formSchema,
});

const emit = defineEmits(["onChangePassword"]);

const onSubmit = form.handleSubmit(async (value) => {
  try {
    await useUpdateUser(id, { password: sha256(value.password) });

    toast.success("修改密码成功", { closeButton: true });
    emit("onChangePassword");
  } catch (error) {
    console.log(error);
  } finally {
    form.resetForm();
  }
});
</script>

<template>
  <div class="space-y-4">
    <form class="grid gap-4">
      <FormField name="password" v-slot="{ componentField }">
        <FormItem>
          <FormLabel for="password">新密码</FormLabel>
          <FormControl>
            <Input
              type="password"
              id="password"
              placeholder="请输入新密码"
              v-bind="componentField"
            ></Input>
          </FormControl>
          <FormMessage> </FormMessage>
        </FormItem>
      </FormField>
      <FormField name="confirmPassword" v-slot="{ componentField }">
        <FormItem>
          <FormLabel for="confirmPassword">确认密码</FormLabel>
          <FormControl>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="请再次输入新密码"
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
