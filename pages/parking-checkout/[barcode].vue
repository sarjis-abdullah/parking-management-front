<template>
  <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg">
    <div class="flow-root">
      <div class="-mx-4 -mt-2 mb-12 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full align-middle sm:px-6 lg:px-8">
          <div v-if="!loadingError && !isLoading">
            <div                                                      
              v-if="list && list?.length > 0"
              class="grid md:grid-cols-3 justify-center gap-4"
            >
              <div>
                <div ref="emailTemplate">
                  <div
                    style="
                      border-radius: 0.5rem;
                      background-color: #f3f4f6;
                      padding: 0.75rem 1rem;
                    "
                  >
                    <div style="position: relative; width: 100%">
                      <div
                        class="grid grid-cols-2"
                        style="
                          display: flex;
                          justify-content: center;
                          border: 1px solid rgba(0, 0, 0, 0.1);
                          padding: 0.5rem;
                          border-radius: 1rem;
                        "
                      >
                        <img
                          src="/assets/khulshi.png"
                          style="max-height: 3rem"
                          alt="Your Company"
                        />
                        <span></span>
                        <span></span>
                        <!-- <img
                          :src="'data:image/png;base64,' + barcodeImage"
                          alt="barcode"
                          style="width: auto; min-height: 3rem;"
                        />
                      </div> -->
                      </div>

                      <div style="position: absolute; inset: 0"></div>
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
                          padding: 0.5rem 0 0.5rem 0;
                        "
                        v-for="(value, key) in item"
                        :key="key"
                      >
                        <dt style="font-size: 0.875rem; color: #6b7280">
                          {{ key }}
                        </dt>
                        <dd
                          v-if="key == 'Status' || key == 'Payment method'"
                          style="
                            font-size: 0.875rem;
                            font-weight: 500;
                            color: white;
                            background-color: #89bc40;
                            padding: 0.25rem;
                            border-radius: 6px;
                          "
                        >
                          {{ value }}
                        </dd>
                        <dd
                          v-else
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
                        id="paymentMethodId"
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
                        id="111"
                        style="
                          display: none;
                          align-items: center;
                          justify-content: space-between;
                          border-top: 1px solid rgb(229, 231, 235);
                          padding-top: 1rem;
                        "
                      ></div>
                      <div
                        id="receivedAmountId"
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
                          ref="receivedAmountRef"
                        />
                      </div>
                      <div
                        style="
                          position: relative;
                          width: 100%;
                          margin-top: 1rem;
                        "
                      >
                        <div
                          class=""
                          style="
                            display: flex;
                            justify-content: center;
                            border: 1px solid rgba(0, 0, 0, 0.1);
                            padding: 0.5rem;
                            border-radius: 1rem;
                          "
                        >
                          <img
                            :src="'data:image/png;base64,' + barcodeImage"
                            alt="barcode"
                            style="width: auto"
                          />
                        </div>

                        <div style="position: absolute; inset: 0"></div>
                      </div>
                    </dl>
                  </div>
                </div>
                <div class="flex justify-end flex-col gap-2">
                  <div
                  v-if="hasDuePayment && vehicle?.status == 'checked_out' && false"
                    style="
                      border-radius: 0.5rem;
                      background-color: rgb(243, 244, 246);
                      padding: 0.75rem 1rem;
                    "
                  >
                    <ul class="flex flex-col gap-4">
                      <li class="flex items-center justify-between gap-4">
                        <span>Payment status</span>
                        <span>{{ duePayment.method }}</span>
                      </li>
                      <li class="flex items-center justify-between gap-4">
                        <span>Paid:</span>
                        <span>{{ duePayment.paid_amount }}</span>
                      </li>
                      <li class="flex items-center justify-between gap-4">
                        <span>Payable</span>
                        <span>{{
                          Number(
                            duePayment.payable_amount -
                              duePayment.paid_amount -
                              discountAmount
                          ).toFixed(2)
                        }}</span>
                      </li>
                    </ul>
                    <button
                      @click="payDue()"
                      class="mt-6 w-full rounded-md border border-transparent px-3 py-2 bg-green-600 text-white text-base font-medium shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      Pay due
                    </button>
                  </div>
                  <div
                    v-if="vehicle?.status == 'checked_out'"
                    class="mt-6 w-full rounded-md border border-transparent bg-yellow-600 px-4 py-3 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Vehicle is checked-out
                  </div>
                  <button
                    v-if="vehicle?.status == 'checked_out'"
                    @click="print"
                    type="submit"
                    class="mt-6 w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Print
                  </button>
                  <div
                    v-if="vehicle?.status != 'checked_out'"
                    class="mx-4 mt-4 px-3"
                  >
                    <button
                      @click="showConfirmModaDialog()"
                      class="rounded-md border w-full border-transparent px-3 py-2 bg-green-600 text-white text-base font-medium shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      Checkout
                    </button>
                    <button
                      @click="toggleQrCode"
                      class="mt-2 rounded-md border w-full border-transparent px-3 py-2 bg-indigo-600 text-white text-base font-medium shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      Show QR code
                    </button>

                  </div>
                </div>
              </div>
              <div v-if="vehicle?.membership?.id && vehicle?.membership?.active">
                <ul class="shadow-lg">
                  <li
                    v-if="vehicle.membership?.name"
                    class="membership-item hover:bg-slate-100"
                  >
                    <span>Name:</span>
                    <span>{{ vehicle.membership.name }}</span>
                  </li>
                  <li
                    v-if="vehicle.membership?.contact_number"
                    class="membership-item hover:bg-slate-100"
                  >
                    <span>Membership number:</span>
                    <span>{{ vehicle.membership.contact_number }}</span>
                  </li>
                  <li
                    v-if="vehicle.membership?.membership_type?.discount_type"
                    class="membership-item hover:bg-slate-100"
                  >
                    <span>Discount type:</span>
                    <span>{{
                      vehicle.membership.membership_type.discount_type
                    }}</span>
                  </li>
                  <li
                    v-if="
                      vehicle.membership?.membership_type?.discount_amount &&
                      vehicle.membership?.membership_type?.discount_type !=
                        'free'
                    "
                    class="membership-item hover:bg-slate-100"
                  >
                    <span>Discount:</span>
                    <span
                      >{{
                        membershipHasPercentageDiscount ? parseInt(vehicle.membership.membership_type.discount_amount) ?? 0 : vehicle.membership.membership_type.discount_amount ?? 0
                      }}
                      <span
                        v-if="membershipHasFlatDiscount"
                        >৳</span
                      >
                      <span
                        v-else-if="membershipHasPercentageDiscount"
                        >%</span
                      >
                      <span v-else>Free</span>
                    </span>
                  </li>
                </ul>
                <div v-if="false" class="shadow-md p-2 mt-8">
                  <ul class="flex flex-col gap-2">
                    <li
                      v-for="(item, index) in parking_rates"
                      :key="item.id"
                      class="bg-indigo-500 text-white p-1 rounded"
                    >
                      <span
                        v-if="parking_rates?.length == 1"
                        class="flex justify-between"
                      >
                        <span>Each half hour rate</span>
                        <span>{{ item.rate }}৳</span>
                      </span>
                      <span v-else class="flex justify-between">
                        <span>{{
                          index == 0 ? "First half hour" : "Next half hour"
                        }}</span>
                        <span>{{ item.rate }}৳</span>
                      </span>
                    </li>
                    <li class="flex justify-between">
                      <span class="font-bold">Total: </span
                      ><span class="font-bold"
                        >{{ Number(parseFloat(totalCost)).toFixed(2) }}৳</span
                      >
                    </li>
                  </ul>
                </div>
              </div>
              <div v-else class="">
                <AddMembership v-if="authUser" @refetch="loadData" :vehicleId="vehicleId" />
                <div class="shadow-md py-2 px-7">
                  <ul class="flex flex-col gap-2">
                    <li
                      v-for="(item, index) in parking_rates"
                      :key="item.id"
                      class="bg-indigo-500 text-white p-1 rounded"
                    >
                      <span
                        v-if="parking_rates?.length == 1"
                        class="flex justify-between"
                      >
                        <span>Each half hour rate</span>
                        <span>{{ item.rate }}৳</span>
                      </span>
                      <span v-else class="flex justify-between">
                        <span>{{
                          index == 0 ? "First half hour" : "Next half hour"
                        }}</span>
                        <span>{{ item.rate }}৳</span>
                      </span>
                    </li>
                    <li class="flex justify-between">
                      <span class="font-bold">Total: </span
                      ><span class="font-bold"
                        >{{ Number(parseFloat(totalCost)).toFixed(2) }}৳</span
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!loadingError && isLoading">
            <Loading />
          </div>
          <div v-if="loadingError && !isLoading">
            Loading error
            <!-- <ListLoadingError :message="'cant_load_orders_list'" /> -->
          </div>
          <ServerError :error="serverErrors" />
        </div>
      </div>
      <Loading v-if="isLoading" />
      <ConfirmModal
        :open="showConfirmModal"
        @onClose="closeConfirmModal"
        :title="'Are you sure you want to checkout?'"
      >
        <div
          class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mt-4"
          role="alert"
          v-if="showAlertMessage"
        >
          <!-- <p class="font-bold">Be Warned</p> -->
          <p>{{showAlertMessage}}</p>
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
              @click="confirmCheckout"
              :class="checkoutLoading ? 'bg-gray-600 text-white' : 'bg-indigo-600 text-white'"
              class="px-2 py-1 border-gray-300 rounded-md"
            >
              Checkout
            </button>
          </div>
        </template>
      </ConfirmModal>
      <QrCodeModal
        :open="showQrCode"
        @onClose="showQrCode= false"
        :value="qrCodeUrl"
      >
      </QrCodeModal>
    </div>
  </div>
</template>
<script setup>
import { onMounted, nextTick, computed, ref } from "vue";
import Link from "@/components/common/Link.vue";
import Pagination from "@/components/common/Pagination.vue";
import Loading from "@/components/common/Loading.vue";
import QrCodeModal from "@/components/common/QrCodeModal.vue";
import ConfirmModal from "@/components/common/Modal.vue";
import AddMembership from "@/components/membership/AddMembership.vue";
import Errors from "@/components/common/Error.vue";
import { ParkingService } from "~/services/ParkingService";
import { formatDate } from "@/utils/index";
import moment from "moment";
import { PaymentService } from "~/services/PaymentService";
import QrcodeVue from 'qrcode.vue'

definePageMeta({
  layout: "auth-layout",
});
const inputClass =
  "relative appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";

const list = ref([]);
const loadingError = ref(null);
const isLoading = ref(true);
const showConfirmModal = ref(false);
const showQrCode = ref(false);
const serverErrors = ref(null);

//pagination
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);
const paymentMethod = ref("cash");
const receivedAmount = ref(0);
const payableAmount = ref(0);
const parkingId = ref(null);

const route = useRoute();
const router = useRouter();
const barcode = route.params.barcode;
const config = useRuntimeConfig();
const url = config.public.APP_URL
const routeName = computed(()=> router);
const qrCodeUrl = computed(()=> url + route.href);
const authUser = computed(()=> localStorage.getItem("LOGIN_ACCOUNT"));

const searchQuery = computed(() => {
  return `?barcode=${barcode}&include=p.slot,p.category,p.place,p.floor,p.vehicle,v.membership,m.mt,p.tariff,t.parking_rates,p.payment`;
});
const parkingResponse = ref(null);
const receivedAmountRef = ref(null);
const currentTime = ref(moment());
const durationInMinutes = computed(() => {
  const result = parkingResponse.value;
  if (!result) {
    return 0;
  }
  const inTime = moment(result.in_time);
  const differenceInMillis = currentTime.value.diff(inTime);

  // Create a duration object
  const duration = moment.duration(differenceInMillis);

  // Extract total time in minutes
  return Math.ceil(duration.asMinutes());
});
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

  return Math.round(Number(total).toFixed(2));
});
const parkingData = computed(() => {
  const obj = {
    out_time: formatDate(currentTime.value, "YYYY-MM-DD HH:mm:ss"),
    duration: durationInMinutes.value,
    payment: {
      method: paymentMethod.value,
      paid_amount: Math.round(receivedAmount.value),
      payable_amount: Math.round(totalCost.value),
      discount_amount: Math.floor(discountAmount.value),
    },
  };
  return obj;
});
const hasDuePayment = computed(() => {
  if (parkingResponse.value?.payment) {
    const payment = parkingResponse.value.payment
    const { paid_amount, payable_amount, method } = payment;
    if (paid_amount != payable_amount && method == "due") {
      return true;
    }
    return false
  }

  return false;
});
const duePayment = computed(() => {
  if (hasDuePayment.value) {
    return parkingResponse.value.payment;
  }
  return null;
});

const barcodeImage = ref("");
const parking_rates = ref([]);
class CustomError extends Error {
  constructor(message, errors) {
    super(message);
    this.name = "CustomError";
    this.errors = errors;
  }

  toString() {
    return `${this.name} [${this.code}]: ${this.message}`;
  }
}
const vehicleId = ref(null);
const vehicle = ref(null);
const membershipHasFlatDiscount = computed(()=> {
  const type = vehicle.value?.membership?.membership_type?.discount_type
  return type == 'flat'
})
const membershipHasPercentageDiscount = computed(()=> {
  const type = vehicle.value?.membership?.membership_type?.discount_type
  return type == 'percentage'
})
const discountAmount = ref(0);
const loadData = async () => {
  try {
    isLoading.value = true;
    const { data } = await ParkingService.getAll(searchQuery.value);
    if (data?.length) {
      const result = data[0];
      parkingResponse.value = data[0];
      barcodeImage.value = result.barcode_image;
      parkingId.value = result.id;
      vehicleId.value = result?.vehicle?.id;
      vehicle.value = result?.vehicle;

      parking_rates.value = result.tariff.parking_rates;
      discountAmount.value = 0;
      list.value = data.map((item) => {
        if (item.out_time) {
          currentTime.value = moment(item.out_time);
        }
        const duration = moment.duration(currentTime.value.diff(item.in_time));
        const hours = Math.floor(duration.asHours());
        const minutes = Math.floor(duration.minutes());
        const seconds = Math.floor(duration.seconds());
        const totalTime = `${hours}h ${minutes}m ${seconds}s`;
        let discount = 0;
        if (item?.vehicle?.membership?.membership_type) {
          const { discount_type, discount_amount } =
            item.vehicle.membership.membership_type;
          if (discount_type == "percentage") {
            if (discount_amount) {
              discount = (totalCost.value * parseFloat(discount_amount)) / 100;
            }
          } else if (discount_type == "flat") {
            discount = parseFloat(discount_amount) ?? 0;
          } else if (discount_type == "free") {
            discount = totalCost.value;
          }
          discountAmount.value = discount;
        }
        return {
          "Vehicle Number": item.vehicle?.number,
          Place: item.place?.name,
          Category: item.category?.name,
          Floor: item.floor?.name,
          Slot: item.slot?.name,
          "Driver Name": item.vehicle?.driver_name,
          "Driver Mobile": item.vehicle?.driver_mobile,
          "Check-in-Time": item.in_time ? formatDate(item.in_time) : "--",
          "Check-out-Time": formatDate(currentTime.value),
          Status:
            item.vehicle?.status == "checked_in" ? "Checked-in" : "Checked-out",
          Duration: totalTime,
          "Total Amount": totalCost.value + "৳",
          "Discount Applied": Number(discount).toFixed(2) + "৳",
          Subtotal:
            Math.round(Number(totalCost.value - discount).toFixed(2)) + "৳",
        };
      });

      serverErrors.value = {};
    } else {
      const errors = {
        no_data: [`"No data available for this barcode"`],
      };
      throw new CustomError("Data error", errors);
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
  document.getElementById("receivedAmountId").style.display = "none";
  document.getElementById("paymentMethodId").style.display = "none";
  list.value[0]["Payment method"] = paymentMethod.value ?? "";
  list.value[0]["Received amount"] = receivedAmount.value ?? "";

  nextTick(() => {
    const emailT = emailTemplate.value.outerHTML;

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
  });
};
const subtotal = computed(()=> Math.ceil(totalCost.value - discountAmount.value))
const checkoutLoading = ref(false)
const confirmCheckout = async () => {
  if (subtotal.value > receivedAmount.value){
    paymentMethod.value = "due";
  }
  checkoutLoading.value = true
  try {
    const result = await ParkingService.handleCheckout(
      parkingId.value + "?include=p.vehicle,v.membership",
      parkingData.value
    );
    
    print();
    if (result?.data?.redirect_url) {
      window.location.href = result.data.redirect_url
    }else {
      vehicle.value = { ...result?.data?.vehicle, status: "checked_out" };
    }
  } catch (error) {}
  finally {
    checkoutLoading.value = false
    closeConfirmModal()
  }
};
const showAlertMessage = computed(() => {
  const subtotal = Math.ceil(totalCost.value - discountAmount.value);
  const result = subtotal == receivedAmount.value;
  if (result) {
    return "";
  } else if (subtotal < receivedAmount.value) {
    return "Are you sure receiving more amount than total?";
  }
  return "Are you sure receiving less amount than total? Payment will be due.";
});

const checkoutAndprint = () => {
  try {
    const subtotal = Math.ceil(totalCost.value - discountAmount.value);
    const result = subtotal == receivedAmount.value;
    const total = subtotal;
    console.log(
      { totalCost: totalCost.value },
      { receivedAmount: receivedAmount.value },
      { discountAmount: discountAmount.value },
      { subtotal: subtotal },
      {
        "totalCost.value - discountAmount.value": Math.ceil(
          totalCost.value - discountAmount.value
        ),
      }
    );

    //return
    if (result) {
      confirmCheckout();
    } else {
      if (subtotal < receivedAmount.value) {
        if (confirm("Are you sure receiving more amount than total?")) {
          confirmCheckout();
        }
      } else {
        const text =
          "Are you sure receiving less amount than total? Payment will be due.";
        if (confirm(text)) {
          paymentMethod.value = "due";
          confirmCheckout();
          // const errors = {
          //   paidAmount: [`Please pay ${totalCost.value} taka`],
          // };
          // throw new CustomError("Validation error", errors);
        } else {
          paymentMethod.value = "cash";
        }
      }
    }
  } catch (error) {
    if (error.errors) {
      serverErrors.value = error.errors;
    }
  }
};

const payDue = async () => {
  const payable_amount = parseFloat(duePayment.value.payable_amount);
  const paid_amount = parseFloat(duePayment.value.paid_amount);
  const remaining = payable_amount - paid_amount - discountAmount.value;
  if (receivedAmount.value == remaining) {
    const obj = {
      paid_amount:
        parseFloat(receivedAmount.value) +
        parseFloat(duePayment.value.paid_amount),
      method: paymentMethod.value,
      discount_amount: discountAmount.value,
    };
    try {
      await PaymentService.update(duePayment.value.id, obj);
      router.push("/parking?barcode=" + barcode);
    } catch (error) {
      serverErrors.value = error.errors;
    }
  } else {
    alert(`Please pay exact ${remaining} taka in received amount field!`);
  }
};
const title1 =
  "Are you sure receiving less amount than total? Payment will be due.";
const title2 = "Are you sure receiving more amount than total?";
const confirmTitle = ref(title1);
const closeConfirmModal = () => {
  showConfirmModal.value = false;
};
const showConfirmModaDialog = () => {
  showConfirmModal.value = true;
};
const toggleQrCode = () => {
  showQrCode.value = true;
  console.log(route, router);
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
.membership-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
}
.feedback {
  background-color: #31b0d5;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  border-color: #46b8da;
}

#mybutton {
  position: fixed;
  bottom: 6%;
  right: 50%;
  left: 50%;
}
</style>
