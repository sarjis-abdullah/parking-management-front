<script setup>
import AuthLayout from "../layouts/AuthLayout.vue";
import ErrorMessage from "../components/common/ErrorMessage.vue";
import { ref, reactive, onMounted } from "vue";
const formRef = ref(null);
import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, helpers } from "@vuelidate/validators";
import { PlaceService } from "@/services/PlaceService.js";
import { SlotService } from "@/services/SlotService.js";
import { CategoryService } from "~/services/CategoryService";
import { FloorService } from "~/services/FloorService";
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";
import { BlockService } from "~/services/BlockService";

definePageMeta({
  layout: "auth-layout",
});
const defaultData = {
  name: "",
  place: "",
  category: "",
  floor: "",
  block: "",
  identity: "",
  remarks: "",
};
const serverErrors = ref({});
const state = reactive(defaultData);
const rules = computed(() => {
  return {
    name: { required: helpers.withMessage("Name is required", required) },
    place: { required: helpers.withMessage("Place is required", required) },
    category: {},
    floor: { required: helpers.withMessage("Floor is required", required) },
    block: { required: helpers.withMessage("Block is required", required) },
    remarks: {},
    identity: {},
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
      place_id: state.place,
      category_id: state.category,
      floor_id: state.floor,
      block_id: state.block,
    };
    delete obj.place;
    delete obj.category;
    delete obj.floor;
    delete obj.block;
    await SlotService.create(obj);
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
const places = ref([]);
const getPlaces = async () => {
  const { data } = await PlaceService.getAll("");
  places.value = data;
};
const blocks = ref([]);
const getBlocks = async () => {
  const { data } = await BlockService.getAll(`?floor_id=${state.floor}`);
  blocks.value = data;
};
const floors = ref([]);
const getFloors = async () => {
  const { data } = await FloorService.getAll(`?place_id=${state.place}`);
  floors.value = data;
};
const handlePlaceChange = () => {
  getFloors();
};
onMounted(() => {
  getPlaces();
  // getCategories();
});

const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <section class="max-w-2xl rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <header class="hidden md:flex justify-between text-gray-900 mb-3 text-xl">
      <h6 class="hidden md:inline-block capitalize">{{ 'Add Slot' }}</h6>
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
            placeholder="e.g. slot no 1"
          />
          <!-- <ServerErrorMessage :errors="validator.name.$errors" /> -->
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Place<span class="text-red-500">*</span></label
          >
          <select
            class="focus:outline-none bg-none"
            :class="inputClass"
            style="background: none"
            name="place"
            v-model="state.place"
            :key="state.place"
            @change="handlePlaceChange"
          >
            <option disabled :value="''">Select place name</option>
            <option v-for="place in places" :key="place.id" :value="place.id">
              {{ place.name }}
            </option>
            <!-- Add more options as needed -->
          </select>
          <!-- <ServerErrorMessage :errors="validator.place.$errors" /> -->
        </div>
        <!-- <div class="grid gap-2">
          <label class="text-gray-500"
            >Category</label
          >
          <select
            class="focus:outline-none bg-none"
            :class="inputClass"
            style="background: none"
            name="place"
            v-model="state.category"
          >
            <option disabled :value="''">Select category name</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
          <ServerErrorMessage :errors="validator.category.$errors" />
        </div> -->
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Floor<span class="text-red-500">*</span></label
          >
          <select
            class="focus:outline-none bg-none"
            :class="inputClass"
            style="background: none"
            name="place"
            v-model="state.floor"
            @change="getBlocks"
          >
            <option disabled :value="''">Select floor name</option>
            <option v-for="floor in floors" :key="floor.id" :value="floor.id">
              {{ floor.name }}
            </option>
          </select>
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Block<span class="text-red-500">*</span></label
          >
          <select
            class="focus:outline-none bg-none"
            :class="inputClass"
            style="background: none"
            name="place"
            v-model="state.block"
          >
            <option disabled :value="''">Select block name</option>
            <option v-for="floor in blocks" :key="floor.id" :value="floor.id">
              {{ floor.name }}
            </option>
          </select>
        </div>
        <!-- <div class="grid gap-2">
          <label class="text-gray-500">Identity</label>
          <input
            :class="inputClass"
            v-model="state.identity"
            type="text"
            placeholder="e.g. corrola 2012 model"
          />
          <ServerErrorMessage :errors="validator.identity.$errors" />
        </div> -->
        <div class="grid gap-2">
          <label class="text-gray-500">Remarks</label>
          <input
            :class="inputClass"
            v-model="state.remarks"
            type="text"
            placeholder="e.g. remarks"
          />
          <!-- <ServerErrorMessage :errors="validator.remarks.$errors" /> -->
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
