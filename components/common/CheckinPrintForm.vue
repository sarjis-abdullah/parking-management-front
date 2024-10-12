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
                  class="inline-block text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl my-[70px] sm:my-[100px] sm:align-middle sm:max-w-xl sm:w-auto md:max-w-5xl opacity-100 translate-y-0 sm:scale-100"
                >
                  <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                      <div
                        class="mt-3 text-center sm:mt-0 sm:ml-0 sm:text-left"
                      >
                        <!-- <div class="flex items-center justify-between">
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
                        <hr class="my-2" /> -->
                        <section
                          id="receipt"
                          style="
                            word-spacing: normal;
                            background-color: rgb(229, 229, 229);
                          "
                        >
                          <div
                            style="
                              margin: 0px auto;
                              padding: 0px;
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
                                      font-family: Poppins;

                                      color: rgb(0, 15, 26);
                                      text-align: center;
                                    "
                                  >
                                    <div
                                      style="
                                        font-weight: 500;
                                        font-size: 20px;
                                        line-height: 30px;
                                      "
                                    >
                                      Khulshi Mart
                                    </div>
                                    <div
                                      style="font-weight: 500; font-size: 12px"
                                    >
                                      VEHICLE CHECK-IN RECEIPT
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="flex justify-between mt-1">
                                    <li
                                      style="
                                        font-family: Inter;
                                        font-size: 12px;
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
                                        font-size: 12px;
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
                                            font-size: 12px;
                                            font-weight: 500;
                                            line-height: 12px;
                                            list-style-type: none;
                                            color: rgb(0, 0, 0);
                                            margin-bottom: 5px;
                                          "
                                        >
                                          Invoice No:
                                          <span style="font-weight: 400"
                                            >BN003861</span
                                          >
                                        </li>
                                      </span>
                                      <li
                                        style="
                                          font-family: Inter;
                                          font-size: 12px;
                                          font-weight: 500;
                                          line-height: 12px;
                                          list-style-type: none;
                                          color: rgb(0, 0, 0);
                                          margin-bottom: 5px;
                                        "
                                      >
                                        Served By:<span style="font-weight: 400"
                                          >Super admin</span
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
                                            font-size: 12px;
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
                            <table style="display: flex;">
                              <tfoot style="margin: auto">
                                <div
                                  style="
                                    position: relative;
                                    width: 100%;
                                  "
                                >
                                  <div
                                    style="
                                      border: 1px solid rgba(0, 0, 0, 0.1);
                                      display: flex;
                                      justify-content: center;
                                    "
                                  >
                                    <img
                                      :src="
                                        'data:image/png;base64,' + barcodeImage
                                      "
                                      alt="barcode"
                                      style="width: auto; min-height: 3rem"
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
                                    font-size: 12px;
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
                              font-size: 12px;
                              font-weight: 600;
                              line-height: 15.73px;
                              color: rgb(0, 0, 0);
                            "
                            @click="printReceipt"
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
import moment from "moment";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/20/solid";
const props = defineProps({
  title: {
    type: String,
    default: "Payment Invoice",
  },
  maxWidth: {
    type: String,
    default: "sm:max-w-sm",
  },
  minWidth: {
    type: String,
    default: "sm:min-w-sm",
  },
  barcodeImage: {
    type: String,
    default: "",
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
const currentTime = moment().format("HH:mm A");
const itemClass = `display: flex;justify-content: space-between; border-bottom: 1px dashed rgb(131, 131, 131); padding: 4px 0 4px 0`;
const myButton = ref(null);
const onClose = () => {
  emit("onClose");
};
const checkoutData = computed(() => {
  if (!(props.pdfData && props.pdfData.length)) {
    return [
      {
        key: "Vehicle No",
        value: "12345",
      },
      {
        key: "Type",
        value: "Car",
      },
      {
        key: "Block",
        value: "block",
      },
      {
        key: "Slot",
        value: "slot",
      },
      {
        key: "Floor",
        value: "floor",
      },
      {
        key: "Driver",
        value: "Ismail",
      },
      {
        key: "Driver number",
        value: "01521487679",
      },
    ];
  }
  const item = props.pdfData[0];

  const vehicleNo = item.vehicle?.number,
    type = item.category.name,
    block = item.place.name,
    slot = item.slot.name,
    floor = item.floor.name,
    driverName = item.vehicle?.driver_name,
    driverMobile = item.vehicle?.driver_mobile,
    checkInTime = formatDate(item.vehicle?.in_time, "DD-MM-YYYY hh:mm A");
  return [
    {
      key: "Checkin Time",
      value: checkInTime,
    },
    {
      key: "Vehicle No",
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
      key: "Driver",
      value: driverName,
    },
    {
      key: "Driver number",
      value: driverMobile,
    },
  ];
});
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
                font-size: 12px;
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
                font-size: 12px;
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
onMounted(() => {
  if (myButton.value) {
    myButton.value.focus();
  }
});
</script>

<style>
body {
  font-family: Arial, sans-serif;
  padding: 20px;
}

#receipt {
  width: 58mm; /* Size for small printed receipts */
  font-size: 12px; /* Reduce font size */
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
    width: 58mm; /* Set fixed width for receipt */
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
    width: 58mm;
    height: auto;
    overflow: hidden; /* Prevent content overflow */
  }
}
</style>
