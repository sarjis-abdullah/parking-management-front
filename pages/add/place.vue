<script setup>
import AuthLayout from "../layouts/AuthLayout.vue";
import ErrorMessage from "../components/common/ErrorMessage.vue";
import { ref, reactive, onMounted } from "vue";
const formRef = ref(null);
import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, helpers } from "@vuelidate/validators";
import {PlaceService} from "@/services/PlaceService.js";

definePageMeta({
  layout:"auth-layout",
});
const defaultData = {
  name: "",
  description: "",
};
const serverErrors = ref({});
const state = reactive(defaultData);
const rules = computed(() => {
  return {
    name: { required: helpers.withMessage("Name is required", required) },
    description: {},
  };
});
const validator = useVuelidate(rules, state, { $lazy: true });

const loading = ref(false);

const handleReset = async () => {
  await validator.value.$reset();
  for (let key in state) {
    state[key] = '';
  }
  // formRef.value?.reset();
  console.log('handleReset');
};
const postItem = async () => {
  try {
    loading.value = true
    await PlaceService.create(state)
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
  const r = await validator.value.$validate();
  if (r) {
    postItem();
  } else {
    console.log("Please fillup the form!");
  }
};

const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
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
            <label class="text-gray-500">
              Name<span class="text-red-500">*</span>
            </label>
            <input
              :class="inputClass"
              v-model="state.name"
              type="text"
              placeholder="e.g. Khulshi town center"
            />
            <ErrorMessage :errors="validator.name.$errors" />
          </div>
          <div class="grid gap-2">
            <label class="text-gray-500">Description</label>
            <input
              :class="inputClass"
              v-model="state.description"
              type="text"
              placeholder="e.g. description"
            />
            <ErrorMessage :errors="validator.description.$errors" />
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
              type="submit"
              :disabled="loading"
              class="bg-indigo-600 text-white px-2 py-1 rounded-md"
            >
              {{loading ? 'Processing' : 'Submit'}}
            </button>
          </div>
        </section>
      </form>
    </section>
</template>
