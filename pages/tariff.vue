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
            <h6>{{ "Tariff List" }}</h6>
            <Link to="/add/tariff"> Add Tariff </Link>
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
                    Start date
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    End date
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Rates
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
                            v-model="record.name"
                            type="text"
                            placeholder="e.g. Tariff: Eid parking"
                          />
                        </div>
                        <div v-else class="font-medium text-gray-900">
                          {{ singleData.name }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <div v-if="singleData.editMode">
                      <input
                        :class="inputClass"
                        v-model="record.startDate"
                        type="date"
                        :min="getTodayDate()"
                        placeholder="e.g. 20/01/2024"
                      />
                    </div>
                    <span v-else class="text-gray-900">{{
                      singleData?.start_date
                        ? formatDate(singleData.start_date, "DD-MM-YYYY")
                        : "--"
                    }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div v-if="singleData.editMode">
                      <input
                        :class="inputClass"
                        v-model="record.endDate"
                        type="date"
                        :min="getTodayDate()"
                        placeholder="e.g. 20/01/2024"
                      />
                    </div>
                    <span v-else>
                      {{
                        singleData?.end_date
                          ? formatDate(singleData.end_date, "DD-MM-YYYY")
                          : "--"
                      }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    {{ singleData.default ? "Default" : "" }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <!-- Display payment rates -->
                    <ul>
                      <li
                        v-for="(item, index) in singleData.parking_rates"
                        :key="item.id"
                      >
                        <span v-if="singleData?.parking_rates?.length == 1">
                          Each half hour rate {{ item.rate }} taka
                        </span>
                        <span v-else>
                          {{
                            index == 0 ? "First half hour" : "Next half hour"
                          }}
                          {{ item.rate }} taka
                        </span>
                      </li>
                    </ul>
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
    <Error :error="serverErrors" />
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
<script setup>
import { onMounted, reactive, ref } from "vue";
import Link from "@/components/common/Link.vue";
import Pagination from "@/components/common/Pagination.vue";
import { TariffService } from "@/services/TariffService.js";
import { formatDate } from "@/utils/index";
import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/vue/20/solid";
import Loading from "@/components/common/Loading.vue";
import ClientErrors from "@/components/common/ClientErrors.vue";
import Error from "@/components/common/Error.vue";

definePageMeta({
  layout: "auth-layout",
});
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";

const list = ref([]);
const loadingError = ref(null);
const isLoading = ref(false);
const serverErrors = ref(null);

//pagination
const page = ref(1);
const perPage = ref(2);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const searchQuery = computed(() => {
  return `?page=${page.value}&per_page=${perPage.value}&include=t.parking_rates`;
});

const loadData = async () => {
  try {
    isLoading.value = true;
    const { meta, data } = await TariffService.getAll(searchQuery.value);
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
  try {
    isDeleting.value = true;
    const res = await TariffService.delete(id);
    list.value = list.value.filter((item) => item.id != id);

    serverErrors.value = {};
    // handleReset();
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    isDeleting.value = false;
  }
};
const record = reactive({
  id: "",
  name: "",
  startDate: "",
  endDate: "",
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
  record.name = props.name;
  record.startDate = formatDateForInput(props.start_date);
  record.endDate = formatDateForInput(props.end_date);
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
    name: record.name,
    start_date: record.startDate,
    end_date: record.endDate,
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
    const res = await TariffService.put(id, updateableRecord.value);
    list.value = list.value.map((item) => {
      if (item.id == id) {
        item.name = record.name;
        item.start_date = record.startDate;
        item.end_date = record.endDate;
        item.editMode = false
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

const onPageChanged = (p) => {
  page.value = p;
  loadData();
};
onMounted(() => {
  loadData();
});
</script>
