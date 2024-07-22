<script setup>
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";
import { ref, reactive, onMounted } from "vue";
const formRef = ref(null);
import { useVuelidate } from "@vuelidate/core";
import {
  email,
  required,
  sameAs,
  helpers,
  minValue,
} from "@vuelidate/validators";
import { PlaceService } from "@/services/PlaceService.js";
import { SlotService } from "@/services/SlotService.js";
import { CategoryService } from "~/services/CategoryService";
import { TariffService } from "~/services/TariffService";

definePageMeta({
  layout: "auth-layout",
});
const HOURLY = 'hourly'
const HALF_HOURLY = 'half_hourly'
const defaultData = {
  name: "",
  place: "",
  category: "",
  startDate: "",
  tariff: "",
  endDate: "",
  default: false,
  paymentRateType: HALF_HOURLY,
  paymentRates: [
    {
      rate: "",
    },
  ],
};

const serverErrors = ref({});
const state = reactive({...defaultData});
const addNewPaymentRate = () => {
  state.paymentRates.push({
    rate: "",
  });
};
const removePaymentRate = (index) => {
  state.paymentRates.splice(index, 1);
};
const rules = computed(() => {
  return {
    name: { required: helpers.withMessage("Name is required", required) },
    place: {},
    category: {},
    paymentRateType: {},
    tariff: {},
    startDate: {
      
    },
    endDate: {},
    paymentRates: { required },
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
    state[key] = defaultData[key];
  }
  state.paymentRates = [{rate: ''}]
  serverErrors.value = {}
};
const tarifData = computed(() => {
  return {
    name: state.name,
    place_id: state.place,
    category_id: state.category,
    start_date: state.startDate,
    end_date: state.endDate,
    type: state.paymentRateType,
    default: state.default,
    payment_rates: state.paymentRates,
  };
});
const postItem = async () => {
  try {
    loading.value = true;
    await TariffService.create(tarifData.value);
    serverErrors.value = {};
    handleReset();
    state.paymentRateType = HALF_HOURLY
  } catch (error) {
    serverErrors.value = error.errors;
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
  const { data } = await CategoryService.getAll();
  categories.value = data;
};

const handlePlaceChange = () => {};
onMounted(() => {
  getPlaces();
  getCategories();
});
const notice = "This checkbox sets the current tariff plan as the default. Note that only one default tariff plan is allowed at a time. If this tariff plan is selected as default, it will override any existing default tariff plan, and the most recently updated default tariff plan will take precedence."
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <section class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <form @submit.prevent="onSubmit" ref="formRef" class="grid gap-3">
      <section class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Name<span class="text-red-500">*</span></label
          >
          <input
            :class="inputClass"
            v-model="state.name"
            type="text"
            placeholder="e.g. Tariff: Eid parking"
          />
        </div>
        <!-- <div class="grid gap-2">
          <label class="text-gray-500">Place</label>
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
          </select>
        </div> -->
        <!-- <div class="grid gap-2">
          <label class="text-gray-500">Category</label>
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
        </div> -->

        <div class="grid gap-2">
          <label class="text-gray-500"
            >Start date</label
          >
          <input
            :class="inputClass"
            v-model="state.startDate"
            type="date"
            :min="getTodayDate()"
            placeholder="e.g. 20/01/2024"
          />
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
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Payment rate type</label>
          <select
            class="focus:outline-none bg-none"
            :class="inputClass"
            style="background: none"
            name="place"
            v-model="state.paymentRateType"
          >
            <option value="half_hourly">Half-hourly</option>
            <option value="hourly">Hourly</option>
          </select>
        </div>
        
      </section>
      <section class="max-w-sm ml-auto">
        <div class="grid gap-2">
          <div
            class="flex justify-between items-end gap-4"
            v-for="(singleRate, index) in state.paymentRates"
            :key="index"
          >
            <div class="grid gap-2 w-full">
              <label>
                <span v-if="state.paymentRates.length == 1">
                  {{
                    state.paymentRateType == "half_hourly"
                      ? "Each half hour"
                      : "Each hour"
                  }}
                  rate
                </span>
                <span v-else>
                  {{ index == 0 ? "First" : "Next" }}
                  {{
                    state.paymentRateType == "half_hourly"
                      ? "half hour"
                      : "hour"
                  }}
                  rate
                </span>
                <span class="text-red-500">*</span>
              </label>
              <input
                :class="inputClass"
                v-model="singleRate.rate"
                type="number"
                placeholder="20.00 taka"
              />
            </div>
            <div>
              <button
                v-if="index != 0"
                @click="removePaymentRate(index)"
                class="bg-red-500 text-white px-2 py-2 rounded-md"
              >
                Delete
              </button>
              <button
                v-else
                type="button"
                @click="addNewPaymentRate"
                class="bg-indigo-600 text-white px-2 py-2 rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </section>
      <div>
        <div class="flex items-center gap-2">
          <input v-model="state.default" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
          <label class="text-gray-500">Marked as default</label>
        </div>
        <small class="text-gray-500">{{notice}}</small>
      </div>
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
