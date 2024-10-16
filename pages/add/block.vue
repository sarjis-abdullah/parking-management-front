<script setup>
import { ref, reactive, onMounted } from "vue";
const formRef = ref(null);
import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, helpers } from "@vuelidate/validators";
import { BlockService } from "@/services/BlockService.js";
import { SlotService } from "@/services/SlotService.js";
import { CategoryService } from "~/services/CategoryService";
import { FloorService } from "~/services/FloorService";
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";

definePageMeta({
  layout: "auth-layout",
});
const defaultData = {
  name: "",
  floor: "",
};
const serverErrors = ref({});
const state = reactive(defaultData);
const rules = computed(() => {
  return {
    name: { required: helpers.withMessage("Name is required", required) },
    floor: { required: helpers.withMessage("Floor is required", required) },
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
const postItem = async () => {
  try {
    loading.value = true;
    const obj = {
      ...state,
      floor_id: state.floor,
    };
    delete obj.floor;
    await BlockService.create(obj);
    serverErrors.value = {};
    handleReset();
  } catch (error) {
    if (error.errors) {
      serverErrors.value = error.errors;
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
const blocks = ref([]);
const getblocks = async () => {
  const { data } = await BlockService.getAll("");
  blocks.value = data;
};
const categories = ref([]);
const getCategories = async () => {
  const { data } = await CategoryService.getAll();
  categories.value = data;
};
const floors = ref([]);
const getFloors = async () => {
  const { data } = await FloorService.getAll(``);
  floors.value = data;
};
const handleblockChange = () => {
  getFloors();
};
onMounted(() => {
  getFloors();
  // getCategories();
});

const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 blockholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <section class="max-w-2xl rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <header class="hidden md:flex justify-between text-gray-900 mb-3 text-xl">
      <h6 class="hidden md:inline-block capitalize">{{ "Add Slot" }}</h6>
    </header>
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
            placeholder="e.g. Name"
          />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Floor<span class="text-red-500">*</span></label
          >
          <select
            class="focus:outline-none bg-none"
            :class="inputClass"
            style="background: none"
            name="floor"
            v-model="state.floor"
            :key="state.floor"
            @change="handleblockChange"
          >
            <option disabled :value="''">Select block name</option>
            <option v-for="floor in floors" :key="floor.id" :value="floor.id">
              {{ floor.name }}
            </option>
            <!-- Add more options as needed -->
          </select>
          <!-- <ServerErrorMessage :errors="validator.block.$errors" /> -->
        </div>
      </section>
      <ServerError :error="serverErrors" />
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
