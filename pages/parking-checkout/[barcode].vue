<template>
  <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div v-if="!loadingError && !isLoading">
            <div
              v-if="list && list?.length > 0"
              class="grid grid-cols-2 justify-center"
            >
              <div>
                <div
                  class="mt-1 rounded-lg bg-gray-50 px-4 py-2"
                >
                  <div class="relative w-full">
                    <img
                      :src="'data:image/png;base64,' + barcodeImage"
                      alt=""
                    />
                    <div
                      class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"
                    />
                  </div>

                  <dl
                    class="mt-6 space-y-4"
                    v-for="(item, index) in list"
                    :key="index"
                  >
                    <div
                      class="flex items-center justify-between border-t border-gray-200 pt-4"
                      v-for="(value, key) in item"
                      :key="key"
                    >
                      <dt class="text-sm text-gray-600">
                        {{ key }}
                      </dt>
                      <dd class="text-sm font-medium text-gray-900">
                        {{ value }}
                      </dd>
                    </div>
                    <!-- <div
                      class="flex items-center justify-between border-t border-gray-200 pt-4"
                    >
                      
                    </div> -->
                  </dl>

                  <div class="mt-6">
                    <button
                      type="submit"
                      class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      Print
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-10">
              <p class="text-xl text-gray-400">
                {{ serverErrors }}
              </p>
            </div>
          </div>
          <div v-if="!loadingError && isLoading">
            Loading
            <!-- <ListLoader /> -->
          </div>
          <div v-if="loadingError && !isLoading">
            Loading error
            <!-- <ListLoadingError :message="'cant_load_orders_list'" /> -->
          </div>
        </div>
      </div>
    </div>
    <!-- <Pagination
      class="mt-6"
      :perPage="perPage"
      :lastPage="lastPage"
      :total="total"
      :totalPerPage="totalPerPage"
      @onChange="onPageChanged"
    /> -->
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Link from "@/components/common/Link.vue";
import Pagination from "@/components/common/Pagination.vue";
import { ParkingService } from "~/services/ParkingService";

const list = ref([]);
const loadingError = ref(null);
const isLoading = ref(false);
const serverErrors = ref(null);

//pagination
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);

const route = useRoute();
const barcode = route.params.barcode;

const searchQuery = computed(() => {
  return `?barcode=${barcode}&include=p.slot,p.category,p.place`;
});

const barcodeImage = ref("");
const loadData = async () => {
  try {
    isLoading.value = true;
    const { data } = await ParkingService.getAll(searchQuery.value);
    if (data?.length) {
      list.value = data.map((item) => {
        return {
          "Vehicle Number": item.vehicle_no,
          Place: item.place?.name,
          Category: item.category?.name,
          Floor: item.floor?.name,
          Slot: item.slot?.name,
          "Driver Name": item.driver_name,
          "driver Mobile": item.driver_mobile,
          "In-Time": item.in_time,
        };
      });
      barcodeImage.value = data[0].barcode_image;
      serverErrors.value = {};

    }else {
        serverErrors.value = 'No data available for this barcode'
    }

    // page.value = meta.current_page;
    // lastPage.value = meta.last_page;
    // total.value = meta.total;
    // totalPerPage.value = data.length;

    // handleReset();
  } catch (error) {
    console.log(error);
    if (error.response?._data?.errors) {
      serverErrors.value = error.response._data.errors;
    } else if (error.response?.data?.errors) {
      serverErrors.value = error.response?.data.errors;
    }
  } finally {
    isLoading.value = false;
  }
};

const onPageChanged = (p) => {
  page.value = p;
  loadData();
};
onMounted(() => {
  loadData();
});
</script>
