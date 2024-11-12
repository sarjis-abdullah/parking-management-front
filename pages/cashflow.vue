<script setup>
import { onMounted } from "vue";
import Link from "@/components/common/Link.vue";
import Pagination from "@/components/common/Pagination.vue";
import Loading from "@/components/common/Loading.vue";
import { PlaceService } from "@/services/PlaceService.js";
import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/vue/20/solid";
import ServerError from "@/components/common/Error.vue";
import Titlebar from "@/components/common/Titlebar.vue";
import { formatDate } from "@/utils/index.js";
import { CashFlowService } from "~/services/CashFlowService";

definePageMeta({
  layout: "auth-layout",
});
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";

const list = ref([]);
const loadingError = ref(null);
const isLoading = ref(true);
const serverErrors = ref(null);
const startDate = ref("");
const endDate = ref("");
const disabledFilterClasses = computed(()=> {
  if (isLoading.value || !startDate.value || !endDate.value) {
    return true
  }
  return false
})
//pagination
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);

const searchQuery = computed(() => {
  let query = `?page=${page.value}&per_page=${perPage.value}&include=p.createdByUser`;
  if (startDate.value && endDate.value) {
    query += `&start_date=${startDate.value}&end_date=${endDate.value}`;
  }
  return query;
});

const loadData = async () => {
  try {
    isLoading.value = true;
    const { meta, data } = await CashFlowService.getAll(searchQuery.value);
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
const isClosing = ref(false);
const deleteRecord = async (id) => {
  if (confirm("Are you sure to delete this record?")) {
    try {
      isClosing.value = true;
      const res = await PlaceService.delete(id);
      list.value = list.value.filter((item) => item.id != id);
      serverErrors.value = {};
      // handleReset();
    } catch (error) {
      serverErrors.value = error.errors;
    } finally {
      isClosing.value = false;
    }
  }
};
const closeCash = async () => {
  if (confirm("Are you sure to close this cash flow for today?")) {
    try {
      isClosing.value = true;
      const res = await CashFlowService.closeCash();
      loadData()
      serverErrors.value = {};
    } catch (error) {
      serverErrors.value = error.errors;
    } finally {
      isClosing.value = false;
    }
  }
};
const record = reactive({
  id: "",
  ending_cash: "",
});
const editRecord = (props) => {
  record.id = props.id;
  record.ending_cash = props.ending_cash;
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
    ending_cash: record.ending_cash,
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
    const res = await CashFlowService.put(id, updateableRecord.value);
    list.value = list.value.map((item) => {
      if (item.id == id) {
        item.ending_cash = record.ending_cash;
        // item.end_date = record.endDate;
        item.editMode = false;
        return item;
      }
      return item;
    });

    serverErrors.value = {};
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    isUpdating.value = false;
  }
};
watch(() => searchQuery.value, (newValue, oldValue) => {
  loadData();
}, {
  immediate: true,
  deep:true
})
const onPageChanged = (p) => {
  page.value = p;
  loadData();
};
onMounted(() => {
  // loadData();
});
</script>
<template>
  <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <div class="md:mt-8 flow-root">
      <section class="grid md:grid-cols-5 gap-2 mb-8">
        <div class="grid gap-2">
          <div class="flex items-end">
            <div class="grid gap-2 w-full">
              <label class="text-gray-500">Start date</label>
              <input
                :class="inputClass"
                v-model="startDate"
                type="date"
                placeholder="e.g. 20/01/2024"
              />
            </div>
          </div>
        </div>

        <div class="grid gap-2">
          <div class="flex items-end">
            <div class="grid gap-2 w-full">
              <label class="text-gray-500">End date</label>
              <input
                :class="inputClass"
                v-model="endDate"
                type="date"
                placeholder="e.g. 20/12/2024"
              />
            </div>
          </div>
        </div>
        <div class="grid gap-2" v-if="endDate && startDate">
          <div>
            <div></div>
            <button
              @click="()=> {
                endDate = ''
                startDate = ''
              }"
              class="text-white px-4 py-2 rounded-md cursor-pointer"
            >
              <XMarkIcon
              class="h-5 w-5 text-red-500 cursor-pointer mr-2 mb-3"
              aria-hidden="true"
            />
            </button>
          </div>
        </div>
      </section>
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
            <h6 class="hidden md:inline-block capitalize">Cashflow List</h6>
            <div
              class="flex items-center flex-col md:flex-row gap-2 w-full md:w-auto"
            >
              <button
                @click="closeCash"
                :disabled="isClosing"
                class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 w-full md:w-auto text-center"
              >
                Cash close
              </button>
              <NuxtLink
                to="/add/cashflow"
                class="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 w-full md:w-auto text-center"
              >
                Add opening balance</NuxtLink
              >
            </div>
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
                    Starting cash
                  </th>
                  <th
                    scope="col"
                    class="py-3.5 pl-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Income
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Ending cash
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Date
                  </th>
                  <!-- <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    Action
                  </th> -->
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="singleData in list" :key="singleData.id">
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center">
                      <div>
                        <div class="font-medium text-gray-900">
                          {{ singleData.starting_cash }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center">
                      <div>
                        <!-- <div
                          v-if="singleData.editMode"
                          class="mt-1 text-gray-500"
                        >
                          <input
                            :class="inputClass"
                            v-model="record.ending_cash"
                            type="number"
                            placeholder="e.g. 100"
                          />
                        </div> -->
                        <div class="font-medium text-gray-900">
                          {{ singleData.income }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center">
                      <div>
                        <div class="font-medium text-gray-900">
                          {{ singleData.ending_cash }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center">
                      <div>
                        <div class="font-medium text-gray-900">
                          {{ formatDate(singleData.date, "DD-MM-YYYY") }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    v-if="false"
                    class="flex justify-center gap-1 relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                  >
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
    <Loading v-if="isLoading || isClosing || isUpdating" />
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
