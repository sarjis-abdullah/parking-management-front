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
import { DiscountService } from "~/services/DiscountService";

definePageMeta({
  layout: "auth-layout",
});
const HOURLY = "hourly";
const HALF_HOURLY = "half_hourly";
const defaultData = {
  type: "",
  amount: "",
  promoCode: "",
  isActive: false,
};

const serverErrors = ref({});
const state = reactive({ ...defaultData });
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
    promoCode: {
      required: helpers.withMessage("Promo code is required", required),
    },
    amount: { required: helpers.withMessage("Amount is required", required) },
    type: { required: helpers.withMessage("Type is required", required) },
    isActive: {},
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
  state.type = 'flat'
  serverErrors.value = {};
};
const discountData = computed(() => {
  return {
    amount: state.amount,
    type: state.type,
    is_active: state.isActive,
    promo_code: state.promoCode,
  };
});
const postItem = async () => {
  try {
    loading.value = true;
    await DiscountService.create(discountData.value);
    
    serverErrors.value = {};
    handleReset();
    state.paymentRateType = HALF_HOURLY;
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

const handlePlaceChange = () => {};
onMounted(() => {
  state.type = "flat";
});
const notice =
  "This checkbox sets the current tariff plan as the default. Note that only one default tariff plan is allowed at a time. If this tariff plan is selected as default, it will override any existing default tariff plan, and the most recently updated default tariff plan will take precedence.";
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <section class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <header class="hidden md:flex justify-between text-gray-900 mb-3 text-xl">
      <h6 class="hidden md:inline-block capitalize">{{ "Add Discount" }}</h6>
    </header>
    <form @submit.prevent="onSubmit" ref="formRef" class="grid gap-3">
      <section class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="grid gap-2">
          <label class="text-gray-500">Discount type</label>
          <select
            class="focus:outline-none bg-none"
            :class="inputClass"
            style="background: none"
            name="place"
            v-model="state.type"
          >
            <option value="flat">Flat</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Amount<span class="text-red-500">*</span></label
          >
          <input
            :class="inputClass"
            v-model="state.amount"
            type="number"
            :placeholder="
              state.type == 'flat'
                ? 'e.g. Discount in flat amount'
                : 'e.g. Discount in percentage amount'
            "
          />
        </div>

        <div class="grid gap-2">
          <label class="text-gray-500">Promo code<span class="text-red-500">*</span></label>
          <input
            :class="inputClass"
            v-model="state.promoCode"
            type="text"
            placeholder="e.g. BD-123"
          />
        </div>
      </section>
      <div>
        <div class="flex items-center gap-2">
          <input
            v-model="state.isActive"
            type="checkbox"
            value=""
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          />
          <label class="text-gray-500">Activate Discount</label>
        </div>
        <small class="text-gray-500">{{ state.isActive ? 'Discount On' : 'Discount off' }}</small>
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
