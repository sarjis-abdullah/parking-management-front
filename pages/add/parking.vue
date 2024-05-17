<script setup>
import AuthLayout from "../layouts/AuthLayout.vue";
import Loading from "@/components/common/Loading.vue";
import ErrorMessage from "../components/common/ErrorMessage.vue";
import { ref, reactive, onMounted } from "vue";
const formRef = ref(null);
import { useVuelidate } from "@vuelidate/core";
import { email, required, sameAs, helpers } from "@vuelidate/validators";
import { ParkingService } from "@/services/ParkingService.js";
import { PlaceService } from "@/services/PlaceService.js";
import { SlotService } from "~/services/SlotService";
import { CategoryService } from "~/services/CategoryService";
import { FloorService } from "~/services/FloorService";
import {useDebounce} from '@/hooks/useDebounce'

definePageMeta({
  layout: "auth-layout",
});
const defaultData = {
  vehicleNumber: "",
  driverName: "",
  driverMobile: "",
  place: "",
  slot: "",
  category: "",
  floor: "",
};
const serverErrors = ref({});
const state = reactive(defaultData);
const rules = computed(() => {
  return {
    vehicleNumber: {
      required: helpers.withMessage("Vehicle Number is required", required),
    },
    driverName: {},
    driverMobile: {},
    place: {
      required: helpers.withMessage("place is required", required),
    },
    category: {
      required: helpers.withMessage("category is required", required),
    },
    floor: {
      required: helpers.withMessage("floor is required", required),
    },
    slot: {
      required: helpers.withMessage("slot is required", required),
    },
  };
});
const validator = useVuelidate(rules, state, { $lazy: true });

const loading = ref(false);
const selectedSlot = ref();
const handleReset = async () => {
  await validator.value.$reset();
  for (let key in state) {
    state[key] = "";
  }
  selectedSlot.value = null;
  // formRef.value?.reset();
  console.log("handleReset");
};
const parkingData = computed(() => {
  return {
    vehicle_no: state.vehicleNumber,
    driver_name: state.driverName,
    driver_mobile: state.driverMobile,
    place_id: state.place,
    category_id: state.category,
    slot_id: state.slot,
    floor_id: state.floor,
  };
});
const router = useRouter();
const oldParkingId = ref(null)
const postItem = async () => {
  try {
    loading.value = true;
    let response = null
    if (oldParkingId.value) {
      response = await ParkingService.update(oldParkingId.value, parkingData.value);
    } else {
      response = await ParkingService.create(parkingData.value);
    }
    if (response?.data?.barcode) {
      router.push("/parking-checkin/" + response.data.barcode);
    }
    serverErrors.value = {};
    handleReset();
  } catch (error) {
  console.log(12345, error);
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
  try {
    loading.value = true;
    const { data } = await PlaceService.getAll("");
    places.value = data;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
const slots = ref([]);

const getSlots = async () => {
  // const { data } = await SlotService.getAll(`?include=s.floor&category_id=${state.category}`);
  // slots.value = data;
};
const categories = ref([]);
const getCategories = async () => {
  loading.value = true;
  try {
    state.category = "";
    const { data } = await CategoryService.getAll(`?place_id=${state.place}`);
    categories.value = data;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
const floors = ref([]);

const getFloors = async () => {
  selectedSlot.value = null;
  let query = `?include=f.slots`;
  if (state.place) {
    query += `&place_id=${state.place}`;
  }
  try {
    loading.value = true;
    const { data } = await FloorService.getAll(query);
    floors.value = data;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};
const handlePlaceChange = () => {
  getCategories();
  getFloors();
};
const getSlotClasses = (slot) => {
  let className = "";
  if (slot.status == "available") {
    if (selectedSlot.value && selectedSlot.value.id == slot.id) {
      className = "bg-blue-500";
    } else {
      className = "bg-green-500";
    }
    className += " cursor-pointer";
  } else {
    className = "bg-yellow-500 pointer-events-none cursor-not-allowed";
  }
  return className;
};
const handleSelectedSlot = (slot) => {
  if (selectedSlot.value && selectedSlot.value.id == slot.id) {
    selectedSlot.value = null;
    state.slot = null;
    state.floor = null;
  } else {
    selectedSlot.value = slot;
    state.slot = slot.id;
    state.floor = slot.floor_id;
  }
};
const search = async () => {
  let query = '?include=p.category'
  if (state.vehicleNumber) {
    query += `&query=${state.vehicleNumber}`
  }
  const result = await ParkingService.getAll(query)
  if (result?.data?.length) {
    const data = result.data[0]
    oldParkingId.value = data.id
    state.vehicleNumber = data.vehicle_no
    state.driverName = data.driver_name
    state.driverMobile = data.driver_mobile
    // categories.value.push(data.category)
    // state.category = data.category_id
  }
  // vehicle_no: state.vehicleNumber,
  //   driver_name: state.driverName,
  //   driver_mobile: state.driverMobile,
  //   place_id: state.place,
  //   category_id: state.category,
  //   slot_id: state.slot,
  //   floor_id: state.floor,
  // loadExistingData(searchQuery.value);
};
const debouncedSearch = useDebounce(search, 500);
onMounted(() => {
  getPlaces();
  getFloors();
});

const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
</script>

<template>
  <section class="max-w-2xl">
    <Loading v-if="loading" />
    <form @submit.prevent="onSubmit" ref="formRef" class="grid gap-3">
      <section class="grid grid-cols-1 gap-3">
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Vehicle Number<span class="text-red-500">*</span></label
          >
          <input
            :class="inputClass"
            v-model="state.vehicleNumber"
            type="text"
            @input="debouncedSearch"
            placeholder="e.g. Ka-12345"
          />
          <ErrorMessage :errors="validator.vehicleNumber.$errors" />
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
            @change="handlePlaceChange"
          >
            <option disabled :value="''">Select place</option>
            <option v-for="place in places" :key="place.id" :value="place.id">
              {{ place.name }}
            </option>
            <!-- Add more options as needed -->
          </select>
          <ErrorMessage :errors="validator.place.$errors" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Category<span class="text-red-500">*</span></label
          >
          <select
            class="focus:outline-none bg-none"
            :class="inputClass"
            style="background: none"
            name="place"
            v-model="state.category"
            @change="getSlots"
          >
            <option disabled :value="''">Select vehicle category</option>
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
          <label class="text-gray-500">Driver Name</label>
          <input
            :class="inputClass"
            v-model="state.driverName"
            type="text"
            placeholder="e.g. John Doe"
          />
          <ErrorMessage :errors="validator.driverName.$errors" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500">Driver Mobile</label>
          <input
            :class="inputClass"
            v-model="state.driverMobile"
            type="text"
            placeholder="e.g. 01587616484"
          />
          <ErrorMessage :errors="validator.driverMobile.$errors" />
        </div>
        <div class="grid gap-2">
          <label class="text-gray-500"
            >Slot<span class="text-red-500">*</span></label
          >
          <ul class="grid gap-2">
            <li v-for="(floor, index) in floors" :key="floor.id">
              {{ floor.name }}
              <ul class="grid grid-cols-6 gap-2">
                <li
                  v-for="(slot, i) in floor.slots"
                  :key="slot.id"
                  class="flex flex-col gap-1 items-center p-4 border text-white rounded-md"
                  :class="getSlotClasses(slot)"
                  @click="handleSelectedSlot(slot)"
                >
                  <div>{{ slot.name }}</div>
                  <div>
                    <svg
                      class="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <title>car-select</title>
                      <path
                        fill="white"
                        d="M5 13L6.5 8.5H17.5L19 13M17.5 18C16.7 18 16 17.3 16 16.5S16.7 15 17.5 15 19 15.7 19 16.5 18.3 18 17.5 18M6.5 18C5.7 18 5 17.3 5 16.5S5.7 15 6.5 15 8 15.7 8 16.5 7.3 18 6.5 18M18.9 8C18.7 7.4 18.1 7 17.5 7H6.5C5.8 7 5.3 7.4 5.1 8L3 14V22C3 22.6 3.4 23 4 23H5C5.6 23 6 22.6 6 22V21H18V22C18 22.6 18.4 23 19 23H20C20.6 23 21 22.6 21 22V14M8 1L12 5.5L16 1Z"
                      />
                    </svg>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <!-- <select
            class="focus:outline-none bg-none"
            :class="inputClass"
            style="background: none"
            name="place"
            v-model="state.slot"
          >
            <option disabled :value="''">Select a slot</option>
            <option v-for="slot in slots" :key="slot.id" :value="slot.id">
              {{ slot.name }}
            </option>
          </select> -->
          <ErrorMessage :errors="validator.slot.$errors" />
        </div>
      </section>
      <ul>
        <li v-for="item in serverErrors" :key="item">
          <span class="text-red-500">
            -{{ item?.length ? item.toString() : 2 }}
          </span>
        </li>
      </ul>
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
