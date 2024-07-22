<script setup>
import AuthLayout from "../layouts/AuthLayout.vue";
import ErrorMessage from "../components/common/ErrorMessage.vue";
import ServerError from "@/components/common/Error.vue";
import ClientErrors from "@/components/common/ClientErrors.vue";
import { ref, reactive, onMounted } from "vue";
const formRef = ref(null);
import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, helpers, minValue } from "@vuelidate/validators";
import { MembershipTypeService } from "@/services/MembershipTypeService.js";
import { PlaceService } from "@/services/PlaceService.js";

definePageMeta({
  layout: "auth-layout",
});
const PERCENTAGE = "percentage"
const defaultData = {
  name: "",
  discountAmount: 0,
  discountType: PERCENTAGE,
  default: false,
};
const notice = "This checkbox sets the current membership plan as the default. If this membership plan is selected as default, it will override any existing default membership plan, and will take precedence."

const serverErrors = ref({});
const state = reactive(defaultData);
const rules = computed(() => {
  return {
    name: { required: helpers.withMessage("Name is required", required) },
    discountAmount: { 
      required: helpers.withMessage("Discount amount is required", required),
      minValue: helpers.withMessage("Discount amount must be at least 1", minValue(0)),
    },
    discountType: { required: helpers.withMessage("Discount type is required", required) },
  };
});
const validator = useVuelidate(rules, state, { $lazy: true });

const loading = ref(false);

const handleReset = async () => {
  await validator.value.$reset();
  for (let key in state) {
    state[key] = "";
  }
  state.discountType = PERCENTAGE
  state.discountAmount = 0
};
const soreableData = computed(()=> {
  const obj = {
    name: state.name,
    default: state.default,
  }
  if (state.discountType) {
    obj.discount_type = state.discountType
  }
  if (state.discountType) {
    obj.discount_amount = state.discountAmount
  }
  return obj
})
const postItem = async () => {
  try {
    loading.value = true;
    await MembershipTypeService.create(soreableData.value);
    serverErrors.value = {};
    handleReset();
  } catch (error) {
    serverErrors.value = error.errors
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
onMounted(() => {
  getPlaces();
});

const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <section class="max-w-2xl rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <header class="hidden md:flex justify-between text-gray-900 mb-3 text-xl">
      <h6 class="hidden md:inline-block capitalize">{{ 'Add Membership type' }}</h6>
    </header>
    <form @submit.prevent="onSubmit" ref="formRef" class="grid gap-3">
      <section class="grid grid-cols-1 gap-3">
        <div class="grid gap-2">
          <label class="text-gray-500">
            Membership group name<span class="text-red-500">*</span>
          </label>
          <input
            :class="inputClass"
            v-model="state.name"
            type="text"
            placeholder="e.g. Regular customer"
          />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Discount type</label>
          <select
            class="focus:outline-none bg-none"
            :class="inputClass"
            style="background: none"
            name="place"
            v-model="state.discountType"
          >
            <option value="flat">Flat</option>
            <option value="percentage">Percentage</option>
            <option value="free">Free</option>
          </select>
        </div>
        
        <div class="grid gap-2">
          <label class="text-gray-500">Discount amount</label>
          <input
            :class="inputClass"
            v-model="state.discountAmount "
            type="number"
            placeholder="e.g. 10"
          />
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
