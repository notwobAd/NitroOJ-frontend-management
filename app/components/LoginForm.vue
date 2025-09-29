<script setup lang="ts">
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";
import { useLogin } from "~/composables/useLogin";
import { useTokensStore } from "~/stores/useTokensStore";

const formSchema = toTypedSchema(
  z.object({
    username: z
      .string({ error: "用户名不能为空" })
      .min(5, { error: "用户名长度必须大于等于5" })
      .max(10, { error: "用户名长度必须小于等于10" })
      .regex(/^[a-zA-Z0-9]{5,10}$/, {
        error: "用户名必须由数字和大小写字母组成",
      }),
    password: z
      .string({ error: "密码不能为空" })
      .min(8, { error: "密码长度必须大于等于8" })
      .max(16, { error: "密码长度必须小于等于16" })
      .regex(
        /^[a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\-\_\+\=\[\]\{\}\:\;\>\<\?\|\~\,\.]{8,16}$/,
        { error: "密码必须由数字、大小写字母及特殊字符组成" },
      ),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const tokensStoreRefs = storeToRefs(useTokensStore());

const onSubmit = form.handleSubmit(async (value) => {
  try {
    const { accessToken, refreshToken } = await useLogin(
      value.username,
      value.password,
    );

    tokensStoreRefs.token.value = accessToken;
    tokensStoreRefs.refreshToken.value = refreshToken;

    toast.success("登录成功", { closeButton: true });
    navigateTo("/home");
  } catch (error) {
    console.log(error);
  } finally {
    form.resetField("password");
  }
});
</script>

<template>
  <Card class="w-90">
    <CardHeader>
      <CardTitle class="text-2xl flex justify-between">
        <span>账号登录</span>
        <ModeSwitch></ModeSwitch>
      </CardTitle>
      <CardDescription>请输入用户名及密码以登录 </CardDescription>
    </CardHeader>

    <CardContent>
      <form class="grid gap-4">
        <FormField name="username" v-slot="{ componentField }">
          <FormItem>
            <FormLabel for="username">用户名</FormLabel>
            <FormControl>
              <Input
                type="text"
                id="username"
                placeholder="请输入用户名"
                v-bind="componentField"
              ></Input>
            </FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        </FormField>

        <FormField name="password" v-slot="{ componentField }">
          <FormItem>
            <div class="flex justify-between">
              <FormLabel for="password">密码</FormLabel>
              <HoverCard>
                <HoverCardTrigger>
                  <span class="text-sm hover:cursor-pointer hover:underline"
                    >忘记密码?</span
                  >
                </HoverCardTrigger>
                <HoverCardContent class="p-2">
                  <p class="text-sm text-center">
                    如遇忘记密码，请及时联系管理员
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <FormControl>
              <Input
                type="password"
                id="password"
                placeholder="请输入密码"
                v-bind="componentField"
              ></Input>
            </FormControl>
            <FormMessage></FormMessage>
          </FormItem>
        </FormField>

        <Button @click="onSubmit" class="w-full font-bold text-md">登录</Button>
      </form>
    </CardContent>
  </Card>
</template>
