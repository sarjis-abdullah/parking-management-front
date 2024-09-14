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
        <label class="text-gray-500">Payment type</label>
        <div :class="selectWrapper" class="flex items-center">
          <select
            class="focus:outline-none bg-none"
            :class="selecboxClass"
            style="background: none"
            name="place"
            v-model="paymentType"
          >
            <option disabled :value="''">Select</option>
            <option value="full">Full</option>
            <option value="partial">Partial</option>
            <!-- Add more options as needed -->
          </select>
          <XMarkIcon
            v-if="paymentType"
            @click="paymentType = ''"
            class="h-5 w-5 text-red-500 cursor-pointer mr-2"
            aria-hidden="true"
          />
        </div>
        <!-- <input
          :class="inputClass"
          v-model="paymentType"
          type="date"
          placeholder="e.g. 20/12/2024"
        /> -->
      </div>
      <div class="grid gap-2">
        <label class="text-gray-500">Payment Status</label>
        <div :class="selectWrapper" class="flex items-center">
          <select
            class="focus:outline-none bg-none"
            :class="selecboxClass"
            style="background: none"
            name="place"
            v-model="paymentStatus"
          >
            <option disabled :value="''">Select</option>
            <option value="success">success</option>
            <option value="failed">failed</option>
            <option value="pending">pending</option>
            <!-- Add more options as needed -->
          </select>
          <XMarkIcon
            v-if="paymentStatus"
            @click="paymentStatus = ''"
            class="h-5 w-5 text-red-500 cursor-pointer mr-2"
            aria-hidden="true"
          />
        </div>
        <!-- <input
          :class="inputClass"
          v-model="paymentType"
          type="date"
          placeholder="e.g. 20/12/2024"
        /> -->
      </div>
      <div class="grid gap-2">
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
      <section class="flex items-end">
        <button
          :disabled="isLoading"
          @click="getTransactions"
          class="text-white px-2 py-1 rounded-md"
          :class="
            activeReport ? 'bg-indigo-600' : 'bg-gray-600'
          "
        >
          Apply
        </button>
      </section>
    </section>
    <section>
      <h2 style="text-align: center; margin-top: 20px; padding: 1rem">
        Date-wise Transactions
      </h2>
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
              Vehicle
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
              Transaction Count
            </th>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              Total Payable
            </th>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              Total Paid
            </th>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              Total Due
            </th>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              Payment type
            </th>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              Payment status
            </th>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody v-if="!isLoading">
          <!-- Dummy Data for Transactions -->
          <tr v-for="(item, index) in transactions" :key="index">
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              {{ index + 1 }}
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              {{ item.vehicle?.number }}
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              {{ item.transaction_date }}
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              {{ item.transaction_count }}
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              {{ item.total_payable }}
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              {{ getPaidAmount(item) }}
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              {{ item.total_due }}
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
              class=""
            >
              <span
                class="px-4 py-1 text-white rounded-md"
                :class="
                  item.payment_type == 'partial'
                    ? ' bg-orange-500'
                    : 'bg-green-400'
                "
              >
                {{ item.payment_type }}
              </span>
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              <span
                class="text-white px-4 py-1 rounded-md"
                :class="getStatusWiseColor(item)"
                >{{ item.status }}</span
              >
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              <div v-if="item.status != 'success'">
                <button
                  :disabled="repayLoading"
                  @click="repay(item.id)"
                  class="bg-indigo-400 text-white rounded-md text-center px-4 py-1"
                >
                  Repay
                </button>
              </div>
              <div v-else-if="item.payment_type == 'partial'">
                <button
                  :disabled="repayLoading"
                  @click="payDUe(item.id)"
                  class="bg-indigo-600 text-white rounded-md text-center px-4 py-1"
                >
                  Pay due
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="transactions.length == 0">
            <td
              colspan="8"
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
</template>

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
const perPage = ref(2);
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
// const isTransactionReport = computed(
//   () => activeReport.value == "transactions"
// );
const getTransactions = () => {
  isLoading.value = true;
  activeReport.value = true
  setTimeout(async () => {
    try {
      const q =
        getQueryString(route.query) +
        `&page=${page.value}&per_page=${perPage.value}`;
      const res = await ReportService.getTransaction(q);
      transactions.value = res.data.data;
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
const vehicleEntryReports = ref([]);
const getVehicleEntryReports = () => {
  isLoading.value = true;
  activeReport.value = "vehicle-entry-reports";
  setTimeout(async () => {
    try {
      const q = getQueryString(route.query);
      const res = await ReportService.getVehicle(q);
      vehicleEntryReports.value = res.data;
    } catch (error) {
      serverErros.value = error.errors;
    } finally {
      isLoading.value = false;
    }
  }, 500);
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

      activeReport.value = false
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
    activeReport.value = false
    router.push({ query: newQuery });
  },
  { deep: true, immediate: false }
);

watch(
  [paymentType, paymentStatus],
  ([newType, newStatus], [oldType, oldStatus]) => {
    if (oldType != newType) {
      paymentType.value = newType;
      if (!newType) {
        const newQuery = { ...route.query };
        delete newQuery.payment_type;
        router.push({ query: newQuery });
      } else {
        const newQuery = { ...route.query };
        newQuery.payment_type = newType;
        router.push({ query: newQuery });
      }
    }

    if (newStatus != oldStatus) {
      paymentStatus.value = newStatus;
      if (!newStatus) {
        const newQuery = { ...route.query };
        delete newQuery.status;
        router.push({ query: newQuery });
      } else {
        const newQuery = { ...route.query };
        newQuery.status = newStatus;
        router.push({ query: newQuery });
      }
    }
    activeReport.value = false
  }
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
  getTransactions();
  // loadData();
};
const handlePerpageChange = () => {
  getTransactions();
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

<style lang="scss" scoped></style>
