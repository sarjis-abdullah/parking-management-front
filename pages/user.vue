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
import ErrorMessage from "../components/common/ErrorMessage.vue";
import storeSchema from "../validationSchema/user/storeSchema";
// import { Form, Field, ErrorMessage, useForm } from "vee-validate";
// const { setFieldValue } = useForm();
import * as yup from "yup";
import { ref, reactive } from "vue";
const formRef = ref(null);
const emailError = ref(null);
import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, helpers } from "@vuelidate/validators";

const state = reactive({
  name: "",
  email: "",
  role: "",
  password: "",
  confirmPassword: "",
});
const rules = computed(() => {
  return {
    name: { required: helpers.withMessage("Name is required", required) },
    email: {
      required: helpers.withMessage("Email is required", required),
      email,
    },
    role: { required: helpers.withMessage("Role is required", required) },
    password: {
      required: helpers.withMessage("Password is required", required),
    },
    confirmPassword: {
      required: helpers.withMessage("Confirm password is required", required),
      sameAs: helpers.withMessage(
        "Doesn't match with password",
        sameAs(state.password)
      ),
    },
  };
});
const validator = useVuelidate(rules, state, { $lazy: true });

const schema = storeSchema;
const onSubmit = async (values) => {
  console.log(validator.value);
  const r = await validator.value.$validate();
  if (r) {
    console.log(9999);
  } else {
    console.log(777777777);
  }
};
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <AuthLayout>
    <section class="max-w-2xl">
      <form
        @submit.prevent="onSubmit"
        :validation-schema="schema"
        class="grid gap-3"
      >
        <!-- <pre>
        {{ validator.name.$errors }}
      </pre
        > -->
        <section class="grid grid-cols-1 gap-3">
          <div class="grid gap-2">
            <label class="text-gray-500">Name</label>
            <input
              :class="inputClass"
              v-model="state.name"
              type="text"
              placeholder="e.g. John Doe"
            />
            <ErrorMessage :errors="validator.name.$errors" />
          </div>
        </section>
        <section class="grid grid-cols-2 gap-3">
          <div class="grid gap-2">
            <label class="text-gray-500">Email</label>
            <input
              :class="inputClass"
              v-model="state.email"
              type="email"
              placeholder="e.g. john@mail.co"
            />
            <ErrorMessage :errors="validator.email.$errors" />
          </div>
          <div class="grid gap-2">
            <label class="text-gray-500">Role</label>
            <div class="grid gap-2" :style="''">
              <select
                class="focus:outline-none bg-none"
                :class="inputClass"
                style="background: none"
                name="role"
                v-model="state.role"
              >
                <option disabled :value="''">Select a role</option>
                <option value="1-3">1-3</option>
                <option value="4-6">4-6</option>
                <option value="7-Above">7-Above</option>
                <!-- Add more options as needed -->
              </select>
              <ErrorMessage :errors="validator.role.$errors" />
            </div>
          </div>
        </section>
        <section class="grid grid-cols-1 gap-3">
          <div class="grid gap-2">
            <label class="text-gray-500">Password</label>
            <input
              :class="inputClass"
              v-model="state.password"
              placeholder="password"
              type="password"
            />
            <ErrorMessage :errors="validator.password.$errors" />
          </div>
          <div class="grid gap-2">
            <label class="text-gray-500">Confirm Password</label>
            <input
              :class="inputClass"
              v-model="state.confirmPassword"
              placeholder="confirm password"
              type="password"
            />
            <ErrorMessage :errors="validator.confirmPassword.$errors" />
          </div>
        </section>
        <section>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="bg-gray-400 text-white px-2 py-1 rounded-md"
              @click="handleReset"
            >
              Reset
            </button>
            <button
              type="button"
              class="bg-gray-400 text-white px-2 py-1 rounded-md"
              @click="validate"
            >
              validate
            </button>
            <button
              type="submit"
              class="bg-indigo-600 text-white px-2 py-1 rounded-md"
            >
              Submit
            </button>
          </div>
        </section>
      </form>
    </section>
  </AuthLayout>
</template>
