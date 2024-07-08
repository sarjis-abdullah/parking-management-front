<template>
  <tr>
    <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
      <div class="flex items-center">
        <!-- <div class="h-10 w-10 flex-shrink-0">
          <img
            class="h-10 w-10 rounded-full"
            src="https://cdn-staging.inaia.cloud/icons/gold-delivery.png"
            alt=""
          />
        </div> -->
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
          <span>{{"In"}}:   </span>
          <span>{{ singleData?.in_time ? formatDate(singleData?.in_time) : "--" }}</span>
        </div>
        <div v-if="singleData?.out_time" class="flex justify gap-2">
          <span>Out: </span>
          <span>{{ singleData?.out_time ? formatDate(singleData?.out_time) : "--" }}</span>
        </div>
        <div v-if="singleData?.out_time" class="flex justify gap-2">
          <span>Duration: </span>
          <span>{{ durationInHours }}</span>
        </div>
      </div>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
      <div
        class="flex items-center justify-start gap-2"
        v-if="singleData?.payment?.id"
      >
        <div
          class="p-2 rounded-md text-white"
          :class="
            singleData?.payment?.method == 'due'
              ? 'bg-orange-400'
              : 'bg-green-400'
          "
        >
          {{ singleData?.payment?.method }}
        </div>
        <div>
          <!-- <div class="flex justify-between gap-2">
            <span>Method:</span>
            <span class="font-bold text-right">{{
              singleData?.payment?.method
            }}</span>
          </div> -->
          <div class="flex justify-between gap-2">
            <span>Paid:</span>
            <span class="font-bold text-right"
              >{{ singleData?.payment?.paid_amount }}৳</span
            >
          </div>
          <div class="flex justify-between gap-2">
            <span>Payable:</span>
            <span class="font-bold text-right"
              >{{ singleData?.payment?.payable_amount }}৳</span
            >
          </div>
        </div>
      </div>
      <div class="flex items-center justify-start gap-2" v-else>--</div>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
      <div>{{ singleData.vehicle?.driver_name }}</div>
      <div>{{ singleData.vehicle?.driver_mobile }}</div>
    </td>
    <td
      class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
    >
      <div class="flex flex-col">
        <nuxt-link :to="`/parking-checkin/${singleData.barcode}`"
          >Checkin view</nuxt-link
        >
        <nuxt-link :to="`/parking-checkout/${singleData.barcode}`"
          >Checkout</nuxt-link
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
  const out_time = moment(singleData.out_time)
  const in_time = moment(singleData.in_time)
  const differenceInMillis = out_time.diff(in_time);

  // Create a duration object
  const duration = moment.duration(differenceInMillis);

  // Extract total time in minutes
  const inMin = Math.ceil(duration.asMinutes())
  const inHours = Math.ceil(duration.asHours())
  const inDays = Math.ceil(duration.asDays())
  if (inMin < 60) {
    return inMin + " s"
  }else if (inHours < 24) {
    return inHours + ' h'
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
</script>

<style lang="scss" scoped></style>
