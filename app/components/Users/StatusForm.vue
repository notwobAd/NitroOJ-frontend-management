<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

const { id } = defineProps<{ id: number }>();

const formSchema = toTypedSchema(
  z.object({
    isBanned: z.boolean().default(false),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const emit = defineEmits(["onChangeStatus"]);

const onSubmit = form.handleSubmit(async (value) => {
  try {
    await useUpdateUser(id, { isActive: !value.isBanned });

    if (!value.isBanned) toast.success("解除封禁成功", { closeButton: true });
    else toast.success(`封禁用户#${id}成功`, { closeButton: true });

    emit("onChangeStatus");
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
      <FormField name="isBanned" v-slot="{ value, handleChange }">
        <FormItem>
          <div class="flex items-center space-x-2">
            <FormLabel for="isBanned">是否封禁</FormLabel>
            <FormControl>
              <Checkbox
                id="isBanned"
                :model-value="value"
                @update:model-value="handleChange"
              ></Checkbox>
            </FormControl>
          </div>
          <FormMessage></FormMessage>
        </FormItem>
      </FormField>
    </form>
    <div class="w-full flex justify-end">
      <Button @click="onSubmit">保存</Button>
    </div>
  </div>
</template>
