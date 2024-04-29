<script setup>
import AuthLayout from "../layouts/AuthLayout.vue";
import ErrorMessage from "../components/common/ErrorMessage.vue";
import { ref, reactive, onMounted } from "vue";
const formRef = ref(null);
import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, helpers } from "@vuelidate/validators";
const config = useRuntimeConfig();
const BASE_URL = config.public.BASE_URL;

const defaultData = {
  name: "",
  email: "",
  role: "",
  password: "",
  confirmPassword: "",
};
const serverErrors = ref({});
const state = reactive(defaultData);
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

const loading = ref(false);

const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNTg0NzhkMGRlOTBlMGJmYTBlNDM2MzYxYzc4YzNjNDRkNzdmZWFjOGY2MTg0OGI4NmFlZjI5M2U4NjBjMjU2MWM3NDA2ODVkM2JhYzRmMWYiLCJpYXQiOjE3MTQyMjI5NzYuNDMyNDc5LCJuYmYiOjE3MTQyMjI5NzYuNDMyNDgzLCJleHAiOjE3NDU3NTg5NzYuNDE1MDA4LCJzdWIiOiI0Iiwic2NvcGVzIjpbXX0.A-YTSXfW8-0Ulu6fkQKerul9Wrcp3RBTD1huHt2rIJoRqOnUPfeAEG_VmgeqbEpM2v38DdI7oscx3CuFYiteejTT8SQUuWhWjGZC6S83phKYYcL0grQRylJ4jQ0oS-umxSo-yDN91uHulc683eOjzCuGRcZIWLP_k2BGuJMZnbklAxFfLxSfM2-v_uvVO9e-7U8H7QrmjMZAcgGnIlDkP8kKCTDg4VL3w_4Dh7krXZd-PiVd8aOE9hVudyOLDQAKcjhzJp-8ZIu7ey1gfleZkhUwfSBHypIPNE0KgV4YyxBEa7IT7lOcdtTgvdWiCkrw57AAnPIcf8OexMgf6KK-5F4LjTxV4ywq6J6YIcRkRcSOsqxUbZauQHMohuDdfSgpN-AIHoeBWwCT2qlXYD0qqjCwykRayD2NOMsmoAAALeTbw-rP0zq1Fxo9285U687T3Ma22dGVj5HZ_UyAP--9MGakLVxdGzHaSvz53fNUOLe6vL-xAsyVDUJJcd0ACTNePDELo75k51AvpZXzIQtKp-t9ijSb8tXd4EvcCNwMDa8KFdQwv2xxOdGUBHfUASzeJM5_FR7xPjfDNgMA3Z38DI_5GVrKziaRBHqDnwlwqPHQOdPOkB1Hfq0gL3hpK7CYxiViqdS5MkSB8ZmeMwbffiZcJq4ChpN6SnHe7bQfOhE";
const handleReset = async () => {
  await validator.value.$reset();
  for (let key in state) {
    state[key] = '';
  }
  // formRef.value?.reset();
  console.log('handleReset');
};
const postUser = async () => {
  // const { data } = await useFetch(BASE_URL + 'user')
  try {
    loading.value = true;
    await $fetch(BASE_URL + "register", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Adjust content type as needed
      },
      body: state,
    });
    serverErrors.value = {};
    handleReset()
  } catch (error) {
    if (error.response?._data?.errors) {
      serverErrors.value = error.response._data.errors;
    } else if (error.response?.data?.errors) {
      serverErrors.value = error.response?.data.errors;
    }
  } finally {
    loading.value = false;
  }
};
const onSubmit = async () => {
  console.log(validator.value);
  const r = await validator.value.$validate();
  if (r) {
    postUser();
  } else {
    console.log("Please fillup the form!");
  }
};

onMounted(() => {
  // axios.get('http://localhost:8190/api/v1')
});
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <AuthLayout>
    <section class="max-w-2xl">
      <form
        @submit.prevent="onSubmit"
        ref="formRef"
        class="grid gap-3"
      >
        <ul>
          <li v-for="item in serverErrors" :key="item">
            <span class="text-red-500">
              -{{ item?.length ? item.toString() : 2 }}
            </span>
          </li>
        </ul>
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
                :key="state.role"
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
            <!-- <button
              type="button"
              class="bg-gray-400 text-white px-2 py-1 rounded-md"
              @click="validate"
            >
              validate
            </button> -->
            <button
              type="submit"
              :disabled="loading"
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
