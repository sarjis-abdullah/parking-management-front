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
import { TariffService } from "~/services/TariffService";

definePageMeta({
  layout: "auth-layout",
});
const defaultData = {
  name: "",
  place: "",
  category: "",
  startDate: "",
  endDate: "",
};
const serverErrors = ref({});
const state = reactive(defaultData);
const rules = computed(() => {
  return {
    name: { required: helpers.withMessage("Name is required", required) },
    place: { required: helpers.withMessage("Place is required", required) },
    category: {
      required: helpers.withMessage("Category is required", required),
    },
    startDate: {
      required: helpers.withMessage("Start date is required", required),
    },
    endDate: {},
    // remarks: {
    //   required: helpers.withMessage("remarks is required", required),
    // },
  };
});
const validator = useVuelidate(rules, state, { $lazy: true });

const loading = ref(false);
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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
      start_date: state.startDate,
      end_date: state.endDate,
    };
    delete obj.place;
    delete obj.category;
    delete obj.startDate;
    delete obj.endDate;
    await TariffService.create(obj);
    serverErrors.value = {};
    handleReset();
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
const places = ref([]);
const getPlaces = async () => {
  const { data } = await PlaceService.getAll("");
  places.value = data;
};
const categories = ref([]);
const getCategories = async () => {
  const { data } = await CategoryService.getAll(`?place_id=${state.place}`);
  categories.value = data;
};
const handlePlaceChange = () => {
  getCategories();
};
onMounted(() => {
  getPlaces();
});

const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <section class="max-w-2xl">
    <form @submit.prevent="onSubmit" ref="formRef" class="grid gap-3">
      <ul>
        <li v-for="item in serverErrors" :key="item">
          <span class="text-red-500">
            -{{ item?.length ? item.toString() : 2 }}
          </span>
        </li>
      </ul>
      <section class="grid grid-cols-1 gap-3">
        <div class="grid gap-2">
          <label class="text-gray-500">Name<span class="text-red-500">*</span></label>
          <input
            :class="inputClass"
            v-model="state.name"
            type="text"
            placeholder="e.g. Tariff: Eid parking"
          />
          <ErrorMessage :errors="validator.name.$errors" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Place<span class="text-red-500">*</span></label>
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
          <ErrorMessage :errors="validator.place.$errors" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Category<span class="text-red-500">*</span></label>
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
            <!-- Add more options as needed -->
          </select>
          <ErrorMessage :errors="validator.category.$errors" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Start date<span class="text-red-500">*</span></label>
          <input
            :class="inputClass"
            v-model="state.startDate"
            type="date"
            :min="getTodayDate()"
            placeholder="e.g. 20/01/2024"
          />
          <ErrorMessage :errors="validator.startDate.$errors" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">End date</label>
          <input
            :class="inputClass"
            v-model="state.endDate"
            type="date"
            :min="getTodayDate()"
            placeholder="e.g. 20/12/2024"
          />
          <ErrorMessage :errors="validator.endDate.$errors" />
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
            {{ loading ? "Processing" : "Submit" }}
          </button>
        </div>
      </section>
    </form>
  </section>
</template>
