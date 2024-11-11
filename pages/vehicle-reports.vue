<script setup>
import { computed, ref, watch, onMounted } from "vue";
import moment from "moment";
import { ReportService } from "@/services/ReportService";
import { formatDate } from "@/utils/index";
import { VehicleService } from "~/services/VehicleService";
import { useDebounce } from "~/hooks/useDebounce";
import Loading from "@/components/common/Loading.vue";
import Pagination from "@/components/common/Pagination.vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { PaymentService } from "~/services/PaymentService";
import AutoComplete from "@/components/common/AutoComplete.vue";

definePageMeta({
  layout: "auth-layout",
});
const inputClass =
  "relative block w-full appearance-none rounded-md border-2 border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
const selecboxClass =
  "relative block w-full appearance-none px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10";
const selectWrapper =
  "rounded-md border-2 border-gray-300 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
const route = useRoute();
const router = useRouter();
const startDate = ref("");
const endDate = ref("");
const paymentType = ref("");
const paymentStatus = ref("");
const transactions = ref([]);
const isLoading = ref(false);
const perPage = ref(50);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);
const page = ref(1);

function getQueryString(query) {
  const filteredQuery = {};

  // Filter out null and undefined values
  for (const key in query) {
    if (query[key] !== null && query[key] !== undefined) {
      filteredQuery[key] = query[key];
    }
  }

  const params = new URLSearchParams(filteredQuery);
  return `?${params.toString()}`;
}

const vehicleNumber = ref("");
const vehicleList = ref([]);

const search = async () => {
  let query = "";
  if (vehicleNumber.value) {
    query += `?query=${vehicleNumber.value}`;
    const newQuery = {
      ...route.query,
    };
  }
  const result = await VehicleService.getAll(query);
  if (result?.data?.length) {
    vehicleList.value = result.data;
  }
};
const vehicleId = ref(null);
const checkSelection = () => {
  const data = vehicleList.value.find(
    (item) => item.number == vehicleNumber.value
  );
  if (data) {
    vehicleId.value = data.id;
  }
};
const debouncedSearch = useDebounce(search, 500);
const serverErros = ref({});
const activeReport = ref(false);

const vehicleEntryReports = ref([]);
const getVehicleEntryReports = (extraQuery = "") => {
  isLoading.value = true;
  activeReport.value = true;
  setTimeout(async () => {
    try {
      let q = ''
      if (extraQuery) {
        query += extraQuery;
      }
      q += getQueryString(route.query) +
        `&page=${page.value}&per_page=${perPage.value}`;
      console.log(extraQuery, 'extraQuery');
        

      console.log(q, 12345);
      const res = await ReportService.getVehicle(q);
      vehicleEntryReports.value = res.data.data;
      const meta = res.data;
      page.value = meta.current_page;
      lastPage.value = meta.last_page;
      total.value = meta.total;
      totalPerPage.value = res.data.data.length;
    } catch (error) {
      serverErros.value = error.errors;
    } finally {
      isLoading.value = false;
    }
  }, 500);
};
const details = ref([]);
const entryDate = ref("");
const showDetails = async (date) => {
  try {
    entryDate.value = date;
    // const q =
    //       getQueryString(route.query) +
    //       `&page=${page.value}&per_page=${perPage.value}`;
    const q = `?entry_date=${date}`;
    isLoading.value = true;
    const res = await ReportService.getDetailVehicleReport(q);
    console.log(res.data);
    details.value = res.data.details;
    // vehicleEntryReports.value = res.data.data;
    // const meta = res.data;
    // page.value = meta.current_page;
    // lastPage.value = meta.last_page;
    // total.value = meta.total;
    // totalPerPage.value = res.data.data.length;
  } catch (error) {
    serverErros.value = error.errors;
  } finally {
    isLoading.value = false;
  }
};
const client = ref("");
const handleChosen = (item) => {
  vehicleId.value = item.id;

  const newQuery = { ...route.query };
  newQuery.vehicle_id = vehicleId.value;
  router.push({ query: newQuery });
};
const resetSearch = () => {
  const newQuery = {
    ...route.query,
  };
  if (newQuery.vehicle_id) {
    delete newQuery.vehicle_id;
    activeReport.value = false;
    router.push({ query: newQuery });
  }
};

watch(
  route,
  (o, n) => {
    if (route.query) {
      const newQuery = {
        ...route.query,
      };
      console.log(route.query);
      if (route.query.start_date) {
        newQuery.start_date = route.query.start_date;
      }
      if (route.query.end_date) {
        newQuery.end_date = route.query.end_date;
      }
      if (route.query.vehicle_id) {
        newQuery.vehicle_id = route.query.vehicle_id;
        vehicleId.value = route.query.vehicle_id;
      }
      if (route.query.status) {
        newQuery.status = route.query.status;
        paymentStatus.value = route.query.status;
      }
      if (route.query.payment_type) {
        newQuery.payment_type = route.query.payment_type;
        paymentType.value = route.query.payment_type;
      }

      router.push({ query: newQuery });
    }
  },
  { deep: false, immediate: true }
);

watch(
  [startDate, endDate, vehicleId],
  (
    [newStartDate, newEndDate, newVehicleId],
    [oldStartDate, oldEndDate, oldVehicleId]
  ) => {
    const newQuery = { ...route.query };

    if (newStartDate !== oldStartDate) {
      if (newStartDate) {
        newQuery.start_date = newStartDate;
      } else {
        delete newQuery.start_date;
      }
    }

    if (newEndDate !== oldEndDate) {
      if (newEndDate) {
        newQuery.end_date = newEndDate;
      } else {
        delete newQuery.end_date;
      }
    }
    if (newVehicleId !== oldVehicleId) {
      if (newVehicleId) {
        newQuery.vehicle_id = newVehicleId;
      } else {
        delete newQuery.vehicle_id;
      }
    }
    activeReport.value = false;
    router.push({ query: newQuery });
  },
  { deep: true, immediate: false }
);

const removeSelectedVehicleId = () => {
  vehicleId.value = null;
  vehicleNumber.value = "";
};
const getPaidAmount = (item) => {
  const amount = parseFloat(item.total_paid) + parseFloat(item.discount_amount);
  return Number(amount).toFixed(2);
};
const repayLoading = ref(false);
const payDUe = async (id) => {
  repayLoading.value = true;
  try {
    const result = await PaymentService.payDue(id);

    if (result?.data?.redirect_url) {
      window.location.href = result.data.redirect_url;
    }
  } catch (error) {
  } finally {
  }
};

const getStatusWiseColor = ({ status, payment_type }) => {
  if (status == "success") {
    if (payment_type == "partial") {
      return "bg-orange-400";
    }
    return "bg-green-500 ";
  } else if (status == "pending") {
    return "bg-yellow-600";
  }
  return "bg-red-600";
};

const repay = async (id) => {
  repayLoading.value = true;
  try {
    const result = await PaymentService.repay(id);

    // print();
    if (result?.data?.redirect_url) {
      window.location.href = result.data.redirect_url;
    } else {
      // vehicle.value = { ...result?.data?.vehicle, status: "checked_out" };
    }
  } catch (error) {
  } finally {
  }
};
const onPageChanged = (p) => {
  page.value = p;
  getVehicleEntryReports();
  // loadData();
};
const handlePerpageChange = () => {
  getVehicleEntryReports();
  // loadData();
};

onMounted(() => {
  startDate.value = formatDate(moment().subtract(1, "month"), "YYYY-MM-DD");
  endDate.value = formatDate(moment(), "YYYY-MM-DD");
  const newQuery = {
    ...route.query,
  };

  newQuery.start_date = startDate.value;
  newQuery.end_date = endDate.value;
  router.push({ query: newQuery });
});
</script>
<template>
  <section>
    <section class="grid md:grid-cols-4 gap-2">
      <div class="grid gap-2">
        <label class="text-gray-500">Start date</label>
        <input
          :class="inputClass"
          v-model="startDate"
          type="date"
          placeholder="e.g. 20/01/2024"
        />
      </div>
      <div class="grid gap-2">
        <label class="text-gray-500">End date</label>
        <input
          :class="inputClass"
          v-model="endDate"
          type="date"
          placeholder="e.g. 20/12/2024"
        />
      </div>
      <div class="grid gap-2">
        <label class="text-gray-500"
          >Vehicle Number<span class="text-red-500">*</span></label
        >
        <AutoComplete
          v-model="client"
          @chosen="handleChosen"
          @resetSearch="resetSearch"
          placeholder="Search for vehicle"
        ></AutoComplete>
      </div>
      <div class="grid gap-2" v-if="false">
        <label class="text-gray-500"
          >Vehicle Number<span class="text-red-500">*</span></label
        >
        <div
          class="flex justify-between items-center gap-2"
          :class="selectWrapper"
        >
          <div class="w-full">
            <input
              :class="selecboxClass"
              class="focus:outline-none"
              v-model="vehicleNumber"
              type="text"
              @input="debouncedSearch"
              @change="checkSelection"
              placeholder="e.g. Ka-12345"
              list="cityname"
            />
            <!-- <input type="text" name="city" list="cityname" /> -->
            <datalist id="cityname">
              <option
                v-for="item in vehicleList"
                :key="item.id"
                :value="item.number"
              ></option>
            </datalist>
          </div>
          <div v-if="vehicleId">
            <XMarkIcon
              @click="removeSelectedVehicleId"
              class="h-5 w-5 text-red-500 cursor-pointer mr-2"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <div class="flex items-end">
        <button
          :disabled="isLoading"
          @click="getVehicleEntryReports('')"
          class="text-white px-2 py-2 rounded-md w-full cursor-pointer"
          :class="activeReport ? 'bg-indigo-600' : 'bg-gray-600'"
        >
          Apply
        </button>
      </div>
    </section>

    <section>
      <header
        class="flex"
        :class="
          vehicleEntryReports?.length ? 'justify-between' : 'justify-center'
        "
      >
        <div>
          <h2
            style="text-align: center; margin-top: 20px"
            class="text-2xl font-bold text-gray-800 p-4"
          >
            Vehicle entry reports
          </h2>
        </div>
        <section
          class="flex items-end gap-2 p-4"
          v-if="vehicleEntryReports?.length"
        >
          <button
            :disabled="isLoading"
            @click="getVehicleEntryReports('&format=pdf')"
            class="border px-2 py-1 rounded-md cursor-pointer"
          >
            Download PDF
          </button>
          <button
            :disabled="isLoading"
            @click="downloadCsv"
            class="border px-2 py-1 rounded-md cursor-pointer"
          >
            Download CSV
          </button>
        </section>
      </header>
      <table
        style="width: 100%; border-collapse: collapse; margin-bottom: 20px"
      >
        <thead>
          <tr>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              SL No.
            </th>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              Date
            </th>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              Vehicle entries count
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Dummy Data for reports -->
          <tr v-for="(item, index) in vehicleEntryReports" :key="index">
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              {{ index + 1 }}
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              {{ item.entry_date }}
            </td>

            <td
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                display: flex;
                gap: 1rem;
                justify-content: center;
              "
            >
              <span class="text-3xl">{{ item.vehicle_entries }}</span>
              <button
                class="text-white px-2 py-1 rounded-md bg-indigo-400"
                :disabled="isLoading"
                @click="showDetails(item.entry_date)"
              >
                Details
              </button>
            </td>
          </tr>
          <tr v-if="vehicleEntryReports.length == 0">
            <td
              colspan="5"
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </section>
  <Loading
    v-if="isLoading"
    parentClass="h-[50vh] flex  justify-center items-center"
  />
  <Pagination
    class="mt-6"
    :perPage="perPage"
    :lastPage="lastPage"
    :total="total"
    :totalPerPage="totalPerPage"
    @onChange="onPageChanged"
  >
    <div>
      <div class="text-xs">Per page</div>
      <select
        v-model="perPage"
        :class="selecboxClass"
        @change="handlePerpageChange"
        class="focus:outline-none rounded-md text-center"
        style="padding: 0"
      >
        <option :value="2">2</option>
        <option :value="10">10</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
        <option :value="500">500</option>
      </select>
    </div>
  </Pagination>

  <section v-if="!isLoading && details?.length">
    <h2 style="text-align: center; margin-top: 20px; padding: 1rem">
      Details ({{ entryDate }})
    </h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px">
      <thead>
        <tr>
          <th
            style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              background-color: #f2f2f2;
            "
          >
            In/out time
          </th>
          <th
            style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              background-color: #f2f2f2;
            "
          >
            Vehicle Info
          </th>
          <th
            style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              background-color: #f2f2f2;
            "
          >
            Driver Info
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Dummy Data for reports -->
        <tr v-for="(item, index) in details" :key="index">
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            <div>
              <div>In: {{ item.in_time }}</div>
              <div>Out: {{ item.out_time }}</div>
            </div>
          </td>

          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            {{ item.vehicle?.number }}
          </td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            <div>
              <div>{{ item.vehicle?.driver_mobile }}</div>
              <div>{{ item.vehicle?.driver_name }}</div>
            </div>
          </td>
        </tr>
        <tr v-if="details.length == 0">
          <td
            colspan="5"
            style="border: 1px solid #ddd; padding: 8px; text-align: center"
          >
            No details available
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style lang="scss" scoped></style>
