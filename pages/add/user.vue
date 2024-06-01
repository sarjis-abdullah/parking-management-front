<script setup>
import { ref, reactive, onMounted } from "vue";
const formRef = ref(null);
import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, helpers } from "@vuelidate/validators";
import { UserService } from "@/services/UserService.js";
import ClientErrors from "@/components/common/ClientErrors.vue";
import Error from "@/components/common/Error.vue";

definePageMeta({
  layout: "auth-layout",
});
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

const handleReset = async () => {
  await validator.value.$reset();
  for (let key in state) {
    state[key] = "";
  }
  // formRef.value?.reset();
  console.log("handleReset");
};
const postUser = async () => {
  try {
    loading.value = true;
    await UserService.create(state);
    serverErrors.value = {};
    handleReset();
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    loading.value = false;
  }
};
const onSubmit = async () => {
  const r = await validator.value.$validate();
  if (r) {
    postUser();
  } else {
    console.log("Please fillup the form!");
  }
};

const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <section class="max-w-2xl">
    <form @submit.prevent="onSubmit" ref="formRef" class="grid gap-3">
      <section class="grid grid-cols-1 gap-3">
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Name<span class="text-red-500">*</span></label
          >
          <input
            :class="inputClass"
            v-model="state.name"
            type="text"
            placeholder="e.g. John Doe"
          />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Email<span class="text-red-500">*</span></label
          >
          <input
            :class="inputClass"
            v-model="state.email"
            type="email"
            placeholder="e.g. john@mail.co"
          />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Role<span class="text-red-500">*</span></label
          >
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
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
              <!-- Add more options as needed -->
            </select>
          </div>
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Password<span class="text-red-500">*</span></label
          >
          <input
            :class="inputClass"
            v-model="state.password"
            placeholder="password"
            type="password"
          />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Confirm Password<span class="text-red-500">*</span></label
          >
          <input
            :class="inputClass"
            v-model="state.confirmPassword"
            placeholder="confirm password"
            type="password"
          />
        </div>
      </section>
      <Error :error="serverErrors" />
      <ClientErrors :errors="validator.$errors" />
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
            {{ loading ? "Processing" : "Submit" }}
          </button>
        </div>
      </section>
    </form>
  </section>
</template>
