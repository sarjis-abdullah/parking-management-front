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
      <span class="text-gray-900">{{ singleData.vehicle_no }}</span>
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
      {{ singleData?.in_time ? formatDate(singleData?.in_time) : '--' }}
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
      {{ singleData?.out_time ? formatDate(singleData.out_time) : "--" }}
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
      {{ singleData?.payment?.method }}
    </td>
    <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
      <div>{{ singleData?.driver_name }}</div>
      <div>{{ singleData?.driver_mobile }}</div>
    </td>
    <td
      class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
    >
    <nuxt-link :to="`/parking-details/${singleData.barcode}`">View</nuxt-link>
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
import {computed} from 'vue'
import {
    EllipsisVerticalIcon
} from "@heroicons/vue/24/outline";
const {singleData} = defineProps({
  singleData: {
    type: Object,
    default: () => ({}),
  },
});
const selectedAction = ref('')
const actions = computed(()=> {
    return [
        {
            name: 'View details',
        },
        {
            name: 'Check-in details',
        },
        {
            name: 'Check-out details',
        },
        {
            name: 'Check-out',
        },
    ]
})
const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];
const router = useRouter()
const handleActionChange = () => {
 if (selectedAction.value == 'View details') {
    router.push('/parking-checkin/' + singleData.barcode)
 }
}
</script>

<style lang="scss" scoped></style>
