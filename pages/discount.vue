<script setup>
import { onMounted, reactive, ref } from "vue";
import Link from "@/components/common/Link.vue";
import Pagination from "@/components/common/Pagination.vue";
import { TariffService } from "@/services/TariffService.js";
import { formatDate } from "@/utils/index";
import Titlebar from "@/components/common/Titlebar.vue";

import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/vue/20/solid";
import Loading from "@/components/common/Loading.vue";
import ClientErrors from "@/components/common/ClientErrors.vue";
import ServerError from "@/components/common/Error.vue";
import { DiscountService } from "~/services/DiscountService";

definePageMeta({
  layout: "auth-layout",
});
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";

const list = ref([]);
const loadingError = ref(null);
const isLoading = ref(true);
const serverErrors = ref(null);

//pagination
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);

const searchQuery = computed(() => {
  return `?page=${page.value}&per_page=${perPage.value}`;
});

const loadData = async () => {
  try {
    isLoading.value = true;
    const { meta, data } = await DiscountService.getAll(searchQuery.value);
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
  }
};

const isDeleting = ref(false);
const deleteRecord = async (id) => {
  if (confirm("Are you sure to delete this record?")) {
    try {
      isDeleting.value = true;
      const res = await DiscountService.delete(id);
      list.value = list.value.filter((item) => item.id != id);

      serverErrors.value = {};
      // handleReset();
    } catch (error) {
      serverErrors.value = error.errors;
    } finally {
      isDeleting.value = false;
    }
  }
};
const record = reactive({
  id: "",
  promoCode: "",
  isActive: false,
});
const formatDateForInput = (date) => {
  if (!date) {
    return "";
  }
  const match = date.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
};
const editRecord = (props) => {
  record.id = props.id;
  record.promoCode = props.promo_code;
  record.isActive = props.is_active ? true : false;
  // record.startDate = formatDateForInput(props.start_date);
  // record.endDate = formatDateForInput(props.end_date);
  list.value = list.value.map((item) => {
    if (item.id == props.id) {
      return {
        ...item,
        editMode: true,
      };
    }
    return {
      ...item,
      editMode: false,
    };
  });
};
const isUpdating = ref(false);
const updateableRecord = computed(() => {
  return {
    promo_code: record.promoCode,
    is_active: record.isActive,
  };
});
const cancelUpdatingRecord = async (id) => {
  list.value = list.value.map((item) => {
    return {
      ...item,
      editMode: false,
    };
  });
};
const updateRecord = async (id) => {
  try {
    isUpdating.value = true;
    const res = await DiscountService.put(id, updateableRecord.value);
    list.value = list.value.map((item) => {
      if (item.id == id) {
        item.promo_code = record.promoCode;
        item.is_active = record.isActive;
        // item.end_date = record.endDate;
        // item.default = record.default;
        item.editMode = false;
        return item;
      }
      // if (record.default) {
      //   item.default = false;
      // }
      return item;
    });

    serverErrors.value = {};
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    isUpdating.value = false;
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
<template>
  <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <div class="md:mt-8 flow-root">
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
        <Titlebar title="Discount"></Titlebar>

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
                    Promo code
                  </th>
                  <th
                    scope="col"
                    class="py-3.5 pl-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                  Active Status
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="singleData in list" :key="singleData.id">
                  <!-- <pre>{{ record }}</pre> -->
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center">
                      <div class="ml-4">
                        <div
                          v-if="singleData.editMode"
                          class="mt-1 text-gray-500"
                        >
                          <input
                            :class="inputClass"
                            v-model="record.promoCode"
                            type="text"
                            placeholder="e.g. Tariff: Eid parking"
                          />
                        </div>
                        <div v-else class="font-medium text-gray-900">
                          {{ singleData.promo_code }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <!-- <div v-if="singleData.editMode">
                      <input
                        :class="inputClass"
                        v-model="record.amount"
                        type="number"
                        placeholder="e.g. 10/15/20 etc."
                      />
                    </div> -->
                    <span class="text-gray-900">
                      {{ singleData?.amount }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <span class="text-gray-900">
                      {{ singleData?.type ?? singleData?.discount_type }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <div
                      v-if="singleData.editMode"
                      class="flex items-center gap-1 mt-1 text-gray-500"
                    >
                      <input
                        v-model="record.isActive"
                        type="checkbox"
                        value=""
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label class="text-gray-500">Activate Discount</label>
                    </div>
                    <span v-else class="text-gray-900">{{
                      singleData.is_active ? "Active" : "Inactive"
                    }}</span>
                  </td>
                  <td
                    class="flex justify-center gap-1 relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                  >
                    <TrashIcon
                      @click="deleteRecord(singleData.id)"
                      class="h-5 w-5"
                      aria-hidden="true"
                    />
                    <PencilIcon
                      @click="editRecord(singleData)"
                      class="h-5 w-5"
                      aria-hidden="true"
                    />
                    <CheckIcon
                      v-if="singleData?.editMode"
                      @click="updateRecord(singleData.id)"
                      class="h-5 w-5 text-blue-500"
                      aria-hidden="true"
                    />
                    <XMarkIcon
                      v-if="singleData?.editMode"
                      @click="cancelUpdatingRecord(singleData.id)"
                      class="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center py-10">
              <p class="text-xl text-gray-400">No data available</p>
            </div>
          </div>
          <div v-if="!loadingError && isLoading">
            <Loading />
          </div>
          <div v-if="loadingError && !isLoading">
            Loading error
            <!-- <ListLoadingError :message="'cant_load_orders_list'" /> -->
          </div>
        </div>
      </div>
    </div>
    <ServerError :error="serverErrors" />
    <Pagination
      class="mt-6"
      :perPage="perPage"
      :lastPage="lastPage"
      :total="total"
      :totalPerPage="totalPerPage"
      @onChange="onPageChanged"
    />
    <Loading v-if="isLoading || isDeleting || isUpdating" />
  </div>
</template>
