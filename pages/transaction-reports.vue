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
        <label class="text-gray-500">Payment Method</label>
        <div :class="selectWrapper" class="flex items-center">
          <select
            class="focus:outline-none bg-none"
            :class="selecboxClass"
            style="background: none"
            name="place"
            v-model="paymentMethod"
          >
            <option disabled :value="''">Select</option>
            <option value="cash">Cash</option>
            <option value="ssl_commerz">SSL commerz</option>
            <option value="due">Due</option>
            <!-- Add more options as needed -->
          </select>
          <XMarkIcon
            v-if="paymentMethod"
            @click="paymentMethod = ''"
            class="h-5 w-5 text-red-500 cursor-pointer mr-2"
            aria-hidden="true"
          />
        </div>
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
      <section class="flex items-end gap-2">
        <button
          :disabled="isLoading"
          @click="getTransactions"
          class="text-white px-2 py-1 rounded-md"
          :class="activeReport ? 'bg-indigo-600' : 'bg-gray-600'"
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
            ></th>
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
              Payable
            </th>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              Paid
            </th>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              Discount
            </th>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              Due
            </th>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              Type
            </th>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              Status
            </th>
            <th
              style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                background-color: #f2f2f2;
              "
            >
              Method
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
              <input
                v-if="
                  item.status != 'success' || item.payment_type == 'partial'
                "
                @input="handleSelect(item)"
                type="checkbox"
              />
            </td>
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
              {{ "৳ " + item.total_payable }}
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              {{ "৳ " + getPaidAmount(item) }}
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              {{ "৳ " + item.discount_amount }}
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              {{ "৳ " + item.total_due }}
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
              <span class="px-4 py-1 rounded-md">{{ item.method }}</span>
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              <div v-if="item.payment_type == 'partial'">
                <button
                  :disabled="repayLoading"
                  @click="payDUe(item.id)"
                  class="bg-indigo-600 text-white rounded-md text-center px-4 py-1"
                >
                  Pay due
                </button>
              </div>
              <div v-else-if="item.status != 'success'">
                <button
                  :disabled="repayLoading"
                  @click="repay(item.id)"
                  class="bg-indigo-400 text-white rounded-md text-center px-4 py-1"
                >
                  Repay
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="transactions?.length">
            <td
              colspan="4"
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              Total
            </td>
            <td
              v-for="(total, index) in totals"
              :key="index"
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              {{ "৳ " + Number(total).toFixed(2) }}
            </td>
            <td
              colspan="3"
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              <p
                v-if="selected?.length"
                class="bg-green-400 text-white rounded-md text-center px-4 py-1"
              >
                Total payable {{ "৳ " + totalPayableForSelectedTransaction }}
              </p>
            </td>
            <td
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              <button
                v-if="selected?.length"
                :disabled="selectedPaymentLoading"
                @click="completeSelectedPayment()"
                class="bg-indigo-400 text-white rounded-md text-center px-4 py-1"
              >
                Pay
              </button>
            </td>
          </tr>
          <!-- <tr>
            <td
              colspan="9"
              v-for="(total, index) in totals" :key="index"
              style="border: 1px solid #ddd; padding: 8px; text-align: center"
            >
              {{ total }}
            </td>
          </tr> -->
          <tr v-if="transactions.length == 0">
            <td
              colspan="12"
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
  <ConfirmModal
    :open="showConfirmModal"
    @onClose="showConfirmModal = false"
    :title="'Are you sure you want to pay?'"
  >
    
    <div>
      <select
        class="focus:outline-none bg-none"
        :class="inputClass"
        style="background: none"
        name="place"
        v-model="selectedPaymentMethod"
      >
        <option
          v-for="category in ['cash', 'online']"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
    </div>
    <div class="mt-6">
      <p
        class="bg-indigo-600 text-white rounded-md px-4 py-1"
      >
        Total payable <strong>{{ "৳ " + totalPayableForSelectedTransaction }}</strong>
      </p>
    </div>
    <template v-slot:footer>
      <div class="flex justify-end gap-2 mt-4">
        <button
          @click="showConfirmModal = false"
          class="px-2 py-1 border-red-300 rounded-md"
        >
          Cancel
        </button>
        <button
          :disabled="checkoutLoading"
          @click="confirmPay"
          :class="
            checkoutLoading
              ? 'bg-gray-600 text-white'
              : 'bg-indigo-600 text-white'
          "
          class="px-2 py-1 border-gray-300 rounded-md"
        >
          Confirm pay
        </button>
      </div>
    </template>
  </ConfirmModal>
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
import ConfirmModal from "@/components/common/Modal.vue";

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
const paymentMethod = ref("");
const selectedPaymentMethod = ref("cash");
const paymentStatus = ref("");
const transactions = ref([]);
const isLoading = ref(false);
const selectedPaymentLoading = ref(false);
const perPage = ref(2);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);
const page = ref(1);
const showConfirmModal = ref(false);
const checkoutLoading = ref(false);

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
const totals = computed(() => {
  if (transactions.value && transactions.value.length) {
    const acc = { payable: 0, paid: 0, discount: 0, due: 0 };
    for (let index = 0; index < transactions.value.length; index++) {
      const payment = transactions.value[index];

      acc.payable += parseFloat(payment.total_payable);
      acc.paid += parseFloat(payment.total_paid);
      acc.due += parseFloat(payment.total_due);
      acc.discount += parseFloat(payment.discount_amount);
    }

    return acc;
    return transactions.value.reduce(
      (acc, payment) => {
        acc.total_payable += parseFloat(payment.total_payable);
        acc.total_paid += parseFloat(payment.total_paid);
        acc.total_due += parseFloat(payment.total_due);
        acc.total_discount += parseFloat(payment.discount_amount);
        return acc;
      },
      { total_payable: 0, total_paid: 0, total_due: 0, total_discount: 0 }
    );
  }
  return 0.0;
});
const totalTransaction = computed(() => {
  if (transactions.value && transactions.value.length) {
    return transactions.value;
  }
  return 0.0;
});

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
  activeReport.value = true;
  selected.value = [];
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
      if (route.query.method) {
        newQuery.method = route.query.method;
        paymentMethod.value = route.query.method;
      }

      activeReport.value = false;
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
      console.log(newStatus, oldStatus, "status");
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
    activeReport.value = false;
  }
);

watch([paymentMethod], ([newMethod], [oldMethod]) => {
  if (oldMethod != newMethod) {
    console.log(oldMethod, newMethod, "method");
    paymentMethod.value = newMethod;
    if (!newMethod) {
      const newQuery = { ...route.query };
      delete newQuery.method;
      router.push({ query: newQuery });
    } else {
      const newQuery = { ...route.query };
      newQuery.method = newMethod;
      router.push({ query: newQuery });
    }
  }
  activeReport.value = false;
});

const hasPartialOrPending = computed(() => {
  return transactions.value.some(
    (payment) =>
      payment.payment_type == "partial" || payment.status !== "success"
  );
});
const selected = ref([]);

const totalPayableForSelectedTransaction = computed(() => {
  if (!selected.value.length) {
    return 0;
  }
  let sum = 0;
  for (let index = 0; index < selected.value.length; index++) {
    const item = selected.value[index];

    if (item.status == "success" && item.payment_type == "partial") {
      sum += parseFloat(item.total_due);
      continue;
    } else if (item.status != "success") {
      sum += parseFloat(item.total_payable);
      continue;
    }
  }
  return sum;
});
const handleSelect = (item) => {
  const index = selected.value.findIndex((i) => i.id == item.id);
  console.log(index, "index");
  if (index > -1) {
    selected.value = selected.value.filter((i) => i.id != item.id);
  } else {
    selected.value.push(item);
  }
};
const removeSelectedVehicleId = () => {
  vehicleId.value = null;
  vehicleNumber.value = "";
};
const getPaidAmount = (item) => {
  // const amount = parseFloat(item.total_paid) + parseFloat(item.discount_amount);
  const amount = parseFloat(item.total_paid);
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
const confirmPay = async () => {
  const paymentIds = selected.value.map((i) => i.id);
  const query = {
    paymentIds,
    paymentMethod: selectedPaymentMethod.value,
  };
  try {
    checkoutLoading.value = true;
    const result = await PaymentService.payAllDue(query);

    // print();
    if (result?.data?.redirect_url) {
      window.location.href = result.data.redirect_url;
    } else {
      // vehicle.value = { ...result?.data?.vehicle, status: "checked_out" };
    }
  } catch (error) {
  } finally {
    checkoutLoading.value = false;
  }
};
const completeSelectedPayment = async () => {
  showConfirmModal.value = true;
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
