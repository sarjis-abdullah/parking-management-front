<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="onClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative" :class="[maxWidth, minWidth]">
              <div>
                <div
                  class="inline-block text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl my-[70px] sm:my-[100px] max-w-[58mm] opacity-100 translate-y-0 sm:scale-100"
                >
                  <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                      <div
                        class="mt-3 text-center sm:mt-0 sm:ml-0 sm:text-left"
                      >
                        <div class="flex items-center justify-between">
                          <h2
                            class="text-xl font-medium leading-6 text-gray-900"
                            id="headlessui-dialog-title-12"
                          >
                            {{ title }}
                          </h2>
                          <button @click="onClose">
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="1"
                                  d="M6 18L18 6M6 6l12 12"
                                ></path>
                              </svg>
                            </span>
                          </button>
                        </div>
                        <hr class="my-2" />
                        <section
                          id="receipt"
                          ref="captureRef"
                          style="
                            word-spacing: normal;
                            background-color: rgb(255, 255, 255);
                          "
                        >
                          <div
                            style="
                              margin: 0px auto;
                              padding: 0;
                              text-size-adjust: 100%;
                              background-color: rgb(255, 255, 255);
                              max-width: 300px;
                            "
                          >
                            <table style="width: 100%">
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      margin: 0px;
                                      text-align: center;
                                      font-family: Poppins;
                                    "
                                  >
                                    <div
                                      style="
                                        margin: 0px;
                                        font-weight: 500;
                                        font-size: 16px;
                                      "
                                    >
                                      Khulshi Mart
                                    </div>
                                    <div style="font-weight: 500; font-size: 10px">VEHICLE CHECK-OUT RECEIPT</div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="flex justify-between mt-1">
                                    <li
                                      style="
                                        font-family: Inter;
                                        font-size: 10px;
                                        font-weight: 500;
                                        line-height: 12px;
                                        list-style-type: none;
                                        color: rgb(0, 0, 0);
                                        margin-bottom: 5px;
                                      "
                                    >
                                      Date:
                                      <span style="font-weight: 400">{{
                                        currentDate
                                      }}</span>
                                    </li>
                                    <li
                                      style="
                                        font-family: Inter;
                                        font-size: 10px;
                                        font-weight: 500;
                                        line-height: 12px;
                                        list-style-type: none;
                                        color: rgb(0, 0, 0);
                                        margin-bottom: 5px;
                                      "
                                    >
                                      Time:
                                      <span style="font-weight: 400">{{
                                        currentTime
                                      }}</span>
                                    </li>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <ul style="padding-left: 0px; margin: 0px">
                                      <span class="flex justify-between"
                                        ><li
                                          style="
                                            font-family: Inter;
                                            font-size: 10px;
                                            font-weight: 500;
                                            line-height: 12px;
                                            list-style-type: none;
                                            color: rgb(0, 0, 0);
                                            margin-bottom: 5px;
                                          "
                                        >
                                          Transaction No:
                                          <span style="font-weight: 400"
                                            >{{transactionId}}</span
                                          >
                                        </li>
                                      </span>
                                      <li
                                        style="
                                          font-family: Inter;
                                          font-size: 10px;
                                          font-weight: 500;
                                          line-height: 12px;
                                          list-style-type: none;
                                          color: rgb(0, 0, 0);
                                          margin-bottom: 5px;
                                        "
                                      >
                                        Served By:<span style="font-weight: 400"
                                          >Admin</span
                                        >
                                      </li>
                                    </ul>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <div style="margin-top: 10px">
                                      <ul
                                        style="padding-left: 0px; margin: 0px"
                                      >
                                        <li
                                          class="border-b-0"
                                          style="
                                            font-family: Inter;
                                            font-size: 10px;
                                            font-weight: 400;
                                            line-height: 12px;
                                            list-style-type: none;
                                            padding-bottom: 20px;
                                            color: rgb(0, 0, 0);
                                          "
                                        >
                                          <div
                                            v-for="item in checkoutData"
                                            :key="item.key"
                                            :style="itemClass"
                                          >
                                            <span>{{ item.key }}</span>
                                            <span>{{ item.value }}</span>
                                          </div>
                                        </li>
                                      </ul>
                                      <ul
                                        style="padding-left: 0px; margin: 0px"
                                      ></ul>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table style="display: flex">
                              <tfoot style="margin: auto">
                                <div
                                  v-if="parking.paid_now < 1"
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
                                    "
                                  >
                                    <img
                                      :src="
                                        'data:image/png;base64,' + parking?.barcode_image
                                      "
                                      alt="barcode"
                                      style="width: auto"
                                    />
                                  </div>

                                  <div
                                    style="position: absolute; inset: 0"
                                  ></div>
                                </div>
                                <div
                                  style="
                                    text-align: center;
                                    margin-top: 5px;
                                    font-family: Inter;
                                    font-size: 10px;
                                    font-weight: 400;
                                    line-height: 12px;
                                  "
                                >
                                  Thank you for choosing Khulshi Mart
                                </div>
                              </tfoot>
                            </table>
                          </div>
                        </section>
                        <div
                          class="no-print focus-product-search"
                          style="text-align: center; margin: 15px 0px 20px"
                        >
                          <button
                            class="hover:bg-gray-200"
                            id="printBUtton"
                            ref="myButton"
                            tabindex="0"
                            style="
                              display: inline-flex;
                              align-items: center;
                              border: 2px solid rgb(204, 204, 204);
                              border-radius: 5px;
                              padding: 10px 20px;
                              text-decoration: none;
                              font-family: Inter;
                              font-size: 10px;
                              font-weight: 600;
                              line-height: 15.73px;
                              color: rgb(0, 0, 0);
                            "
                            @click="exportImage"
                          >
                            Print
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { defineProps, onMounted, ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { formatDate } from "@/utils/index.js";
import { toPng } from "html-to-image";

import { XMarkIcon } from "@heroicons/vue/20/solid";
import moment from "moment";
const props = defineProps({
  title: {
    type: String,
    default: "Invoice",
  },
  maxWidth: {
    type: String,
    default: "sm:max-w-sm",
  },
  minWidth: {
    type: String,
    default: "sm:min-w-sm",
  },
  open: {
    type: Boolean,
    default: false,
  },
  pdfData: {
    type: [Array, Object],
    default: false,
  },
});
const emit = defineEmits(["onClose"]);
const currentDate = moment().format("DD-MM-YYYY");
const currentTime = moment().format("hh:mm A");
const itemClass = `display: flex;justify-content: space-between; border-bottom: 1px dashed rgb(131, 131, 131); padding: 4px 0 4px 0`;
const myButton = ref(null);
const onClose = () => {
  emit("onClose");
};
const parking = computed(()=> {
  if (!(props.pdfData && props.pdfData.length)) {
    return '';
  }
  return props.pdfData[0].parking

})
const checkoutData = computed(() => {
  if (!(props.pdfData && props.pdfData.length)) {
    return [];
  }
  const payment = props.pdfData[0];
  const bool = route.query?.transaction_id && route.query?.batch_payment && payment.paid_amount > 0
  if (bool) {
    return [
      {
        key: "Total amount paid",
        value: "৳ " + payment.paid_now,
      },
      {
        key: "Payment method",
        value: payment.method,
      },
    ]
  }
  const parking = payment.parking;
  // Extract relevant fields from the data
  const outTime = new Date(parking.out_time);
  let currentTime = 0
  if (parking.out_time) {
    currentTime = moment(parking.out_time);
  }
  const duration = moment.duration(currentTime.diff(parking.in_time));
  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.minutes());
  const seconds = Math.floor(duration.seconds());

  const checkoutTime = formatDate(outTime, 'DD-MM-YYYY') + ' ' + formatDate(outTime, 'hh:mm A'),
    vehicleNo = parking.vehicle.number,
    type = parking.category.name,
    block = parking.place.name,
    slot = parking.slot.name,
    totalHours = hours,
    totalMinutes = minutes,
    totalSeconds = seconds,
    parkingFee = parseFloat(payment.payable_amount),
    discounts = parseFloat(payment.discount_amount) + parseFloat(payment.membership_discount),
    floor = parking.floor.name,
    totalAmount = parseFloat(payment.paid_amount), // Assuming no additional calculations needed
    totalDue = parseFloat(payment.due_amount), // Assuming no additional calculations needed
    paymentMethod = payment.method;
  return [
    {
      key: "Checkout time",
      value: checkoutTime,
    },
    {
      key: "Vehicle no",
      value: vehicleNo,
    },
    {
      key: "Type",
      value: type,
    },
    {
      key: "Block",
      value: block,
    },
    {
      key: "Slot",
      value: slot,
    },
    {
      key: "Floor",
      value: floor,
    },
    {
      key: "Total hours",
      value: totalHours + " hour(s)",
    },
    {
      key: "Total minutes",
      value: totalMinutes + " minute(s)",
    },
    {
      key: "Total seconds",
      value: totalSeconds + " second(s)",
    },
    {
      key: "Parking fee",
      value: "৳ " + parkingFee,
    },
    {
      key: "Discounts",
      value: "৳ " + discounts,
    },
    {
      key: "Total amount",
      value: "৳ " + totalAmount,
    },
    {
      key: "Total due",
      value: "৳ " + totalDue,
    },
    {
      key: "Payment method",
      value: paymentMethod,
    },
  ];
});
const captureRef = ref(null);

const exportImage = async () => {
  try {
    if (captureRef.value) {
      const dataUrl = await toPng(captureRef.value, {
        width: 220, // Adjust for approximate 58mm (220px ~ 58mm at 96dpi)
      });

      // Create a link and download the image
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = parking.value?.barcode ? parking.value?.barcode + "checkout.png" : "exported-content.png";
      link.click();
    }
  } catch (error) {
    console.error("Error exporting image:", error);
  }
};
function printReceipt() {
  //window.print();
  const content = document.getElementById("receipt").innerHTML;

  // Open a new window
  const newWindow = window.open("", "", "height=600,width=800");

  // Write the selected content into the new window with custom print-specific styles
  newWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              /* Reset default margins and padding */
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                font-size: 10px;
              }

              /* Customize printed content size */
              #print-content {
                width: 58mm; /* Adjust this value to control content width */
                margin: auto;
              }

              /* Other custom styles */
              h2 {
                font-size: 16px;
                margin-bottom: 10px;
              }
              p {
                font-size: 10px;
                line-height: 1.5;
              }
              button {
                display: none;
              }
            </style>
          </head>
          <body>
            <div id="print-content">
              ${content}
            </div>
          </body>
        </html>
      `);

  // Close the new document stream and trigger print
  newWindow.document.close();
  newWindow.print();
  emit("onClose");
}
const route = useRoute()
const transactionId = computed(()=> route.query?.transaction_id ?? parking.value?.barcode)
onMounted(() => {
  if (myButton.value) {
    myButton.value.focus();
  }
});
</script>

<style>
body {
  font-family: Arial, sans-serif;
  padding: 0;
}

#receipt {
  max-width: 58mm; /* Size for small printed receipts */
  font-size: 10px; /* Reduce font size */
}

/* Print-specific CSS */
@media print {
  /* Hide elements that shouldn't be printed */
  button {
    display: none;
  }

  /* Style the receipt to fit onto a small printed page */
  #receipt {
    margin: 0;
    padding: 0;
    max-width: 58mm; /* Set fixed width for receipt */
    height: auto;
    border: none;
  }

  body {
    margin: 0;
    padding: 0;
  }
  .page:nth-child(n + 2) {
    display: none; /* Hide pages after the first one */
  }

  /* Ensure that the receipt fits on a single page */
  @page {
    margin: 0; /* Remove default margins */
    size: 13in 13in;
  }

  /* Ensure content fits in one page */
  html,
  body {
    max-width: 58mm;
    height: auto;
    overflow: hidden; /* Prevent content overflow */
  }
}
</style>
