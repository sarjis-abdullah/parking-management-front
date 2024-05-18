<template>
  <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div v-if="!loadingError && !isLoading">
            <div v-if="list && list?.length > 0" class="flex justify-center">
              <div style="max-width: 40rem; margin: auto">
                <div ref="emailTemplate" style="max-width: 40rem; margin: auto">
                  <div
                    style="
                      margin-top: 1rem;
                      border-radius: 0.5rem;
                      background-color: #f3f4f6;
                      padding: 0.75rem 1rem;
                    "
                  >
                    <div style="position: relative; width: 100%">
                      <img
                        :src="'data:image/png;base64,' + barcodeImage"
                        alt=""
                        style="width: 100%"
                      />
                      <div
                        style="
                          position: absolute;
                          inset: 0;
                          border-radius: 1rem;
                          border: 1px solid rgba(0, 0, 0, 0.1);
                        "
                      ></div>
                    </div>

                    <dl
                      style="margin-top: 0.75rem"
                      v-for="(item, index) in list"
                      :key="index"
                    >
                      <div
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          border-top: 1px solid #e5e7eb;
                          padding-top: 1rem;
                        "
                        v-for="(value, key) in item"
                        :key="key"
                      >
                        <dt style="font-size: 0.875rem; color: #6b7280">
                          {{ key }}
                        </dt>
                        <dd
                          style="
                            font-size: 0.875rem;
                            font-weight: 500;
                            color: #111827;
                          "
                        >
                          {{ value }}
                        </dd>
                      </div>

                      <div
                        data-v-61884e8b=""
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          border-top: 1px solid rgb(229, 231, 235);
                          padding-top: 1rem;
                        "
                      >
                        <dt
                          data-v-61884e8b=""
                          style="font-size: 0.875rem; color: rgb(107, 114, 128)"
                        >
                          Payment method
                        </dt>
                        <select
                          class="focus:outline-none bg-none"
                          :class="inputClass"
                          style="background: none"
                          name="place"
                          v-model="paymentMethod"
                        >
                          <option
                            v-for="category in ['cash', 'bkash', 'visa', 'due']"
                            :key="category"
                            :value="category"
                          >
                            {{ category }}
                          </option>
                        </select>
                      </div>
                      <div
                        data-v-61884e8b=""
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          border-top: 1px solid rgb(229, 231, 235);
                          padding-top: 1rem;
                        "
                      >
                        <dt
                          data-v-61884e8b=""
                          style="font-size: 0.875rem; color: rgb(107, 114, 128)"
                        >
                          Received amount
                        </dt>
                        <input
                          class="focus:outline-none bg-none text-right"
                          :class="inputClass"
                          type="number"
                          v-model="receivedAmount"
                          placeholder="0.00 taka"
                        />
                      </div>
                      <div
                        data-v-61884e8b=""
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          border-top: 1px solid rgb(229, 231, 235);
                          padding-top: 1rem;
                        "
                      >
                        <dt
                          data-v-61884e8b=""
                          style="font-size: 0.875rem; color: rgb(107, 114, 128)"
                        >
                          Return able amount
                        </dt>
                        {{ returnableAmount }}
                      </div>
                      <!-- <div
                        data-v-61884e8b=""
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          border-top: 1px solid rgb(229, 231, 235);
                          padding-top: 1rem;
                        "
                      >
                        <dt
                          data-v-61884e8b=""
                          style="font-size: 0.875rem; color: rgb(107, 114, 128)"
                        >
                          Payment status
                        </dt>
                        <div>
                          {{ paymentStatus }}
                        </div>
                      </div> -->
                    </dl>
                  </div>
                </div>
                <div class="flex justify-end gap-2">
                  <!-- <button
                    data-v-61884e8b=""
                    @click="print"
                    type="submit"
                    class="mt-6 w- rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Print
                  </button> -->
                  <button
                    @click="checkoutAndprint"
                    class="mt-6 w- rounded-md border border-transparent bg-green-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Checkout
                  </button>
                </div>
              </div>
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
          <div v-else-if="serverErrors" class="text-center py-10">
            <Error :error="serverErrors" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, nextTick, computed, ref } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Link from "@/components/common/Link.vue";
import Pagination from "@/components/common/Pagination.vue";
import Error from "@/components/common/Error.vue";
import { ParkingService } from "~/services/ParkingService";
import { formatDate } from "@/utils/index";
import moment from "moment";
definePageMeta({
  layout:"auth-layout",
});
const inputClass =
  "relative appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";

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
const paymentMethod = ref("cash");
const receivedAmount = ref();
const payableAmount = ref(0);
const parkingId = ref(null);

const route = useRoute();
const barcode = route.params.barcode;

const searchQuery = computed(() => {
  return `?barcode=${barcode}&include=p.slot,p.category,p.place,p.tariff,t.parking_rates`;
});
const durationInMinutes = ref(0);
const totalCost = computed(() => {
  const durations = durationInMinutes.value;
  const halfHourSegments = Math.ceil(durations / 30); // Number of half-hour segments

  let total = 0.0;

  // Ensure rates are sorted by id or another relevant field
  // rates.sort((a, b) => a.id - b.id);
  const rates = parking_rates.value;
  if (rates.length) {
    for (let i = 0; i < halfHourSegments; i++) {
      // Use the last rate if i exceeds the number of rate objects
      const rate =
        i < rates.length ? rates[i].rate : rates[rates.length - 1].rate;
      total += parseFloat(rate);
    }
  }

  console.log(total, "totalCost");
  return Number(total).toFixed(2);
});
const currentTime = ref(moment());
const parkingData = computed(() => {
  const obj = {
    out_time: formatDate(currentTime.value, "YYYY-MM-DD HH:mm:ss"),
    duration: durationInMinutes.value,
    payment: {
      method: "cash",
      paid_amount: totalCost.value,
    },
  };
  return obj;
});
const returnableAmount = computed(() => {
  if (totalCost.value && receivedAmount.value) {
    const payable = totalCost.value;
    const received = parseFloat(receivedAmount.value);
    return Math.floor(-payable + received);
  }
  return 0;
});
const barcodeImage = ref("");
const parking_rates = ref([]);
const loadData = async () => {
  try {
    isLoading.value = true;
    const { data } = await ParkingService.getAll(searchQuery.value);
    if (data?.length) {
      const result = data[0];
      barcodeImage.value = result.barcode_image;
      parkingId.value = result.id;

      const differenceInMillis = currentTime.value.diff(result.in_time);

      // Create a duration object
      const duration = moment.duration(differenceInMillis);

      // Extract total time in minutes
      durationInMinutes.value = Math.ceil(duration.asMinutes());

      parking_rates.value = result.tariff.parking_rates;

      list.value = data.map((item) => {
        const duration = moment.duration(currentTime.value.diff(item.in_time));
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        const totalTime = `${hours}h ${minutes}m`;
        return {
          "Vehicle Number": item.vehicle_no,
          Place: item.place?.name,
          Category: item.category?.name,
          Floor: item.floor?.name,
          Slot: item.slot?.name,
          "Driver Name": item.driver_name,
          "driver Mobile": item.driver_mobile,
          "Check-in-Time": formatDate(item.in_time),
          "Check-out-Time": formatDate(currentTime.value),
          Duration: totalTime,
          "Payble Amount": totalCost.value,
        };
      });

      serverErrors.value = {};
    } else {
      serverErrors.value = "No data available for this barcode";
    }

    // page.value = meta.current_page;
    // lastPage.value = meta.last_page;
    // total.value = meta.total;
    // totalPerPage.value = data.length;

    // handleReset();
  } catch (error) {
    if (error.errors) {
      serverErrors.value = error.errors;
    }
  } finally {
    isLoading.value = false;
  }
};

const emailTemplate = ref(null);
const print = () => {
  const emailT = emailTemplate.value.innerHTML;

  const printWindow = window.open(
    "",
    "",
    "left=0,top=0,right=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
  );
  //   printWindow.document.open();
  printWindow.document.write(`
        <html>
          <head>
            <title>Mart technologies Ltd.</title>
            <style>
              /* Add CSS styles for printing */
              body {
                font-family: Arial, sans-serif;
                font-size: 14px;
              }
              h1 {
                color: #333;
              }
              p {
                margin-bottom: 10px;
              }
            </style>
          </head>
          <body>
            <section style="max-width: 40rem; margin: auto;">
            ${emailT}
          </section>
            </body>
        </html>
      `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  setTimeout(() => {
    printWindow.close();
  }, 1);
};
const checkoutAndprint = async () => {
  try {
    await ParkingService.handleCheckout(parkingId.value, parkingData.value);
    print();
  } catch (error) {
    if (error.errors) {
      serverErrors.value = error.errors;
    }
  }
};
onMounted(() => {
  loadData();
});
</script>
<style scoped>
@page {
  size: 13in 13in;
}
@media print {
  body {
    -webkit-print-color-adjust: exact;
  }
}
@media all {
  .no-print {
    display: none !important;
  }
}
</style>
