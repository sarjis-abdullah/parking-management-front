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
import { Form, Field, ErrorMessage, } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'
const formRef = ref(null)

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Email is not valid')
    .required((data) => `${data.path} harus diisi`),
  password: yup
    .string()
    .min(5, (data) => `Password minimal ${data.min} karakter`)
    .required((data) => `${data.label} harus diisi`)
    .label('Password'),
})
const onSubmit = (values) => {
  console.log(values)
  formRef.value?.resetForm()

}
</script>

<template>
  <AuthLayout>
    <Form v-slot="{ values, handleReset }" ref="formRef" @submit="onSubmit" :validation-schema="schema">
    <Field name="email" placeholder="email" />
    <ErrorMessage name="email" />
    <Field class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500'" name="password" placeholder="password" />
    <ErrorMessage name="password" />
    <button type="submit">Submit</button>
    <button type="button" @click="handleReset">Reset</button>

  </Form>
  </AuthLayout>
</template>
