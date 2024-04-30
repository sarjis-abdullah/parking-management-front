<script setup>
import AuthLayout from "../layouts/AuthLayout.vue";
import ErrorMessage from "../components/common/ErrorMessage.vue";
import { ref, reactive, onMounted } from "vue";
const formRef = ref(null);
import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, helpers } from "@vuelidate/validators";
import {ParkingService} from "@/services/ParkingService.js";
import {PlaceService} from "@/services/PlaceService.js";
import { SlotService } from "~/services/SlotService";
import { CategoryService } from "~/services/CategoryService";

definePageMeta({
  layout:"auth-layout",
});
const defaultData = {
  vehicleNumber: "",
  driverName: "",
  driverMobile: "",
  place: "",
  slot: "",
  category: "",
};
const serverErrors = ref({});
const state = reactive(defaultData);
const rules = computed(() => {
  return {
    vehicleNumber: { required: helpers.withMessage("Vehicle Number is required", required) },
    driverName: {  },
    driverMobile: {  },
    place: {
      required: helpers.withMessage("place is required", required),
    },
    category: {
      required: helpers.withMessage("category is required", required),
    },
    slot: {
      required: helpers.withMessage("slot is required", required),
    },
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
const parkingData = computed(()=> {
  return {
    vehicle_no: state.vehicleNumber,
    driver_name: state.driverName,
    driver_mobile: state.driverMobile,
    place_id: state.place,
    category_id: state.category,
    slot_id: state.slot,
  }
})
const postItem = async () => {
  try {
    loading.value = true
    await ParkingService.create(parkingData.value)
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
const places = ref([])
const getPlaces = async () => {
  const {data} = await PlaceService.getAll('')
  places.value = data
}
const slots = ref([])
const getSlots = async () => {
  const {data} = await SlotService.getAll(`?category_id=${state.category}`)
  slots.value = data
}
const categories = ref([])
const getCategories = async () => {
  const {data} = await CategoryService.getAll(`?place_id=${state.place}`)
  categories.value = data
}
const handlePlaceChange = () => {
  getCategories()
  // getFloors()
}
onMounted(() => {
  getPlaces()
})

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
            <label class="text-gray-500">Name</label>
            <input
              :class="inputClass"
              v-model="state.vehicleNumber"
              type="text"
              placeholder="e.g. Ka-12345"
            />
            <ErrorMessage :errors="validator.vehicleNumber.$errors" />
          </div>
          <div class="grid gap-2">
            <label class="text-gray-500">driverName</label>
            <input
              :class="inputClass"
              v-model="state.driverName"
              type="text"
              placeholder="e.g. John Doe"
            />
            <ErrorMessage :errors="validator.driverName.$errors" />
          </div>
          <div class="grid gap-2">
            <label class="text-gray-500">driverMobile</label>
            <input
              :class="inputClass"
              v-model="state.driverMobile"
              type="text"
              placeholder="e.g. 01587616484"
            />
            <ErrorMessage :errors="validator.driverMobile.$errors" />
          </div>
          <div class="grid gap-2">
            <label class="text-gray-500">Place</label>
            <select
                class="focus:outline-none bg-none"
                :class="inputClass"
                style="background: none"
                name="place"
                v-model="state.place"
                @change="handlePlaceChange"
              >
                <option disabled :value="''">Select place name</option>
                <option v-for="place in places" :key="place.id" :value="place.id">
                {{ place.name }}</option>
                <!-- Add more options as needed -->
              </select>
              <ErrorMessage :errors="validator.place.$errors" />
          </div>
          <div class="grid gap-2">
            <label class="text-gray-500">Category</label>
            <select
                class="focus:outline-none bg-none"
                :class="inputClass"
                style="background: none"
                name="place"
                v-model="state.category"
                @change="getSlots"
              >
                <option disabled :value="''">Select place name</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}</option>
                <!-- Add more options as needed -->
              </select>
              <ErrorMessage :errors="validator.category.$errors" />
          </div>
          <div class="grid gap-2">
            <label class="text-gray-500">Slot</label>
            <select
                class="focus:outline-none bg-none"
                :class="inputClass"
                style="background: none"
                name="place"
                v-model="state.slot"
              >
                <option disabled :value="''">Select place name</option>
                <option v-for="slot in slots" :key="slot.id" :value="slot.id">
                {{ slot.name }}</option>
                <!-- Add more options as needed -->
              </select>
              <ErrorMessage :errors="validator.slot.$errors" />
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
              Submit
            </button>
          </div>
        </section>
      </form>
    </section>
</template>
