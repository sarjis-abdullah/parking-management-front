<!-- <template>
  <AuthLayout>
    <section>hello</section>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from "../layouts/AuthLayout.vue";
</script>

<style lang="scss" scoped></style> -->

<script setup>
import AuthLayout from "../layouts/AuthLayout.vue";
import storeSchema from "../validationSchema/place/storeSchema";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { ref } from "vue";
const formRef = ref(null);

const schema = storeSchema;
const onSubmit = (values) => {
  console.log(values);
  formRef.value?.resetForm();
};
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <AuthLayout>
    <section class="max-w-2xl">
      <Form
        v-slot="{ values, handleReset }"
        ref="formRef"
        @submit="onSubmit"
        :validation-schema="schema"
        class="grid grid-cols-2 gap-3"
      >
        <div class="grid gap-2">
          <label class="text-gray-500">Place</label>
          <Field :class="inputClass" name="email" placeholder="email" />
          <ErrorMessage class="text-red-500" name="email" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Category</label>
          <Field :class="inputClass" name="password" placeholder="password" />
          <ErrorMessage class="text-red-500" name="password" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Floor</label>
          <Field :class="inputClass" name="password" placeholder="password" />
          <ErrorMessage class="text-red-500" name="password" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Name</label>
          <Field :class="inputClass" name="password" placeholder="password" />
          <ErrorMessage class="text-red-500" name="password" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Identity</label>
          <Field :class="inputClass" name="password" placeholder="password" />
          <ErrorMessage class="text-red-500" name="password" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Remarks</label>
          <Field :class="inputClass" name="password" placeholder="password" />
          <ErrorMessage class="text-red-500" name="password" />
        </div>
        <div></div>
        <div class="flex justify-end gap-2">
          <button type="button" class="bg-gray-400 text-white px-2 py-1 rounded-md" @click="handleReset">Reset</button>
          <button
            type="submit"
            class="bg-indigo-600 text-white px-2 py-1 rounded-md"
          >
            Submit
          </button>
        </div>
      </Form>
    </section>
  </AuthLayout>
</template>
