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
import AutoComplete from "@/components/common/AutoComplete.vue";
import { CategoryService } from "~/services/CategoryService";
import { mkConfig, generateCsv, download } from "export-to-csv";

definePageMeta({
  layout: "auth-layout",
});
const csvConfig = mkConfig({
  useKeysAsHeaders: true,
  filename: "transaction-report",
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
const selectedCategory = ref("");
const endDate = ref("");
const paymentType = ref("");
const paymentMethod = ref("");
const selectedPaymentMethod = ref("cash");
const selectedDiscountFilter = ref("");
const paymentStatus = ref("");
const transactions = ref([]);
const isLoading = ref(false);
const selectedPaymentLoading = ref(false);
const perPage = ref(50);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);
const page = ref(1);
const showConfirmModal = ref(false);
const checkoutLoading = ref(false);

const downloadCsv = () => {
  isLoading.value = true;
  const updatedArray = transactions.value.map((item) => {
    return {
      ...item,
      vehicle: item.vehicle?.number,
    };
  });
  const newArray = updatedArray.map((obj, index) => {
    // Iterate over each property in the object
    const newObj = {};
    for (const key in obj) {
      // Check if the property value is null
      if (obj[key] == null || obj[key] == undefined) {
        newObj[key] = "";
      } else {
        newObj[key] = obj[key].toString();
      }
    }
    return {
      "SL No": index + 1,
      Vehicle: newObj.vehicle,
      Date: newObj.transaction_date,
      Payable: newObj.total_payable,
      Paid: newObj.total_paid,
      Discount: newObj.discount_amount,
      Due: newObj.total_due,
      "Payment type": newObj.payment_type,
      Status: newObj.status,
      Method: newObj.method,
    };
  });
  const csv = generateCsv(csvConfig)(newArray);
  download(csvConfig)(csv);
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
};

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
    const acc = { payable: 0, paid: 0, pending_Payment: 0, discount: 0, due: 0 };
    for (let index = 0; index < transactions.value.length; index++) {
      const payment = transactions.value[index];

      if (payment.status == 'success') {
        acc.paid += parseFloat(payment.total_paid)
      }else {
        acc.pending_Payment += parseFloat(payment.total_paid)
      }
      acc.payable += parseFloat(payment.total_payable);
      // acc.paid += parseFloat(payment.total_paid);
      acc.due += parseFloat(payment.total_due);
      acc.discount += parseFloat(payment.discount_amount);
    }

    return acc;
  }
  return 0.0;
});

const showExtraCOlumn = computed(()=> {
  return totals.value.paid != totals.value.payable
})

const vehicleNumber = ref("");

const vehicleId = ref(null);
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
const serverErros = ref({});
const activeReport = ref(false);
// const isTransactionReport = computed(
//   () => activeReport.value == "transactions"
// );
const getTransactions = (extraQuery = "") => {
  isLoading.value = true;
  activeReport.value = true;
  selected.value = [];
  setTimeout(async () => {
    try {
      let q =
        getQueryString(route.query) +
        `&page=${page.value}&per_page=${perPage.value}`;
      if (selectedCategory.value) {
        q += `&category=${selectedCategory.value}`;
      }
      // if (selectedDiscountFilter.value) {
      //   q += `&discount_filter=${selectedDiscountFilter.value}`;
      // }
      if (extraQuery != "") {
        q += `${extraQuery}`;
      }
      const res = await ReportService.getTransaction(q);
      transactions.value = res.data.data;
      const meta = res.data;
      page.value = meta.current_page;
      lastPage.value = meta.last_page;
      total.value = meta.total;
      totalPerPage.value = res.data.data.length;
      if (res.pdfUrl) {
        window.open(res.pdfUrl, "_blank");
      }
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
      if (route.query.start_date) {
        newQuery.start_date = route.query.start_date;
      }
      if (route.query.end_date) {
        newQuery.end_date = route.query.end_date;
      }
      if (route.query.vehicle_id) {
        newQuery.vehicle_id = route.query.vehicle_id;
        delete newQuery.vehicle_id;
        router.push({ query: newQuery });
        // vehicleId.value = route.query.vehicle_id;
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
      if (route.query.category) {
        newQuery.category = route.query.category;
        selectedCategory.value = route.query.category;
      }
      if (route.query.discount_filter) {
        newQuery.discount_filter = route.query.discount_filter;
        selectedDiscountFilter.value = route.query.discount_filter;
      }

      activeReport.value = false;
      router.push({ query: newQuery });
    }
  },
  { deep: false, immediate: true }
);

watch(
  [startDate, endDate],
  ([newStartDate, newEndDate], [oldStartDate, oldEndDate]) => {
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
    // if (newVehicleId !== oldVehicleId) {
    //   if (newVehicleId) {
    //     newQuery.vehicle_id = newVehicleId;
    //   } else {
    //     delete newQuery.vehicle_id;
    //   }
    // }
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

watch(
  [paymentMethod, selectedCategory],
  ([newMethod, newCategory], [oldMethod, oldCategory]) => {
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

    if (oldCategory != newCategory) {
      console.log(oldCategory, newCategory, "newCategory");
      paymentMethod.value = newMethod;
      if (!newCategory) {
        const newQuery = { ...route.query };
        delete newQuery.category;
        router.push({ query: newQuery });
      } else {
        const newQuery = { ...route.query };
        newQuery.category = newCategory;
        router.push({ query: newQuery });
      }
    }

    activeReport.value = false;
  }
);

watch(
  [selectedDiscountFilter],
  ([newF], [oldF]) => {
    if (oldF != newF) {
      console.log(oldF, newF);
      selectedDiscountFilter.value = newF;
      if (!newF) {
        const newQuery = { ...route.query };
        delete newQuery.discount_filter;
        router.push({ query: newQuery });
      } else {
        const newQuery = { ...route.query };
        newQuery.discount_filter = newF;
        console.log(newQuery, 'newQuery');
        router.push({ query: newQuery });
      }
    }
    activeReport.value = false;
  }
);

const client = ref("");
const handleChosen = (item) => {
  vehicleId.value = item.id;

  const newQuery = { ...route.query };
  newQuery.vehicle_id = vehicleId.value;
  router.push({ query: newQuery });
};
watch([vehicleId], ([newVehicleId], [oldVehicleId]) => {
  if (newVehicleId != oldVehicleId) {
    vehicleId.value = newVehicleId;
    if (!newVehicleId) {
      const newQuery = { ...route.query };
      delete newQuery.vehicle_id;
      router.push({ query: newQuery });
    } else {
      const newQuery = { ...route.query };
      newQuery.vehicle_id = newVehicleId;
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
const categories = ref([]);
const categoryLoading = ref(false);
const getCategories = async () => {
  categoryLoading.value = true;
  try {
    categoryLoading.value = true;
    const { data } = await CategoryService.getAll();
    categories.value = data;
    return Promise.resolve(data);
  } catch (error) {
  } finally {
    categoryLoading.value = false;
  }
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
  getCategories();
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
        <label class="text-gray-500">Vehicle category</label>
        <div :class="selectWrapper" class="flex items-center">
          <select
            class="focus:outline-none bg-none"
            :class="selecboxClass"
            style="background: none"
            name="place"
            v-model="selectedCategory"
          >
            <option disabled :value="''">Select</option>
            <option :value="item.id" v-for="item in categories" :key="item.id">
              {{ item.name }}
            </option>
          </select>
          <XMarkIcon
            v-if="selectedCategory"
            @click="selectedCategory = ''"
            class="h-5 w-5 text-red-500 cursor-pointer mr-2"
            aria-hidden="true"
          />
        </div>
      </div>
      <div class="grid gap-2">
        <label class="text-gray-500">Discount filters</label>
        <div :class="selectWrapper" class="flex items-center">
          <select v-model="selectedDiscountFilter" class="focus:outline-none bg-none"
            :class="selecboxClass"
            style="background: none">
            <option disabled :value="''">Select</option>
            <option value="all">All</option>
            <option value="membership_discount">Membership Discount</option>
            <option value="other_discount">Other Discount</option>
            <option value="no_discount">Data having no Discount</option>
          </select>

          <XMarkIcon
            v-if="selectedDiscountFilter"
            @click="selectedDiscountFilter = ''"
            class="h-5 w-5 text-red-500 cursor-pointer mr-2"
            aria-hidden="true"
          />
        </div>
      </div>
      <div class="grid gap-2">
        <label class="text-gray-500"
          >Vehicle Number<span class="text-red-500">*</span></label
        >
        <AutoComplete
          :data="[
            {
              id: 'abcd',
              name: 'abcd',
            },
            {
              name: 'qwer',
              id: 'qwer',
            },
          ]"
          v-model="client"
          @chosen="handleChosen"
          @resetSearch="resetSearch"
          placeholder="Search for state..."
        ></AutoComplete>
        <!-- <div
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
        </div> -->
      </div>
      
    </section>
    <section class="grid grid-cols-5 gap-2 mt-4">
      <div></div>
      <div></div>
        <button
          :disabled="isLoading"
          @click="getTransactions('')"
          class="text-white px-2 py-3 rounded-md w-full cursor-pointer"
          :class="activeReport ? 'bg-indigo-600' : 'bg-gray-600'"
        >
          Apply
        </button>
      <div></div>
      <div></div>

      </section>
    <section class="grid grid-cols-4 gap-4 mt-6">
      
      <div v-for="(total, index) in totals"
      :key="index">
        <div
          class="h-[7.5rem] bg-[#FAF9FE] border border-[#E1D9FF] rounded flex gap-4 p-4 items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="36"
            viewBox="0 0 44 36"
            fill="none"
          >
            <path
              d="M43.9286 21.9643C43.9286 34.0948 34.0948 35.124 21.9643 35.124C9.83375 35.124 0 34.0948 0 21.9643C0 9.83375 9.83375 0 21.9643 0C34.0948 0 43.9286 9.83375 43.9286 21.9643Z"
              fill="#A292E2"
            />
            <path
              d="M31.6538 24.6615C32.1278 24.0096 32.3848 23.2251 32.3882 22.4191C32.3933 22.3131 32.3561 22.2094 32.2847 22.1309C32.2134 22.0523 32.1137 22.0054 32.0078 22.0003C31.7879 21.9921 31.6019 22.1611 31.589 22.3807C31.592 23.0195 31.3952 23.6432 31.0262 24.1647C30.2458 25.1502 28.765 25.2002 28.4758 25.2002C28.2549 25.2002 28.0758 25.3793 28.0758 25.6002C28.0758 25.8212 28.2549 26.0002 28.4758 26.0002C28.8294 26.0002 30.6442 25.9358 31.6538 24.6615Z"
              fill="white"
            />
            <path
              d="M23.5998 19.6002C23.5998 19.3793 23.4207 19.2002 23.1998 19.2002C22.9789 19.2002 22.7998 19.3793 22.7998 19.6002C22.7998 20.4839 23.5161 21.2002 24.3998 21.2002V21.6002C24.3998 21.8211 24.5789 22.0002 24.7998 22.0002C25.0207 22.0002 25.1998 21.8211 25.1998 21.6002V21.2002C26.0834 21.2002 26.7998 20.4839 26.7998 19.6002C26.7998 18.7166 26.0834 18.0003 25.1998 18.0003V16.4003C25.6416 16.4003 25.9998 16.7584 25.9998 17.2003C25.9998 17.4212 26.1788 17.6003 26.3998 17.6003C26.6207 17.6003 26.7998 17.4212 26.7998 17.2003C26.7998 16.3166 26.0834 15.6003 25.1998 15.6003V15.2003C25.1998 14.9794 25.0207 14.8003 24.7998 14.8003C24.5789 14.8003 24.3998 14.9794 24.3998 15.2003V15.6003C23.5161 15.6003 22.7998 16.3166 22.7998 17.2003C22.7998 18.0839 23.5161 18.8002 24.3998 18.8002V20.4002C23.958 20.4002 23.5998 20.0421 23.5998 19.6002ZM23.5998 17.2003C23.5998 16.7584 23.958 16.4003 24.3998 16.4003V18.0003C23.958 18.0003 23.5998 17.6421 23.5998 17.2003ZM25.1998 18.8002C25.6416 18.8002 25.9998 19.1584 25.9998 19.6002C25.9998 20.0421 25.6416 20.4002 25.1998 20.4002V18.8002Z"
              fill="white"
            />
            <path
              d="M33.6653 19.5085C32.6797 15.3202 30.4885 12.8934 28.9062 11.6258C30.8905 11.7754 31.5293 12.601 31.5481 12.6258C31.6734 12.8047 31.9191 12.85 32.1 12.7276C32.2808 12.6051 32.3301 12.3602 32.2105 12.1774C32.1817 12.1342 31.6261 11.3406 30.0106 10.9774C30.4237 10.6378 30.668 10.1349 30.6797 9.60025C30.6263 8.71384 30.0092 7.96218 29.1502 7.73708C29.1854 7.44814 29.2033 7.15736 29.2038 6.86629C29.2033 6.59813 29.0686 6.34803 28.8449 6.20017C28.6212 6.05232 28.3382 6.02638 28.0914 6.1311C27.8894 6.22253 27.7019 6.34285 27.5346 6.48829C27.3383 6.69002 27.0681 6.80273 26.7866 6.80029C26.5056 6.80227 26.2359 6.6896 26.0398 6.48829C25.3349 5.83724 24.248 5.83724 23.543 6.48829C23.3467 6.69046 23.076 6.80323 22.7942 6.80029C22.5133 6.80262 22.2436 6.68989 22.0479 6.48829C21.881 6.34316 21.694 6.22298 21.4927 6.1315C21.246 6.02748 20.9636 6.05377 20.7403 6.20154C20.5171 6.34931 20.3825 6.59896 20.3819 6.86669C20.3819 7.86188 20.5787 9.63705 21.8247 10.829C21.1698 11.2272 20.5583 11.6925 19.9999 12.2174V9.20026C19.9999 8.28827 18.7099 7.60028 16.9999 7.60028C15.2899 7.60028 14 8.28827 14 9.20026V13.2302C12.5972 13.3702 11.6 14.0002 11.6 14.8002V24.9741C10.6336 25.2337 10 25.7601 10 26.4V28.4C10 29.312 11.29 30 13 30C14.5291 30 15.7199 29.4492 15.9547 28.68C16.6452 29.0456 17.419 29.2248 18.1999 29.2C19.9099 29.2 21.1999 28.512 21.1999 27.6V22.4001C21.1999 21.4881 19.9099 20.8001 18.1999 20.8001C17.9995 20.8 17.7993 20.81 17.5999 20.8301V14.8002C17.5999 13.9242 16.4091 13.257 14.7999 13.2054V10.3078C15.4804 10.6537 16.2369 10.823 16.9999 10.8002C17.7629 10.823 18.5194 10.6537 19.1999 10.3078V13.0358C18.9363 13.3306 18.6715 13.6518 18.4103 14.0078C18.2907 14.1859 18.3329 14.4267 18.506 14.5535C18.679 14.6803 18.9213 14.6479 19.0551 14.4802C19.312 14.1324 19.5873 13.7986 19.8799 13.4802C19.8831 13.4766 19.8859 13.473 19.8891 13.4698C20.6526 12.6212 21.5493 11.9026 22.5438 11.3422C22.7399 11.4368 22.9474 11.5058 23.161 11.5474L22.1298 12.5098C21.9684 12.6607 21.9598 12.9139 22.1106 13.0754C22.2615 13.2369 22.5148 13.2455 22.6762 13.0946L24.2762 11.6022H24.4038V12.8022C24.4038 13.0231 24.5829 13.2022 24.8038 13.2022C25.0247 13.2022 25.2038 13.0231 25.2038 12.8022V11.6002H25.3314L26.9314 13.0926C27.0359 13.1902 27.1845 13.2247 27.3212 13.183C27.458 13.1413 27.5621 13.0299 27.5944 12.8906C27.6267 12.7513 27.5822 12.6054 27.4778 12.5078L26.4398 11.5414C26.6522 11.4994 26.8583 11.4302 27.053 11.3354C28.1102 11.9074 31.5853 14.1674 32.8869 19.6917C33.4529 22.0965 33.2489 23.9361 32.2809 25.1581C31.0425 26.72 28.8938 26.8 28.4758 26.8H22.7998C22.5789 26.8 22.3998 26.9791 22.3998 27.2C22.3998 27.4209 22.5789 27.6 22.7998 27.6H28.4758C29.1558 27.6 31.4777 27.4596 32.9077 25.6549C34.0349 24.2313 34.2901 22.1633 33.6653 19.5085ZM13 25.6001C14.3227 25.6001 15.1999 26.08 15.1999 26.4C15.1999 26.72 14.3227 27.2 13 27.2C11.6772 27.2 10.8 26.72 10.8 26.4C10.8 26.08 11.6772 25.6001 13 25.6001ZM13 29.2C11.6772 29.2 10.8 28.72 10.8 28.4V27.5076C11.4805 27.8535 12.237 28.0228 13 28C13.763 28.0228 14.5195 27.8535 15.1999 27.5076V28.4C15.1999 28.72 14.3227 29.2 13 29.2ZM18.1999 28.4C16.8771 28.4 15.9999 27.92 15.9999 27.6V23.5077C16.6804 23.8536 17.4369 24.0229 18.1999 24.0001C18.9629 24.0229 19.7194 23.8536 20.3999 23.5077V27.6C20.3999 27.92 19.5227 28.4 18.1999 28.4ZM20.3999 22.4001C20.3999 22.7201 19.5227 23.2001 18.1999 23.2001C16.8771 23.2001 15.9999 22.7201 15.9999 22.4001C15.9999 22.0801 16.8771 21.6001 18.1999 21.6001C19.5227 21.6001 20.3999 22.0801 20.3999 22.4001ZM15.1999 22.4001V25.2925C14.5195 24.9466 13.763 24.7773 13 24.8001C12.7996 24.7999 12.5993 24.8099 12.4 24.8301V15.9078C13.0805 16.2536 13.8369 16.423 14.5999 16.4002C15.3629 16.423 16.1194 16.2536 16.7999 15.9078V20.9741C15.8335 21.2337 15.1999 21.7601 15.1999 22.4001ZM16.7999 14.8002C16.7999 15.1202 15.9227 15.6002 14.5999 15.6002C13.2772 15.6002 12.4 15.1202 12.4 14.8002C12.4 14.4802 13.2772 14.0002 14.5999 14.0002C15.9227 14.0002 16.7999 14.4802 16.7999 14.8002ZM16.9999 10.0002C15.6771 10.0002 14.7999 9.52025 14.7999 9.20026C14.7999 8.88026 15.6771 8.40027 16.9999 8.40027C18.3227 8.40027 19.1999 8.88026 19.1999 9.20026C19.1999 9.52025 18.3227 10.0002 16.9999 10.0002ZM29.8798 9.60025C29.8798 10.2558 29.1698 10.7938 28.2798 10.8002C28.1309 10.7993 27.9826 10.7823 27.8374 10.7494C28.4179 10.1301 28.8214 9.36613 29.0058 8.53747C29.4872 8.67933 29.8335 9.10044 29.8798 9.60025ZM21.5471 7.11228C21.8849 7.42882 22.3313 7.60351 22.7942 7.60028C23.2574 7.60376 23.7042 7.42904 24.0422 7.11228C24.2399 6.91266 24.5093 6.80036 24.7902 6.80036C25.0712 6.80036 25.3405 6.91266 25.5382 7.11228C25.8762 7.42928 26.3232 7.60402 26.7866 7.60028C27.2499 7.60386 27.6969 7.42914 28.035 7.11228C28.1458 7.01432 28.2692 6.93146 28.4018 6.86589C28.4018 7.60868 28.2638 9.44506 26.975 10.4518C26.685 10.6696 26.3336 10.7899 25.971 10.7954C26.3173 10.2007 26.5913 9.56675 26.7874 8.90706C26.8257 8.7693 26.7876 8.62157 26.6874 8.51953C26.5873 8.41748 26.4403 8.37662 26.3018 8.41233C26.1634 8.44804 26.0545 8.5549 26.0162 8.69266C25.7947 9.44456 25.4541 10.1561 25.0074 10.8002H24.5962C24.1504 10.1555 23.8098 9.44416 23.587 8.69266C23.5277 8.47982 23.3071 8.35535 23.0942 8.41467C22.8814 8.47398 22.7569 8.69461 22.8162 8.90746C23.0125 9.56772 23.2868 10.2022 23.6334 10.7974C23.2636 10.7955 22.9042 10.6745 22.6086 10.4522C21.3199 9.44586 21.1819 7.60948 21.1819 6.86909C21.3144 6.93259 21.4374 7.01447 21.5471 7.11228Z"
              fill="white"
            />
            <path
              d="M31.6538 24.6614C32.1278 24.0096 32.3848 23.2251 32.3882 22.4191C32.3933 22.3131 32.3561 22.2094 32.2847 22.1309C32.2134 22.0523 32.1137 22.0053 32.0078 22.0003C31.7881 21.9925 31.6023 22.1613 31.589 22.3807C31.592 23.0194 31.3952 23.6432 31.0262 24.1646C30.2458 25.1502 28.765 25.2002 28.4758 25.2002C28.2549 25.2002 28.0758 25.3793 28.0758 25.6002C28.0758 25.8211 28.2549 26.0002 28.4758 26.0002C28.8294 26.0002 30.6442 25.9358 31.6538 24.6614Z"
              fill="white"
            />
          </svg>
          <div>
            <p class="uppercase text-[#767676] text-sm pb-2.5">
              Total {{ index }}
            </p>
            <p class="font-medium text-xl break-all">
              {{ "৳ " + Number(total).toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="grid grid-cols-4 gap-4 mt-6" v-if="selected?.length">
      <div></div>
      <div></div>
      <div></div>
      <div>
        <div
          class="h-[7.5rem] bg-[#FAF9FE] border border-[#E1D9FF] rounded flex gap-4 p-4 items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="36"
            viewBox="0 0 44 36"
            fill="none"
          >
            <path
              d="M43.9286 21.9643C43.9286 34.0948 34.0948 35.124 21.9643 35.124C9.83375 35.124 0 34.0948 0 21.9643C0 9.83375 9.83375 0 21.9643 0C34.0948 0 43.9286 9.83375 43.9286 21.9643Z"
              fill="#A292E2"
            />
            <path
              d="M31.6538 24.6615C32.1278 24.0096 32.3848 23.2251 32.3882 22.4191C32.3933 22.3131 32.3561 22.2094 32.2847 22.1309C32.2134 22.0523 32.1137 22.0054 32.0078 22.0003C31.7879 21.9921 31.6019 22.1611 31.589 22.3807C31.592 23.0195 31.3952 23.6432 31.0262 24.1647C30.2458 25.1502 28.765 25.2002 28.4758 25.2002C28.2549 25.2002 28.0758 25.3793 28.0758 25.6002C28.0758 25.8212 28.2549 26.0002 28.4758 26.0002C28.8294 26.0002 30.6442 25.9358 31.6538 24.6615Z"
              fill="white"
            />
            <path
              d="M23.5998 19.6002C23.5998 19.3793 23.4207 19.2002 23.1998 19.2002C22.9789 19.2002 22.7998 19.3793 22.7998 19.6002C22.7998 20.4839 23.5161 21.2002 24.3998 21.2002V21.6002C24.3998 21.8211 24.5789 22.0002 24.7998 22.0002C25.0207 22.0002 25.1998 21.8211 25.1998 21.6002V21.2002C26.0834 21.2002 26.7998 20.4839 26.7998 19.6002C26.7998 18.7166 26.0834 18.0003 25.1998 18.0003V16.4003C25.6416 16.4003 25.9998 16.7584 25.9998 17.2003C25.9998 17.4212 26.1788 17.6003 26.3998 17.6003C26.6207 17.6003 26.7998 17.4212 26.7998 17.2003C26.7998 16.3166 26.0834 15.6003 25.1998 15.6003V15.2003C25.1998 14.9794 25.0207 14.8003 24.7998 14.8003C24.5789 14.8003 24.3998 14.9794 24.3998 15.2003V15.6003C23.5161 15.6003 22.7998 16.3166 22.7998 17.2003C22.7998 18.0839 23.5161 18.8002 24.3998 18.8002V20.4002C23.958 20.4002 23.5998 20.0421 23.5998 19.6002ZM23.5998 17.2003C23.5998 16.7584 23.958 16.4003 24.3998 16.4003V18.0003C23.958 18.0003 23.5998 17.6421 23.5998 17.2003ZM25.1998 18.8002C25.6416 18.8002 25.9998 19.1584 25.9998 19.6002C25.9998 20.0421 25.6416 20.4002 25.1998 20.4002V18.8002Z"
              fill="white"
            />
            <path
              d="M33.6653 19.5085C32.6797 15.3202 30.4885 12.8934 28.9062 11.6258C30.8905 11.7754 31.5293 12.601 31.5481 12.6258C31.6734 12.8047 31.9191 12.85 32.1 12.7276C32.2808 12.6051 32.3301 12.3602 32.2105 12.1774C32.1817 12.1342 31.6261 11.3406 30.0106 10.9774C30.4237 10.6378 30.668 10.1349 30.6797 9.60025C30.6263 8.71384 30.0092 7.96218 29.1502 7.73708C29.1854 7.44814 29.2033 7.15736 29.2038 6.86629C29.2033 6.59813 29.0686 6.34803 28.8449 6.20017C28.6212 6.05232 28.3382 6.02638 28.0914 6.1311C27.8894 6.22253 27.7019 6.34285 27.5346 6.48829C27.3383 6.69002 27.0681 6.80273 26.7866 6.80029C26.5056 6.80227 26.2359 6.6896 26.0398 6.48829C25.3349 5.83724 24.248 5.83724 23.543 6.48829C23.3467 6.69046 23.076 6.80323 22.7942 6.80029C22.5133 6.80262 22.2436 6.68989 22.0479 6.48829C21.881 6.34316 21.694 6.22298 21.4927 6.1315C21.246 6.02748 20.9636 6.05377 20.7403 6.20154C20.5171 6.34931 20.3825 6.59896 20.3819 6.86669C20.3819 7.86188 20.5787 9.63705 21.8247 10.829C21.1698 11.2272 20.5583 11.6925 19.9999 12.2174V9.20026C19.9999 8.28827 18.7099 7.60028 16.9999 7.60028C15.2899 7.60028 14 8.28827 14 9.20026V13.2302C12.5972 13.3702 11.6 14.0002 11.6 14.8002V24.9741C10.6336 25.2337 10 25.7601 10 26.4V28.4C10 29.312 11.29 30 13 30C14.5291 30 15.7199 29.4492 15.9547 28.68C16.6452 29.0456 17.419 29.2248 18.1999 29.2C19.9099 29.2 21.1999 28.512 21.1999 27.6V22.4001C21.1999 21.4881 19.9099 20.8001 18.1999 20.8001C17.9995 20.8 17.7993 20.81 17.5999 20.8301V14.8002C17.5999 13.9242 16.4091 13.257 14.7999 13.2054V10.3078C15.4804 10.6537 16.2369 10.823 16.9999 10.8002C17.7629 10.823 18.5194 10.6537 19.1999 10.3078V13.0358C18.9363 13.3306 18.6715 13.6518 18.4103 14.0078C18.2907 14.1859 18.3329 14.4267 18.506 14.5535C18.679 14.6803 18.9213 14.6479 19.0551 14.4802C19.312 14.1324 19.5873 13.7986 19.8799 13.4802C19.8831 13.4766 19.8859 13.473 19.8891 13.4698C20.6526 12.6212 21.5493 11.9026 22.5438 11.3422C22.7399 11.4368 22.9474 11.5058 23.161 11.5474L22.1298 12.5098C21.9684 12.6607 21.9598 12.9139 22.1106 13.0754C22.2615 13.2369 22.5148 13.2455 22.6762 13.0946L24.2762 11.6022H24.4038V12.8022C24.4038 13.0231 24.5829 13.2022 24.8038 13.2022C25.0247 13.2022 25.2038 13.0231 25.2038 12.8022V11.6002H25.3314L26.9314 13.0926C27.0359 13.1902 27.1845 13.2247 27.3212 13.183C27.458 13.1413 27.5621 13.0299 27.5944 12.8906C27.6267 12.7513 27.5822 12.6054 27.4778 12.5078L26.4398 11.5414C26.6522 11.4994 26.8583 11.4302 27.053 11.3354C28.1102 11.9074 31.5853 14.1674 32.8869 19.6917C33.4529 22.0965 33.2489 23.9361 32.2809 25.1581C31.0425 26.72 28.8938 26.8 28.4758 26.8H22.7998C22.5789 26.8 22.3998 26.9791 22.3998 27.2C22.3998 27.4209 22.5789 27.6 22.7998 27.6H28.4758C29.1558 27.6 31.4777 27.4596 32.9077 25.6549C34.0349 24.2313 34.2901 22.1633 33.6653 19.5085ZM13 25.6001C14.3227 25.6001 15.1999 26.08 15.1999 26.4C15.1999 26.72 14.3227 27.2 13 27.2C11.6772 27.2 10.8 26.72 10.8 26.4C10.8 26.08 11.6772 25.6001 13 25.6001ZM13 29.2C11.6772 29.2 10.8 28.72 10.8 28.4V27.5076C11.4805 27.8535 12.237 28.0228 13 28C13.763 28.0228 14.5195 27.8535 15.1999 27.5076V28.4C15.1999 28.72 14.3227 29.2 13 29.2ZM18.1999 28.4C16.8771 28.4 15.9999 27.92 15.9999 27.6V23.5077C16.6804 23.8536 17.4369 24.0229 18.1999 24.0001C18.9629 24.0229 19.7194 23.8536 20.3999 23.5077V27.6C20.3999 27.92 19.5227 28.4 18.1999 28.4ZM20.3999 22.4001C20.3999 22.7201 19.5227 23.2001 18.1999 23.2001C16.8771 23.2001 15.9999 22.7201 15.9999 22.4001C15.9999 22.0801 16.8771 21.6001 18.1999 21.6001C19.5227 21.6001 20.3999 22.0801 20.3999 22.4001ZM15.1999 22.4001V25.2925C14.5195 24.9466 13.763 24.7773 13 24.8001C12.7996 24.7999 12.5993 24.8099 12.4 24.8301V15.9078C13.0805 16.2536 13.8369 16.423 14.5999 16.4002C15.3629 16.423 16.1194 16.2536 16.7999 15.9078V20.9741C15.8335 21.2337 15.1999 21.7601 15.1999 22.4001ZM16.7999 14.8002C16.7999 15.1202 15.9227 15.6002 14.5999 15.6002C13.2772 15.6002 12.4 15.1202 12.4 14.8002C12.4 14.4802 13.2772 14.0002 14.5999 14.0002C15.9227 14.0002 16.7999 14.4802 16.7999 14.8002ZM16.9999 10.0002C15.6771 10.0002 14.7999 9.52025 14.7999 9.20026C14.7999 8.88026 15.6771 8.40027 16.9999 8.40027C18.3227 8.40027 19.1999 8.88026 19.1999 9.20026C19.1999 9.52025 18.3227 10.0002 16.9999 10.0002ZM29.8798 9.60025C29.8798 10.2558 29.1698 10.7938 28.2798 10.8002C28.1309 10.7993 27.9826 10.7823 27.8374 10.7494C28.4179 10.1301 28.8214 9.36613 29.0058 8.53747C29.4872 8.67933 29.8335 9.10044 29.8798 9.60025ZM21.5471 7.11228C21.8849 7.42882 22.3313 7.60351 22.7942 7.60028C23.2574 7.60376 23.7042 7.42904 24.0422 7.11228C24.2399 6.91266 24.5093 6.80036 24.7902 6.80036C25.0712 6.80036 25.3405 6.91266 25.5382 7.11228C25.8762 7.42928 26.3232 7.60402 26.7866 7.60028C27.2499 7.60386 27.6969 7.42914 28.035 7.11228C28.1458 7.01432 28.2692 6.93146 28.4018 6.86589C28.4018 7.60868 28.2638 9.44506 26.975 10.4518C26.685 10.6696 26.3336 10.7899 25.971 10.7954C26.3173 10.2007 26.5913 9.56675 26.7874 8.90706C26.8257 8.7693 26.7876 8.62157 26.6874 8.51953C26.5873 8.41748 26.4403 8.37662 26.3018 8.41233C26.1634 8.44804 26.0545 8.5549 26.0162 8.69266C25.7947 9.44456 25.4541 10.1561 25.0074 10.8002H24.5962C24.1504 10.1555 23.8098 9.44416 23.587 8.69266C23.5277 8.47982 23.3071 8.35535 23.0942 8.41467C22.8814 8.47398 22.7569 8.69461 22.8162 8.90746C23.0125 9.56772 23.2868 10.2022 23.6334 10.7974C23.2636 10.7955 22.9042 10.6745 22.6086 10.4522C21.3199 9.44586 21.1819 7.60948 21.1819 6.86909C21.3144 6.93259 21.4374 7.01447 21.5471 7.11228Z"
              fill="white"
            />
            <path
              d="M31.6538 24.6614C32.1278 24.0096 32.3848 23.2251 32.3882 22.4191C32.3933 22.3131 32.3561 22.2094 32.2847 22.1309C32.2134 22.0523 32.1137 22.0053 32.0078 22.0003C31.7881 21.9925 31.6023 22.1613 31.589 22.3807C31.592 23.0194 31.3952 23.6432 31.0262 24.1646C30.2458 25.1502 28.765 25.2002 28.4758 25.2002C28.2549 25.2002 28.0758 25.3793 28.0758 25.6002C28.0758 25.8211 28.2549 26.0002 28.4758 26.0002C28.8294 26.0002 30.6442 25.9358 31.6538 24.6614Z"
              fill="white"
            />
          </svg>
          <div>
            <p
                
                class="bg-green-400 text-white rounded-md text-center px-4 py-1"
              >
                Total payable {{ "৳ " + totalPayableForSelectedTransaction }}
              </p>
              <button
                :disabled="selectedPaymentLoading"
                @click="completeSelectedPayment()"
                class="bg-indigo-400 text-white rounded-md text-center px-4 py-1 mt-2"
              >
                Pay now
              </button>
          </div>
        </div>
      </div>
    </section>
    <section>
      <header
        class="flex"
        :class="transactions?.length ? 'justify-between' : 'justify-center'"
      >
        <div>
          <h2
            style="text-align: center; margin-top: 20px"
            class="text-2xl font-bold text-gray-800 p-4"
          >
            Date-wise Transactions
          </h2>
        </div>
        <section class="flex items-end gap-2 p-4" v-if="transactions?.length">
          <button
            :disabled="isLoading"
            @click="getTransactions('&format=pdf')"
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
            v-if="showExtraCOlumn"
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
              v-if="showExtraCOlumn"
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
            v-if="showExtraCOlumn"
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
              <div class="flex flex-col items-end gap-2">
                <div v-if="item.membership_discount">{{ "Membership ৳ " + item.membership_discount }}</div>
                <div v-if="item.discount_amount">{{ "Other: ৳ " + item.discount_amount }}</div>
              </div>
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
            v-if="showExtraCOlumn"
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
          <tr v-if="transactions?.length && false">
            <!-- <td
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
            </td> -->
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
      <p class="bg-indigo-600 text-white rounded-md px-4 py-1">
        Total payable
        <strong>{{ "৳ " + totalPayableForSelectedTransaction }}</strong>
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

<style lang="scss" scoped></style>
