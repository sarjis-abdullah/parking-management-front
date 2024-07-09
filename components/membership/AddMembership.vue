<script setup>
import ClientErrors from "@/components/common/ClientErrors.vue";
import Error from "@/components/common/Error.vue";
import { ref, reactive, onMounted } from "vue";
const formRef = ref(null);
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  helpers,
} from "@vuelidate/validators";
import { MembershipService } from "~/services/MembershipService";

const {vehicleId} = defineProps({
    vehicleId: {
        type: Number,
        default: null
    }
})

const emit = defineEmits(['refetch'])
const defaultData = {
  name: "",
  contactNumber: ""
};

const serverErrors = ref({});
const state = reactive({ ...defaultData });
const rules = computed(() => {
  return {
    name: { },
    contactNumber: { required: helpers.withMessage("Contact number is required", required) },
  };
});
const validator = useVuelidate(rules, state, { $lazy: true });

const loading = ref(false);

const handleReset = async () => {
  await validator.value.$reset();
  for (let key in state) {
    state[key] = defaultData[key];
  }
  serverErrors.value = {};
  console.log("handleReset");
};
const tarifData = computed(() => {
  return {
    name: state.name,
    contact_number: state.contactNumber,
    vehicle_id: vehicleId,
  };
});
const postItem = async () => {
  try {
    loading.value = true;
    await MembershipService.create(tarifData.value);
    serverErrors.value = {};
    handleReset();
    emit('refetch')
  } catch (error) {
    console.log(error, "error");
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

const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <section class="">
    <form @submit.prevent="onSubmit" ref="formRef" class="grid gap-3">
      <header>
        <h3 class="text-lg text-indigo-600">Add Membership</h3>
      </header>
      <section class="grid grid-cols-1 gap-3">
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Name</label
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
            >Contact Number<span class="text-red-500">*</span></label
          >
          <input
            :class="inputClass"
            v-model="state.contactNumber"
            type="text"
            placeholder="e.g. 01521878979"
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
