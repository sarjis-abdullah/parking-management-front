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
                        <div class="flex items-center justify-between">
                          <h2
                            class="text-xl font-medium leading-6 text-gray-900"
                            id="headlessui-dialog-title-12"
                          >
                            {{ title }}
                          </h2>
                          <button tabindex="0">
                            <span
                              ><svg
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
                                ></path></svg
                            ></span>
                          </button>
                        </div>
                        <hr class="my-2" />
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
                              padding: 0px 10px;
                              text-size-adjust: 100%;
                              background-color: rgb(255, 255, 255);
                              max-width: 300px;
                            "
                          >
                            <table style="width: 100%">
                              <tbody>
                                <!-- <tr>
                                  <td
                                    style="
                                      text-align: center;
                                      padding-bottom: 4px;
                                    "
                                  >
                                    <img
                                        src="https://pos-stage.s3.ap-southeast-1.amazonaws.com/generic/AnILlCvKX8VATmzJLLMI__images.jpeg"
                                        alt=""
                                        style="
                                          margin: auto;
                                          max-height: 65px;
                                          max-width: 65px;
                                        "
                                      />
                                  </td>
                                </tr> -->
                                <tr>
                                  <td
                                    style="
                                      margin: 0px;
                                      font-family: Poppins;
                                      font-weight: 500;
                                      font-size: 20px;
                                      line-height: 30px;
                                      color: rgb(0, 15, 26);
                                      text-align: center;
                                    "
                                  >
                                    Khulshi Mart
                                  </td>
                                </tr>
                                <!-- <tr>
                                  <td
                                    style="
                                      margin: 0px 0px 5px;
                                      font-family: Inter;
                                      font-weight: 400;
                                      font-size: 14px;
                                      line-height: 15.73px;
                                      text-align: center;
                                      color: rgb(0, 0, 0);
                                    "
                                  >
                                    Branch: Banani Branch
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style="
                                      margin: 0px 0px 5px;
                                      font-family: Inter;
                                      font-weight: 400;
                                      font-size: 11px;
                                      line-height: 15.73px;
                                      text-align: center;
                                      color: rgb(0, 0, 0);
                                    "
                                  >
                                    Banani link road 550
                                  </td>
                                </tr>
                                <tr>
                                  <p
                                    style="
                                      margin: 0px;
                                      font-family: Inter;
                                      font-weight: 400;
                                      font-size: 11px;
                                      line-height: 15.73px;
                                      text-align: center;
                                      color: rgb(0, 0, 0);
                                    "
                                  >
                                    banani@gmail.com
                                  </p>
                                </tr>
                                <tr>
                                  <td
                                    style="
                                      margin: 0px;
                                      font-family: Inter;
                                      font-weight: 400;
                                      font-size: 11px;
                                      line-height: 15.73px;
                                      text-align: center;
                                      color: rgb(0, 0, 0);
                                    "
                                  >
                                    0178965874
                                  </td>
                                </tr> -->
                                <!-- <tr style="border-bottom: 1.5px solid black">
                                  <td class="flex justify-between">
                                    <li
                                      style="
                                        font-family: Inter;
                                        font-size: 12px;
                                        font-weight: 500;
                                        line-height: 12px;
                                        list-style-type: none;
                                        color: rgb(0, 0, 0);
                                      "
                                    >
                                      VAT Reg:<span style="font-weight: 500"
                                        >001118382-0201</span
                                      >
                                    </li>
                                    <li
                                      style="
                                        font-family: Inter;
                                        font-size: 12px;
                                        font-weight: 500;
                                        line-height: 12px;
                                        list-style-type: none;
                                        color: rgb(0, 0, 0);
                                      "
                                    >
                                      Mushak:<span style="font-weight: 500"
                                        >6.3</span
                                      >
                                    </li>
                                  </td>
                                </tr> -->
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
                                      <span style="font-weight: 400"
                                        >29-09-2024</span
                                      >
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
                                      <span style="font-weight: 400"
                                        >11:03 AM</span
                                      >
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
                                          class="border-b-0 mb-1.5"
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
                                          <div :style="itemClass">
                                            <span>Checkout</span>
                                            <span>YYYY-MM-DD HH:MM</span>
                                          </div>
                                          <div :style="itemClass">
                                            <span>Vehicle No</span>
                                            <span>12345</span>
                                          </div>
                                          <div :style="itemClass">
                                            <span>Type</span>
                                            <span>Car</span>
                                          </div>
                                          <div :style="itemClass">
                                            <span>Block</span>
                                            <span>A</span>
                                          </div>
                                          <div :style="itemClass">
                                            <span>Slot</span>
                                            <span>1</span>
                                          </div>
                                          <div :style="itemClass">
                                            <span>Total Hours</span>
                                            <span>2h</span>
                                          </div>
                                          <div :style="itemClass">
                                            <span>Total Minutes</span>
                                            <span>30m</span>
                                          </div>
                                          <div :style="itemClass">
                                            <span>Parking Fee</span>
                                            <span>৳ 300.00</span>
                                          </div>
                                          <div :style="itemClass">
                                            <span>Discounts</span>
                                            <span>৳ 300.00</span>
                                          </div>
                                          <div :style="itemClass">
                                            <span>Total Amount</span>
                                            <span>৳ 300.00</span>
                                          </div>
                                          <div :style="itemClass">
                                            <span>Payment Method</span>
                                            <span>Cash</span>
                                          </div>
                                        </li>
                                      </ul>
                                      <ul
                                        style="padding-left: 0px; margin: 0px"
                                      ></ul>
                                    </div>
                                  </td>
                                </tr>
                                <tr v-if="false">
                                  <td>
                                    <div style="margin-top: 5px">
                                      <ul
                                        style="padding-left: 0px; margin: 0px"
                                      >
                                        <li
                                          style="
                                            font-family: Inter;
                                            font-size: 12px;
                                            font-weight: 500;
                                            line-height: 12px;
                                            list-style-type: none;
                                            color: rgb(0, 0, 0);
                                            padding-bottom: 20px;
                                            border-bottom: 1px solid
                                              rgb(131, 131, 131);
                                            margin-bottom: 10px;
                                          "
                                        >
                                          <div>
                                            <span
                                              style="
                                                font-weight: 700;
                                                float: left;
                                                clear: both;
                                              "
                                              >Total Amount</span
                                            ><span
                                              style="
                                                font-weight: 700;
                                                float: right;
                                              "
                                              >৳ 1200.00</span
                                            >
                                          </div>
                                        </li>
                                        <li
                                          style="
                                            font-family: Inter;
                                            font-size: 12px;
                                            font-weight: 500;
                                            line-height: 12px;
                                            list-style-type: none;
                                            color: rgb(0, 0, 0);
                                            padding-bottom: 20px;
                                            border-bottom: 1px solid
                                              rgb(131, 131, 131);
                                            margin-bottom: 10px;
                                          "
                                        >
                                          <div>
                                            <span
                                              style="
                                                font-weight: 700;
                                                float: left;
                                                clear: both;
                                              "
                                              >Discount</span
                                            ><span
                                              style="
                                                font-weight: 700;
                                                float: right;
                                              "
                                              >৳ 0.00</span
                                            >
                                          </div>
                                        </li>
                                        <li
                                          style="
                                            font-family: Inter;
                                            font-size: 12px;
                                            font-weight: 500;
                                            line-height: 12px;
                                            list-style-type: none;
                                            color: rgb(0, 0, 0);
                                            padding-bottom: 20px;
                                            border-bottom: 1px solid
                                              rgb(131, 131, 131);
                                            margin-bottom: 10px;
                                          "
                                        >
                                          <div>
                                            <span
                                              style="
                                                font-weight: 700;
                                                float: left;
                                                clear: both;
                                              "
                                              >Vat</span
                                            ><span
                                              style="
                                                font-weight: 700;
                                                float: right;
                                              "
                                              >৳ 120</span
                                            >
                                          </div>
                                        </li>
                                        <li
                                          style="
                                            font-family: Inter;
                                            font-size: 12px;
                                            font-weight: 500;
                                            line-height: 12px;
                                            list-style-type: none;
                                            color: rgb(0, 0, 0);
                                            padding-bottom: 20px;
                                            border-bottom: 1px solid
                                              rgb(131, 131, 131);
                                            margin-bottom: 10px;
                                          "
                                        >
                                          <div>
                                            <span
                                              style="
                                                font-weight: 700;
                                                float: left;
                                                clear: both;
                                              "
                                              >Shipping</span
                                            ><span
                                              style="
                                                font-weight: 700;
                                                float: right;
                                              "
                                              >৳ 0.00</span
                                            >
                                          </div>
                                        </li>
                                        <li
                                          style="
                                            font-family: Inter;
                                            font-size: 12px;
                                            font-weight: 500;
                                            line-height: 12px;
                                            list-style-type: none;
                                            color: rgb(0, 0, 0);
                                            padding-bottom: 20px;
                                            border-bottom: 1px solid
                                              rgb(131, 131, 131);
                                            margin-bottom: 10px;
                                          "
                                        >
                                          <div>
                                            <span
                                              style="
                                                font-weight: 700;
                                                float: left;
                                                clear: both;
                                              "
                                              >Net Amount</span
                                            ><span
                                              style="
                                                font-weight: 700;
                                                float: right;
                                              "
                                              >৳ 1320.00</span
                                            >
                                          </div>
                                        </li>
                                        <li
                                          style="
                                            font-family: Inter;
                                            font-size: 12px;
                                            font-weight: 500;
                                            line-height: 12px;
                                            list-style-type: none;
                                            color: rgb(0, 0, 0);
                                            padding-bottom: 20px;
                                            border-bottom: 1px solid
                                              rgb(131, 131, 131);
                                            margin-bottom: 10px;
                                          "
                                        >
                                          <div>
                                            <span
                                              style="
                                                font-weight: 700;
                                                float: left;
                                                clear: both;
                                              "
                                              >Payment Amount</span
                                            ><span
                                              style="
                                                font-weight: 700;
                                                float: right;
                                              "
                                              >৳ 1320.00</span
                                            >
                                          </div>
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              v-if="false"
                              style="
                                margin-top: 5px;
                                width: 100%;
                                border-collapse: collapse;
                              "
                            >
                              <thead>
                                <tr>
                                  <th
                                    style="
                                      font-family: Inter;
                                      font-size: 12px;
                                      line-height: 15.73px;
                                      color: rgb(0, 0, 0);
                                      text-align: center;
                                      border: 1px solid rgb(0, 0, 0);
                                      padding: 7px 14px;
                                      background: rgb(236, 236, 236);
                                      font-weight: 600;
                                    "
                                  >
                                    Paid By
                                  </th>
                                  <th
                                    style="
                                      font-family: Inter;
                                      font-size: 12px;
                                      line-height: 15.73px;
                                      color: rgb(0, 0, 0);
                                      text-align: center;
                                      border: 1px solid rgb(0, 0, 0);
                                      padding: 7px 14px;
                                      background: rgb(236, 236, 236);
                                      font-weight: 600;
                                    "
                                  >
                                    Paid Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      font-family: Inter;
                                      font-size: 12px;
                                      line-height: 15.73px;
                                      color: rgb(0, 0, 0);
                                      text-align: center;
                                      border: 1px solid rgb(0, 0, 0);
                                      padding: 7px 14px;
                                      text-transform: capitalize;
                                      font-weight: 400;
                                    "
                                  >
                                    cash
                                  </td>
                                  <td
                                    style="
                                      font-family: Inter;
                                      font-size: 12px;
                                      line-height: 15.73px;
                                      color: rgb(0, 0, 0);
                                      text-align: center;
                                      border: 1px solid rgb(0, 0, 0);
                                      padding: 7px 14px;
                                      font-weight: 400;
                                    "
                                  >
                                    1320
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table style="display: flex">
                              <tfoot style="margin: auto">
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
                                  <div id="" class="text-xs leading-4">
                                    <!-- <ol
                                      style="
                                        list-style-type: decimal;
                                        padding-left: 20px;
                                      "
                                    >
                                      <li>
                                        <strong
                                          ><em
                                            ><u
                                              >Please check the product before
                                              going the authority beyond the
                                              concern</u
                                            ></em
                                          ></strong
                                        >
                                      </li>
                                      <li>
                                        <strong
                                          ><em
                                            ><u
                                              >Thank you for shopping wits SAC
                                              Lifestyle</u
                                            ></em
                                          ></strong
                                        >
                                      </li>
                                    </ol> -->
                                  </div>
                                </div>
                                <div
                                  class="no-print"
                                  style="
                                    text-align: center;
                                    margin: 15px 0px 20px;
                                  "
                                >
                                  <button
                                    class="hover:bg-gray-200"
                                    id="printBUtton"
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
                                    <!-- <img
                                        src="/_next/static/image/public/images/print-icon.6d893a5d0055d56426e671495f7b2059.png"
                                        alt="icon"
                                        style="margin-right: 8px; height: 17px"
                                      /> -->
                                    Print
                                  </button>
                                </div>
                                <!-- <div
                                  style="text-align: center; margin-top: 5px"
                                >
                                  <img
                                      src="https://pos-stage.s3.ap-southeast-1.amazonaws.com/invoices/hW5dQwSTk6fxMRAETYtu_3861_BN003861.png"
                                      alt="Barcode"
                                      style="
                                        display: inline-flex;
                                        align-items: center;
                                      "
                                    />
                                </div>
                                <div
                                  class="no-print"
                                  style="
                                    text-align: center;
                                    margin: 15px 0px 20px;
                                  "
                                >
                                  <button
                                    class="hover:bg-gray-200"
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
                                  >
                                    <img
                                        src="/_next/static/image/public/images/print-icon.6d893a5d0055d56426e671495f7b2059.png"
                                        alt="icon"
                                        style="margin-right: 8px; height: 17px"
                                      />
                                    Print
                                  </button>
                                </div>
                                <div
                                  style="text-align: center; margin-top: 5px"
                                >
                                  <div id="" class="text-xs leading-4">
                                    dokanepos.com
                                  </div>
                                </div> -->
                              </tfoot>
                            </table>
                          </div>
                        </section>
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
import { defineProps } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/20/solid";
defineProps({
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
  open: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["onClose"]);
const itemClass = `display: flex;justify-content: space-between; border-bottom: 1px dashed rgb(131, 131, 131); padding: 4px 0 4px 0`;
const onClose = () => {
  emit("onClose");
};
function printReceipt() {
  window.print();
}
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
