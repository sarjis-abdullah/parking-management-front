<template>
  <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg">
    <div class="flow-root">
      <div class="-mx-4 -mt-2 mb-12 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full align-middle sm:px-6 lg:px-8">
          <div v-if="!loadingError && !isLoading">
            <div
              v-if="listAllData && listAllData?.length > 0"
              class="grid md:grid-cols-3 md:justify-center gap-4 p-4 md:p-0"
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

                    <dl style="margin-top: 0.75rem">
                      <div
                        v-for="(item, index) in listAllData"
                        :key="index"
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          border-top: 1px solid #e5e7eb;
                          padding: 0.5rem 0 0.5rem 0;
                        "
                      >
                        <dt style="font-size: 0.875rem; color: #6b7280">
                          {{ item.key }}
                        </dt>
                        <dd style="font-size: 0.875rem; font-weight: 500">
                          {{ item.value }}
                        </dd>
                      </div>
                      <section v-if="!parkingResponse.out_time">
                        <div
                          v-if="!parkingResponse.out_time"
                          style="
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            border-top: 1px solid rgb(229, 231, 235);
                            padding: 0.5rem 0 0.5rem 0;
                          "
                        >
                          <dt
                            style="
                              font-size: 0.875rem;
                              color: rgb(107, 114, 128);
                            "
                          >
                            Payment method
                          </dt>
                          <select
                            v-if="authUser?.id"
                            class="focus:outline-none bg-none"
                            :class="inputClass"
                            style="background: none"
                            name="place"
                            v-model="paymentMethod"
                          >
                            <option
                              v-for="category in paymentMethods"
                              :key="category"
                              :value="category"
                            >
                              {{ category }}
                            </option>
                          </select>
                          <span v-else class="capitalize">
                            {{ paymentMethod }}
                          </span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 items-center pb-2" v-if="authUser?.id && paymentMethod != 'cash'">
                          <input
                            class="focus:outline-none bg-none text-right"
                            :class="inputClass"
                            type="number"
                            v-model="refNumber"
                            placeholder="Reference number"
                          />
                          <input
                            class="focus:outline-none bg-none text-right"
                            :class="inputClass"
                            type="number"
                            v-model="transactionNumber"
                            placeholder="Transaction number"
                          />
                        </div>
                        <div
                          v-if="!parkingResponse.out_time"
                          style="
                            display: none;
                            align-items: center;
                            justify-content: space-between;
                            border-top: 1px solid rgb(229, 231, 235);
                            padding-top: 1rem;
                          "
                        ></div>
                        <div
                          v-if="!parkingResponse.out_time"
                          style="
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            border-top: 1px solid rgb(229, 231, 235);
                            padding: 0.5rem 0 0.5rem 0;
                          "
                        >
                          <select
                            class="focus:outline-none bg-none"
                            :class="inputClass"
                            style="background: none"
                            name="place"
                            v-model="selectedDiscountType"
                            @change="handleDiscountTypeChange"
                          >
                            <option
                              v-for="category in ['Discount', 'Coupon code']"
                              :key="category"
                              :value="category"
                            >
                              {{ category }}
                            </option>
                          </select>
                          <div
                            class="flex justify-between items-center"
                            v-if="selectedDiscountType == 'Discount'"
                          >
                            <input
                              v-if="authUser?.id"
                              class="focus:outline-none bg-none text-right max-w-[5rem]"
                              :class="inputClass"
                              type="number"
                              :disabled="!authUser?.id"
                              v-model="instantDiscount"
                              placeholder="0.00 taka"
                              min="0"
                            />
                            <span v-else>
                              {{ "৳ " + instantDiscount }}
                            </span>
                          </div>
                          <div
                            class="flex justify-between items-center gap-1"
                            v-else
                          >
                            <input
                              class="focus:outline-none bg-none text-right max-w-[6rem]"
                              :class="inputClass"
                              type="text"
                              v-model="couponCode"
                              placeholder="Coupon"
                            />
                            <button
                              @click="applyCouponCode"
                              class="bg-indigo-600 text-white px-2 py- rounded-md ml-1"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                        <div
                          v-if="!parkingResponse.out_time"
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
                            style="
                              font-size: 0.875rem;
                              color: rgb(107, 114, 128);
                            "
                          >
                            Received amount
                          </dt>
                          <input
                            class="focus:outline-none bg-none text-right max-w-[5rem]"
                            :class="inputClass"
                            type="number"
                            v-model="receivedAmount"
                            placeholder="৳ 0.00"
                            min="0"
                            :disabled="finalTotalAmount == 0 ? true : false"
                          />
                        </div>
                      </section>
                      <!-- <div
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
                      </div> -->
                    </dl>
                  </div>
                </div>
                <div class="flex justify-end flex-col gap-2">
                  <div
                    v-if="
                      hasDuePayment && vehicle?.status == 'checked_out' && false
                    "
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
                              membershipDiscountAmount
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
                  <!-- <button
                    v-if="vehicle?.status == 'checked_out'"
                    @click="print"
                    type="submit"
                    class="mt-6 w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Print
                  </button> -->
                  <div
                    v-if="vehicle?.status != 'checked_out'"
                    class="mx-4 mt-4 px-3"
                  >
                    <button
                      @click="showPaymentConfirmModaDialog()"
                      :disabled="disabledPaymentButton"
                      :class="
                        disabledPaymentButton
                          ? 'bg-slate-500'
                          : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 '
                      "
                      class="rounded-md border w-full border-transparent px-3 py-2 text-white text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      Payment
                    </button>
                    <!-- <button
                      v-if="paymentMethod == 'online' && authUser?.id"
                      @click="toggleQrCode"
                      :disabled="disabledPaymentButton"
                      :class="
                        disabledPaymentButton
                          ? 'bg-slate-500'
                          : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 '
                      "
                      class="mt-2 rounded-md border w-full border-transparent px-3 py-2 text-white text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      Payment by QR code
                    </button> -->
                    <!-- <button
                      v-else-if="paymentMethod == 'online' && !authUser?.id"
                      @click="confirmCheckout"
                      :disabled="checkoutLoading"
                      :class="
                        checkoutLoading
                          ? 'bg-slate-500'
                          : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 '
                      "
                      class="mt-2 rounded-md border w-full border-transparent px-3 py-2 text-white text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      Continue
                    </button> -->
                  </div>
                </div>
              </div>
              <div v-if="vehicle?.membership?.id">
                <ul class="shadow-lg">
                  <li
                    v-if="vehicle.membership"
                    class="membership-item hover:bg-slate-100"
                  >
                    <span
                      class="px-4 py-2 text-white rounded-md"
                      :class="
                        vehicle.membership.active
                          ? 'bg-green-500'
                          : 'bg-yellow-500'
                      "
                      >{{
                        vehicle.membership.active ? "Active" : "Not-active"
                      }}</span
                    >
                  </li>
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
                        membershipHasPercentageDiscount
                          ? parseInt(
                              vehicle.membership.membership_type.discount_amount
                            ) ?? 0
                          : vehicle.membership.membership_type
                              .discount_amount ?? 0
                      }}
                      <span v-if="membershipHasFlatDiscount">৳</span>
                      <span v-else-if="membershipHasPercentageDiscount">%</span>
                      <span v-else>Free</span>
                    </span>
                  </li>
                </ul>
              </div>
              <div v-else class="">
                <AddMembership
                  v-if="authUser"
                  @refetch="loadData"
                  :vehicleId="vehicleId"
                />
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
          <p>{{ showAlertMessage }}</p>
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
              :class="
                checkoutLoading
                  ? 'bg-gray-600 text-white'
                  : 'bg-indigo-600 text-white'
              "
              class="px-2 py-1 border-gray-300 rounded-md"
            >
              Checkout
            </button>
          </div>
        </template>
      </ConfirmModal>
      <QrCodeModal
        :open="showQrCode"
        @onClose="closeQrCodeModal"
        :value="qrCodeUrl"
      >
      </QrCodeModal>
      <ServerError :error="serverErrors" />
      <!-- <CheckoutForm :v-show="showInvoice" @onClose="showInvoice = false" /> -->
    </div>
  </div>
</template>
<script setup>
import { onMounted, nextTick, computed, ref } from "vue";
import Link from "@/components/common/Link.vue";
import Pagination from "@/components/common/Pagination.vue";
import ServerError from "@/components/common/Error.vue";
import Loading from "@/components/common/Loading.vue";
// import CheckoutForm from "~/components/common/CheckoutPrintForm.vue";
import QrCodeModal from "@/components/common/QrCodeModal.vue";
import ConfirmModal from "@/components/common/Modal.vue";
import AddMembership from "@/components/membership/AddMembership.vue";
import Errors from "@/components/common/Error.vue";
import { ParkingService } from "~/services/ParkingService";
import { formatDate } from "@/utils/index";
import moment from "moment";
import { PaymentService } from "~/services/PaymentService";
import QrcodeVue from "qrcode.vue";
import { DiscountService } from "~/services/DiscountService";
import { authUser } from "~/hooks/useMenu";

definePageMeta({
  layout: "auth-layout",
});
const inputClass =
  "relative appearance-none rounded-md border border-gray-300 px-3 md:py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";

const list = ref([]);
const loadingError = ref(null);
const isLoading = ref(true);
const showConfirmModal = ref(false);
const showQrCode = ref(false);
const showInvoice = ref(false);
const serverErrors = ref(null);

//pagination
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);
const paymentMethod = ref("cash");
const receivedAmount = ref(0);
const instantDiscount = ref(0);
const couponCode = ref("");
const selectedDiscountType = ref("Discount");
const couponCodeResponse = ref(null);
const parkingId = ref(null);

const route = useRoute();
const router = useRouter();
const barcode = route.params.barcode;
const config = useRuntimeConfig();
const url = config.public.APP_URL;
const routeName = computed(() => router);
const qrCodeUrl = computed(() => url + route.href);

const searchQuery = computed(() => {
  return `?barcode=${barcode}&include=p.slot,p.category,p.place,p.floor,p.vehicle,v.membership,m.mt,p.tariff,t.parking_rates,p.payment`;
});
const parkingResponse = ref(null);
const receivedAmountRef = ref(null);
const transactionNumber = ref('');
const refNumber = ref('');
const paymentMethods = ref([
  "cash",
  "bkash",
  "nagad",
  "rocket",
  "upay",
  "tap",
  "online",
  "others",
]);
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
const formatDecimalNumber = (number) => Number(number).toFixed(2);
const totalParkingFees = computed(() => {
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

const hasDuePayment = computed(() => {
  if (parkingResponse.value?.payment) {
    const payment = parkingResponse.value.payment;
    const { paid_amount, payable_amount, method } = payment;
    if (paid_amount != payable_amount && method == "due") {
      return true;
    }
    return false;
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
const membershipHasFlatDiscount = computed(() => {
  const type = vehicle.value?.membership?.membership_type?.discount_type;
  return type == "flat";
});
const membershipHasPercentageDiscount = computed(() => {
  const type = vehicle.value?.membership?.membership_type?.discount_type;
  return type == "percentage";
});
const membershipDiscountAmount = computed(() => {
  if (!parkingResponse.value || !totalParkingFees.value) {
    return 0;
  }
  const membership = parkingResponse.value.vehicle?.membership;
  if (!membership?.active) {
    return 0;
  }
  let discount = 0;
  if (membership?.membership_type) {
    const { discount_type, discount_amount } = membership.membership_type;
    if (discount_type == "percentage") {
      if (discount_amount) {
        discount = (totalParkingFees.value * parseFloat(discount_amount)) / 100;
      }
    } else if (discount_type == "flat") {
      discount = parseFloat(discount_amount) ?? 0;
    } else if (discount_type == "free") {
      discount = totalParkingFees.value;
    }
  }
  return discount;
});
const calculatedCouponDiscount = computed(() => {
  let couponDis = 0;
  if (
    couponCodeResponse.value?.id &&
    couponCodeResponse.value?.is_active &&
    selectedDiscountType.value != "Discount"
  ) {
    let discount = 0;
    const { discount_type, amount } = couponCodeResponse.value;
    if (discount_type == "percentage") {
      if (amount) {
        discount = (totalParkingFees.value * parseFloat(amount)) / 100;
      }
    } else if (discount_type == "flat") {
      discount = parseFloat(amount) ?? 0;
    }
    couponDis = Number(discount).toFixed(2);
    return {
      key: "Discount on Promocode",
      value: formatDecimalNumber(Math.abs(parseFloat(couponDis))),
    };
  }
  if (instantDiscount.value && selectedDiscountType.value == "Discount") {
    couponDis = Number(instantDiscount.value).toFixed(2);
    return {
      key: "Instant discount",
      value: formatDecimalNumber(Math.abs(parseFloat(couponDis))),
    };
  }
  return 0;
});

const totalDiscount = computed(() => {
  let cDiscount = parseFloat(calculatedCouponDiscount.value?.value ?? 0);
  return Math.floor(membershipDiscountAmount.value + cDiscount);
});

const finalTotalAmount = computed(() => {
  return Number(
    Math.round(Number(totalParkingFees.value - totalDiscount.value))
  ).toFixed(2);
});
const listAllData = computed(() => {
  const item = parkingResponse.value;
  let presentTime = moment();
  if (item?.out_time) {
    presentTime = moment(item.out_time);
  }
  if (!item?.in_time) {
    return;
  }
  const duration = moment.duration(presentTime.diff(item.in_time));
  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.minutes());
  const seconds = Math.floor(duration.seconds());
  const totalTime = `${hours}h ${minutes}m ${seconds}s`;

  const list = [
    {
      key: "Checkout Time",
      value: formatDate(presentTime),
    },
    {
      key: "Vehicle No",
      value: item.vehicle?.number,
    },
    {
      key: "type",
      value: item.category?.name,
    },
    {
      key: "Block",
      value: item.place?.name,
    },
    {
      key: "Slot",
      value: item.slot?.name,
    },
    {
      key: "Floor",
      value: item.floor?.name,
    },
    {
      key: "Duration",
      value: totalTime,
    },
    {
      key: "Parking fee",
      value: "৳ " + Number(totalParkingFees.value).toFixed(2),
    },
  ];

  if (
    item?.vehicle?.status == "checked_out" &&
    item?.payment?.discount_amount
  ) {
    list.push({
      key: "Total discount",
      value: "৳ " + item?.payment?.discount_amount,
    });

    list.push({
      key: "Payable amount",
      value: "৳ " + item?.payment?.payable_amount,
    });

    list.push({
      key: "Paid amount",
      value: "৳ " + item?.payment?.paid_amount,
    });
    return list;
  } else {
    list.push({
      key: "Membership Discount",
      value: "৳ " + Number(membershipDiscountAmount.value).toFixed(2),
    });
  }

  if (calculatedCouponDiscount.value?.value) {
    const { key, value } = calculatedCouponDiscount.value;
    list.push({
      key,
      value: "৳ " + value,
    });
  }

  list.push({
    key: "Subtotal",
    value: "৳ " + finalTotalAmount.value,
  });
  return list;
});
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
      if (result.out_time) {
        currentTime.value = moment(result.out_time);
      }

      /*
      //old calculation
      return {
        "Vehicle Number": item.vehicle?.number,
        Place: item.place?.name,
        Category: item.category?.name,
        Floor: item.floor?.name,
        Slot: item.slot?.name,
        "Driver Name": item.vehicle?.driver_name,
        "Driver Mobile": item.vehicle?.driver_mobile,
        // "Check-in-Time": item.in_time ? formatDate(item.in_time) : "--",
        "Check-out-Time": formatDate(currentTime.value),
        Status:
          item.vehicle?.status == "checked_in" ? "Checked-in" : "Checked-out",
        Duration: totalTime,
        "Total Amount": totalParkingFees.value + "৳",
        "Discount Applied": Number(discount).toFixed(2) + "৳",
        Subtotal:
          Math.round(Number(totalParkingFees.value - discount).toFixed(2)) + "৳",
      };
      */
      serverErrors.value = {};
    } else {
      const errors = {
        no_data: [`"No data available "`],
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
const parkingDataToCheckout = computed(() => {
  const obj = {
    out_time: formatDate(currentTime.value, "YYYY-MM-DD HH:mm:ss"),
    duration: durationInMinutes.value,
    payment: {
      method: paymentMethod.value,
      paid_amount: Math.round(receivedAmount.value),
      payable_amount: parseFloat(totalParkingFees.value),
      // payable_amount: finalTotalAmount.value,
      discount_amount: parseFloat(calculatedCouponDiscount.value?.value ?? 0),
      membership_discount: membershipDiscountAmount.value ?? 0,
      txn_number: transactionNumber.value ?? 0,
      reference_number: refNumber.value ?? 0,
    },
  };
  if (couponCodeResponse.value) {
    obj.payment.discount_id = couponCodeResponse.value.id;
  }
  return obj;
});
const emailTemplate = ref(null);

const subtotal = computed(() =>
  Math.ceil(totalParkingFees.value - membershipDiscountAmount.value)
);
const checkoutLoading = ref(false);
const confirmCheckout = async () => {
  if (subtotal.value > receivedAmount.value) {
    // paymentMethod.value = "due";
  }
  checkoutLoading.value = true;
  try {
    const result = await ParkingService.handleCheckout(
      parkingId.value + "?include=p.vehicle,v.membership",
      parkingDataToCheckout.value
    );

    // print();
    if (result?.data?.redirect_url) {
      console.log(123456, result);
      window.location.href = result.data.redirect_url;
    } else {
      vehicle.value = { ...result?.data?.vehicle, status: "checked_out" };
    }
  } catch (error) {
    if (error.errors) {
      serverErrors.value = error.errors;
    }
  } finally {
    checkoutLoading.value = false;
    closeConfirmModal();
  }
};
const showAlertMessage = computed(() => {
  const subtotal = finalTotalAmount.value;
  const result = subtotal == receivedAmount.value;
  if (result) {
    return "";
  } else if (subtotal < receivedAmount.value) {
    return "Are you sure receiving more amount than total?";
  }
  const amount = Number(parseFloat(receivedAmount.value)).toFixed(2);
  const remaining = Number(
    parseFloat(subtotal) - parseFloat(receivedAmount.value)
  ).toFixed(2);
  return `You are paying ৳ ${amount} towards a ৳ ${subtotal} subtotal. A remaining balance of ৳ ${remaining} will be due.`;
});

const disabledPaymentButton = computed(() => {
  const fTotalAmount = parseFloat(finalTotalAmount.value);
  if (fTotalAmount < 0) {
    return true;
  }

  const parkingFee = parseFloat(totalParkingFees.value ?? 0);
  const amount =
    parseFloat(receivedAmount.value ?? 0) +
    parseFloat(totalDiscount.value ?? 0);
  if (amount > parkingFee) {
    return true;
  }
  if (totalParkingFees.value < totalDiscount.value) {
    return true;
  }
  return false;
});

const payDue = async () => {
  const payable_amount = parseFloat(duePayment.value.payable_amount);
  const paid_amount = parseFloat(duePayment.value.paid_amount);
  const remaining =
    payable_amount - paid_amount - membershipDiscountAmount.value;
  if (receivedAmount.value == remaining) {
    const obj = {
      paid_amount:
        parseFloat(receivedAmount.value) +
        parseFloat(duePayment.value.paid_amount),
      method: paymentMethod.value,
      discount_amount: membershipDiscountAmount.value,
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
const showPaymentConfirmModaDialog = () => {
  showConfirmModal.value = true;
};
const toggleQrCode = () => {
  showQrCode.value = true;
  const newQuery = {
    ...route.query,
    receivedAmount: receivedAmount.value,
    selectedDiscountType: selectedDiscountType.value,
    paymentMethod: paymentMethod.value,
  };

  if (selectedDiscountType.value == "Discount") {
    newQuery.instantDiscount = instantDiscount.value;
  } else {
    if (couponCodeResponse.value?.id && couponCode.value) {
      newQuery.couponCode = couponCode.value;
    }
  }

  router.push({ query: newQuery });
};
const closeQrCodeModal = () => {
  showQrCode.value = false;
  router.push({ query: {} });
};
const applyCouponCode = async () => {
  if (!couponCode.value) {
    return;
  }
  couponCodeResponse.value = null;
  try {
    const query = `?promo_code=${couponCode.value}`;
    const result = await DiscountService.getAll(query);
    console.log(result, 1234);
    if (result?.data?.length) {
      couponCodeResponse.value = result.data[0];
    }
  } catch (error) {
    couponCodeResponse.value = null;
  }
};

const handleDiscountTypeChange = () => {
  couponCodeResponse.value = null;
  couponCode.value = "";
  instantDiscount.value = 0;
};
watch(
  () => receivedAmount,
  (newValue, oldValue) => {
    if (
      receivedAmount.value &&
      receivedAmount.value > 0 &&
      paymentMethod.value == "due"
    ) {
      paymentMethod.value = "cash";
    }
  },
  {
    deep: true,
    immediate: false,
  }
);
watch(
  () => paymentMethod,
  (newValue, oldValue) => {
    if (
      receivedAmount.value &&
      receivedAmount.value > 0 &&
      paymentMethod.value == "due"
    ) {
      receivedAmount.value = 0;
    }
  },
  {
    deep: true,
    immediate: false,
  }
);
watch(
  route,
  (o, n) => {
    if (route.query) {
      const newQuery = {
        ...route.query,
      };
      if (route.query.receivedAmount) {
        receivedAmount.value = route.query.receivedAmount;
      }
      if (route.query.selectedDiscountType) {
        selectedDiscountType.value = route.query.selectedDiscountType;
      }
      if (route.query.paymentMethod) {
        paymentMethod.value = route.query.paymentMethod;
      }
      if (route.query.instantDiscount) {
        instantDiscount.value = route.query.instantDiscount;
      }
      if (route.query.couponCode) {
        couponCode.value = route.query.couponCode;
        applyCouponCode();
      }

      router.push({ query: newQuery });
    }
  },
  { deep: false, immediate: true }
);
watch(
  finalTotalAmount,
  (o, n) => {
    if (finalTotalAmount.value == 0) {
      receivedAmount.value = 0;
    }
  },
  { deep: true, immediate: true }
);
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
