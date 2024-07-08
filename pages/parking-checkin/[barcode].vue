<template>
  <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <div class="md:mt-8 flow-root">
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
                          {{ key == "In-Time" ? formatDate(value) : value }}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <button
                  data-v-61884e8b=""
                  @click="print"
                  type="submit"
                  class="mt-6 w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Print
                </button>
              </div>
            </div>

            <div v-else class="text-center py-10">
              <p class="text-xl text-gray-400">
                {{ serverErrors }}
              </p>
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
    </div>
  </div>
</template>
<script setup>
import { onMounted, nextTick } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Link from "@/components/common/Link.vue";
import Pagination from "@/components/common/Pagination.vue";
import Loading from "@/components/common/Loading.vue";
import { ParkingService } from "~/services/ParkingService";
import { formatDate } from "@/utils/index";

definePageMeta({
  layout: "auth-layout",
});
const list = ref([]);
const loadingError = ref(null);
const isLoading = ref(true);
const serverErrors = ref(null);

//pagination
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);

const route = useRoute();
const routeQuery = computed(() => {
  return route.query;
});
const barcode = route.params.barcode;

const searchQuery = computed(() => {
  return `?barcode=${barcode}&include=p.slot,p.category,p.place,p.floor,p.vehicle`;
});

const barcodeImage = ref("");
const loadData = async () => {
  try {
    isLoading.value = true;
    const { data } = await ParkingService.getAll(searchQuery.value);
    if (data?.length) {
      list.value = data.map((item) => {
        return {
          "Vehicle Number": item.vehicle?.number,
          Place: item.place?.name,
          Category: item.category?.name,
          Floor: item.floor?.name,
          Slot: item.slot?.name,
          "Driver Name": item.vehicle?.driver_name,
          "driver Mobile": item.vehicle?.driver_mobile,
          "In-Time": item.in_time,
          Status: item.vehicle?.status,
        };
      });
      barcodeImage.value = data[0].barcode_image;
      serverErrors.value = {};

      if (!routeQuery.value.view) {
        setTimeout(() => {
          print()
        }, 1);
      }
    } else {
      serverErrors.value = "No data available for this barcode";
    }

    // page.value = meta.current_page;
    // lastPage.value = meta.last_page;
    // total.value = meta.total;
    // totalPerPage.value = data.length;

    // handleReset();
  } catch (error) {
    console.log(error);
    if (error.response?._data?.errors) {
      serverErrors.value = error.response._data.errors;
    } else if (error.response?.data?.errors) {
      serverErrors.value = error.response?.data.errors;
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
  //   printWindow.close();
};
// const emailTemplate = ref(null);
// const print = () => {
//     nextTick(()=> {
//         console.log(emailTemplate.value);
//     })

//   return;
//   const emailTemplate = emailTemplate.value.innerHTML;
//   const printWindow = window.open("", "_blank");
//   printWindow.document.open();
//   printWindow.document.write(`
//         <html>
//           <head>
//             <title>Email Template</title>
//             <style>
//               /* Add CSS styles for printing */
//               body {
//                 font-family: Arial, sans-serif;
//                 font-size: 14px;
//               }
//               h1 {
//                 color: #333;
//               }
//               p {
//                 margin-bottom: 10px;
//               }
//             </style>
//           </head>
//           <body>
//             ${emailTemplate.value}
//           </body>
//         </html>
//       `);
//   printWindow.document.close();
//   printWindow.print();
// };
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
