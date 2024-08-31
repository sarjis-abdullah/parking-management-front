<template>
  <tr>
    <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
      <div class="flex items-center">
        <div class="">
          <div class="font-medium text-gray-900">
            {{ singleData.barcode }}
          </div>
          <div class="mt-1 text-gray-500">
            <!-- {{ $d(getExecutionDate(order)) }} -->
          </div>
        </div>
      </div>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm">
      <span class="text-gray-900">{{ singleData.vehicle?.number }}</span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
      <div>
        <div class="flex justify gap-2">
          <span>{{ "In" }}: </span>
          <span>{{
            singleData?.in_time ? formatDate(singleData?.in_time) : "--"
          }}</span>
        </div>
        <div v-if="singleData?.out_time" class="flex justify gap-2">
          <span>Out: </span>
          <span>{{
            singleData?.out_time ? formatDate(singleData?.out_time) : "--"
          }}</span>
        </div>
        <div v-if="singleData?.out_time" class="flex justify gap-2">
          <span>Duration: </span>
          <span>{{ durationInHours }}</span>
        </div>
      </div>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
      <div
        class="flex items-center justify-between gap-6"
        v-if="singleData?.payment?.id"
      >
        <div class="flex gap-2 flex-col">
          <div class="grid gap-2 items-center" style="grid-template-columns: max-content auto">
            <span>Method: </span>
            <span
            class="text-white p-2 rounded-md text-center"
              :class="
                singleData?.payment?.method == 'due'
                  ? 'bg-orange-400'
                  : 'bg-blue-400'
              "
              >{{ singleData?.payment?.method }}</span
            >
          </div>
          <div class="grid gap-2 items-center" style="grid-template-columns: max-content auto">
            <span>Status: </span>
            <span class="p-2 rounded-md text-center"
            :class="getStatusWiseColor(singleData.payment.status)"> {{ singleData?.payment?.status }}</span>
          </div>
        </div>
        <div>
          <div class="flex justify-between gap-2">
            <span>Payable:</span>
            <span class="font-bold text-right"
              >{{ singleData?.payment?.payable_amount }}৳</span
            >
          </div>
          <div class="flex justify-between gap-2">
            <span>Paid:</span>
            <span class="font-bold text-right">
              {{
                Number(parseFloat(singleData?.payment?.paid_amount)).toFixed(2)
              }}৳</span
            >
          </div>
          <div class="flex justify-between gap-2">
            <span>Discount:</span>
            <span class="font-bold text-right">
              {{
                Number(
                  parseFloat(singleData?.payment?.discount_amount ?? 0)
                ).toFixed(2)
              }}৳</span
            >
          </div>
          <!-- <div class="flex justify-between gap-2">
            <span>Total:</span>
            <span class="font-bold text-right">
              {{
                Number(
                  parseFloat(singleData?.payment?.paid_amount) +
                    parseFloat(singleData?.payment?.discount_amount ?? 0)
                ).toFixed(2)
              }}৳</span
            >
          </div> -->
          
        </div>
      </div>
      <div
        class="flex items-center justify-center gap-2 bg-indigo-500 text-white text-center rounded-full py-2"
        v-else
      >
        Still in parking
      </div>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
      <div>{{ singleData.vehicle?.driver_name }}</div>
      <div>{{ singleData.vehicle?.driver_mobile }}</div>
    </td>
    <td
      class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
    >
      <div class="flex flex-col gap-2">
        <button
          :disabled="repayLoading"
          v-if="singleData?.payment?.status !== 'success'"
          @click="repay"
          class="bg-green-500 text-white rounded-md text-center py-1"
        >
          Repay
        </button>
        <nuxt-link
          class="bg-orange-300 text-white rounded-md text-center py-1"
          :to="`/parking-checkin/${singleData.barcode}?view=1`"
          >Checkin view</nuxt-link
        >
        <nuxt-link
          class="bg-orange-400 text-white rounded-md text-center py-1"
          :to="`/parking-checkout/${singleData.barcode}${
            singleData?.out_time ? '?view=1' : ''
          }`"
          >Checkout {{ singleData?.out_time ? "view" : "" }}</nuxt-link
        >
      </div>
      <!-- <select @change="handleActionChange" v-model="selectedAction" class="bg-white relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500">
        <option :value="''" disabled>Select action</option>
        <option v-for="item in actions" :value="item.name" :key="item.name">
            {{ item.name }}
        </option>
    </select> -->
    </td>
  </tr>
</template>

<script setup>
import { formatDate } from "@/utils/index.js";
import { computed } from "vue";
import { EllipsisVerticalIcon } from "@heroicons/vue/24/outline";
import moment from "moment";
import { PaymentService } from "~/services/PaymentService";
const { singleData } = defineProps({
  singleData: {
    type: Object,
    default: () => ({}),
  },
});
const selectedAction = ref("");
const actions = computed(() => {
  return [
    {
      name: "View details",
    },
    {
      name: "Check-in details",
    },
    {
      name: "Check-out details",
    },
    {
      name: "Check-out",
    },
  ];
});
const durationInHours = computed(() => {
  const result = singleData.id;
  if (!result) {
    return 0;
  }
  const out_time = moment(singleData.out_time);
  const in_time = moment(singleData.in_time);
  const differenceInMillis = out_time.diff(in_time);

  // Create a duration object
  const duration = moment.duration(differenceInMillis);

  // Extract total time in minutes
  const inMin = Math.ceil(duration.asMinutes());
  const inHours = Math.ceil(duration.asHours());
  const inDays = Math.ceil(duration.asDays());
  if (inMin < 60) {
    return inMin + " s";
  } else if (inHours < 24) {
    return inHours + " h";
  }

  return inDays + " d";
});
const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];
const router = useRouter();
const handleActionChange = () => {
  if (selectedAction.value == "View details") {
    router.push("/parking-checkin/" + singleData.barcode);
  }
};
const getStatusWiseColor = (status) => {
  if (status == "success") {
    return "text-white bg-green-600 p-1";
  } else if (status == "pending") {
    return "text-white bg-yellow-600 p-1";
  }
  return "text-white bg-red-600 p-1";
};
const repayLoading = ref(false);
const repay = async () => {
  repayLoading.value = true;
  try {
    const result = await PaymentService.repay(singleData.id);

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
</script>

<style lang="scss" scoped></style>
