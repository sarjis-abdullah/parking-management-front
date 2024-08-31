<template>
  <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <div class="md:mt-8 flow-root">
      <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <!-- <OrderFilters
          v-if="showFilterButton"
          :title="title"
          :showFilterButton="showFilterButton"
          :pdfLoading="pdfLoading"
          @filterOrderBy="filterOrderBy"
          @downloadOrderStatement="downloadOrderStatement"
        /> -->
          
          <Titlebar title="parking">
            <div v-if="list && list?.length > 0" class="flex items-center gap-2">
              <input
                :class="inputClass"
                v-model="searchText"
                @input="debouncedSearch"
                type="text"
                placeholder="e.g. Search by Barcode"
              />
              <XMarkIcon
                v-if="searchText"
                @click="
                  () => {
                    searchText = '';
                    loadData();
                  }
                "
                class="h-5 w-5 text-red-500 cursor-pointer"
                aria-hidden="true"
              />
            </div>
          </Titlebar>
          <div v-if="!loadingError && !isLoading" class="overflow-x-auto">
            <table
              class="min-w-full divide-y divide-gray-300"
              v-if="list && list?.length > 0"
            >
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Barcode
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Vehicle number
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Timing
                  </th>
                  <!-- <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Out time
                  </th> -->

                  <!-- <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Driver Info
                  </th> -->
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Payment Method
                  </th>
                  <!-- <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Payment method
                  </th> -->
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <SingleData
                  v-for="singleData in list"
                  :key="singleData.id"
                  :singleData="singleData"
                ></SingleData>
              </tbody>
            </table>
            <div v-else class="text-center py-10">
              <p class="text-xl text-gray-400">No data available</p>
            </div>
          </div>
          <div v-if="!loadingError && isLoading">
            <!-- <Loading /> -->
          </div>
          <div v-if="loadingError && !isLoading">
            Loading error
            <!-- <ListLoadingError :message="'cant_load_orders_list'" /> -->
          </div>
        </div>
      </div>
    </div>
    <Loading v-if="isLoading" />
    <Pagination
      class="mt-6"
      :perPage="perPage"
      :lastPage="lastPage"
      :total="total"
      :totalPerPage="totalPerPage"
      @onChange="onPageChanged"
    />
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Link from "@/components/common/Link.vue";
import Pagination from "@/components/common/Pagination.vue";
import Loading from "@/components/common/Loading.vue";
import SingleData from "@/components/parking/SingleData.vue";
import { ParkingService } from "@/services/ParkingService.js";
import { XMarkIcon, PlusIcon } from "@heroicons/vue/24/outline";
import { useDebounce } from "~/hooks/useDebounce";
import Titlebar from "@/components/common/Titlebar.vue";

definePageMeta({
  layout: "auth-layout",
});
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";

const list = ref([]);
const loadingError = ref(null);
const isLoading = ref(true);
const serverErrors = ref(null);
const viweOn = ref(false);
const route = useRoute();

//pagination
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);

const searchQuery = computed(() => {
  let query = "";
  if (route?.query?.barcode) {
    query += "&barcode=" + route?.query?.barcode;
  }
  return `?page=${page.value}&per_page=${perPage.value}&include=c.place,p.payment,p.vehicle${query}`;
});

const loadData = async (query = searchQuery.value) => {
  try {
    isLoading.value = true;
    const { meta, data } = await ParkingService.getAll(query);
    list.value = data;

    page.value = meta.current_page;
    lastPage.value = meta.last_page;
    total.value = meta.total;
    totalPerPage.value = data.length;

    serverErrors.value = {};
    // handleReset();
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    isLoading.value = false;
    viweOn.value = true;
  }
};
//search
const searchText = ref("");
const search = async () => {
  const q = searchText.value
    ? searchQuery.value + `&query=${searchText.value}`
    : searchQuery.value;
  loadData(q);
};
const debouncedSearch = useDebounce(search, 500);

const onPageChanged = (p) => {
  page.value = p;
  loadData();
};
onMounted(() => {
  if (route?.query?.barcode) {
    searchText.value = route?.query?.barcode;
  }
  loadData();
});
</script>
