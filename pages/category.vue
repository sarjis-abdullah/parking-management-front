<template>
  <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <!-- <OrderFilters
          v-if="showFilterButton"
          :title="title"
          :showFilterButton="showFilterButton"
          :pdfLoading="pdfLoading"
          @filterOrderBy="filterOrderBy"
          @downloadOrderStatement="downloadOrderStatement"
        /> -->
          <header class="flex justify-between text-gray-900 mb-3 text-xl">
            <h6>{{ "Place List" }}</h6>
            <Link to="/add/place"> Add Place </Link>
          </header>
          <!-- <pre>
          {{ list }}
        </pre> -->
          <div v-if="!loadingError && !isLoading">
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
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Descripton
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Place
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="SingleData in list" :key="SingleData.id">
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <img
                          class="h-10 w-10 rounded-full"
                          src="https://cdn-staging.inaia.cloud/icons/gold-delivery.png"
                          alt=""
                        />
                      </div>
                      <div class="ml-4">
                        <div class="font-medium text-gray-900">
                          {{ SingleData.name }}
                        </div>
                        <div class="mt-1 text-gray-500">
                          <!-- {{ $d(getExecutionDate(order)) }} -->
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <span class="text-gray-900">{{ SingleData.description }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    {{ SingleData?.place?.name }}
                  </td>
                  <td
                    class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                  >
                    ...
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center py-10">
              <p class="text-xl text-gray-400">
                <!-- {{ $t("you_have_no_transactions") }} -->
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
import { CategoryService } from "@/services/CategoryService.js";

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

const searchQuery = computed(() => {
  return `?page=${page.value}&per_page=${perPage.value}&include=c.place`;
});

const loadData = async () => {
  try {
    isLoading.value = true;
    const { meta, data } = await CategoryService.getAll(searchQuery.value);
    list.value = data;

    page.value = meta.current_page;
    lastPage.value = meta.last_page;
    total.value = meta.total;
    totalPerPage.value = data.length;

    serverErrors.value = {};
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
