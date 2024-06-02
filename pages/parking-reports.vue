<template>
  <section>
    <section class="grid grid-cols-3 gap-2">
      <div class="grid gap-2">
        <label class="text-gray-500">Start date</label>
        <input
          :class="inputClass"
          v-model="startDate"
          type="date"
          placeholder="e.g. 20/01/2024"
        />
      </div>
      <div class="grid gap-2">
        <label class="text-gray-500">End date</label>
        <input
          :class="inputClass"
          v-model="endDate"
          type="date"
          placeholder="e.g. 20/12/2024"
        />
      </div>
      <div class="grid gap-2">
        <label class="text-gray-500"
          >Vehicle Number<span class="text-red-500">*</span></label
        >
        <input
          :class="inputClass"
          v-model="vehicleNumber"
          type="text"
          @input="debouncedSearch"
          @change="checkSelection"
          placeholder="e.g. Ka-12345"
          list="cityname"
        />
        <!-- <input type="text" name="city" list="cityname" /> -->
        <datalist id="cityname">
          <option
            v-for="item in vehicleList"
            :key="item.id"
            :value="item.number"
          ></option>
        </datalist>
      </div>
    </section>
    <section class="text-center mt-4">
      <button
        :disabled="isLoading"
        @click="getReports"
        class="bg-indigo-600 text-white px-2 py-1 rounded-md"
      >
        Filter
      </button>
    </section>
    <h2 style="text-align: center; margin-top: 20px; padding: 1rem">
      Date-wise vehicle entry reports
    </h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px">
      <thead>
        <tr>
          <th
            style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              background-color: #f2f2f2;
            "
          >
            Date
          </th>
          <!-- <th
            style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              background-color: #f2f2f2;
            "
          >
            Transaction Count
          </th>
          <th
            style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              background-color: #f2f2f2;
            "
          >
            Total Payable
          </th>
          <th
            style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              background-color: #f2f2f2;
            "
          >
            Total Paid
          </th> -->
          <th
            style="
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
              background-color: #f2f2f2;
            "
          >
            Vehicle entries count
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Dummy Data for reports -->
        <tr v-for="(item, index) in reports" :key="index">
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            {{ item.entry_date }}
          </td>

          <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
            {{ item.vehicle_entries }}
          </td>
        </tr>
        <tr v-if="reports.length == 0">
          <td
            colspan="5"
            style="border: 1px solid #ddd; padding: 8px; text-align: center"
          >
            No data available
          </td>
        </tr>
      </tbody>
    </table>
  </section>
  <Loading v-if="isLoading" />
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import moment from "moment";
import { ReportService } from "@/services/ReportService";
import { formatDate } from "@/utils/index";
import { VehicleService } from "~/services/VehicleService";
import { useDebounce } from "~/hooks/useDebounce";
import Loading from "@/components/common/Loading.vue";

definePageMeta({
  layout: "auth-layout",
});
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";

const route = useRoute();
const router = useRouter();
const startDate = ref("");
const endDate = ref("");
const reports = ref([]);
const isLoading = ref(false);

function getQueryString(query) {
  const params = new URLSearchParams(query);
  return `?${params.toString()}`;
}

const vehicleNumber = ref("");
const vehicleList = ref([]);

const search = async () => {
  let query = "";
  if (vehicleNumber.value) {
    query += `?query=${vehicleNumber.value}`;
    const newQuery = {
      ...route.query,
    };
  }
  const result = await VehicleService.getAll(query);
  if (result?.data?.length) {
    vehicleList.value = result.data;
  }
};
const vehicleId = ref(null);
const checkSelection = () => {
  const data = vehicleList.value.find(
    (item) => item.number == state.vehicleNumber
  );
  if (data) {
    vehicleId = data.id;
  }
};
const debouncedSearch = useDebounce(search, 500);
const serverErros = ref({});
const getReports = () => {
  isLoading.value = true;
  setTimeout(async () => {
    try {
      const q = getQueryString(route.query);
      const res = await ReportService.getVehicle(q);
      reports.value = res.data;
    } catch (error) {
      serverErros.value = error.errors;
    } finally {
      isLoading.value = false;
    }
  }, 500);
};

watch(
  route,
  (o, n) => {
    if (route.query) {
      const newQuery = {
        ...route.query,
      };
      console.log(route.query);
      if (route.query.start_date) {
        newQuery.start_date = route.query.start_date;
      }
      if (route.query.end_date) {
        newQuery.end_date = route.query.end_date;
      }
      if (route.query.vehicle_id) {
        newQuery.vehicle_id = route.query.vehicle_id;
      }

      router.push({ query: newQuery });
    }
  },
  { deep: false, immediate: true }
);

watch(
  [startDate, endDate],
  ([newStartDate, newEndDate], [oldStartDate, oldEndDate]) => {
    const newQuery = { ...route.query };

    if (newStartDate !== oldStartDate) {
      if (newStartDate) {
        newQuery.start_date = newStartDate;
      } else {
        delete newQuery.start_date;
      }
    }

    if (newEndDate !== oldEndDate) {
      if (newEndDate) {
        newQuery.end_date = newEndDate;
      } else {
        delete newQuery.end_date;
      }
    }

    router.push({ query: newQuery });
  },
  { deep: true, immediate: false }
);
// watch(
//   vehicleId,
//   (o, n) => {
//     if (o != n) {
//       const newQuery = {
//         ...route.query,
//       };

//       if (vehicleId.value) {
//         newQuery.vehicle_id = vehicleId.value;
//       }

//       router.push({ query: newQuery });
//     }
//   },
//   { deep: true, immediate: true }
// );

onMounted(() => {
  startDate.value = formatDate(moment().subtract(1, "month"), "YYYY-MM-DD");
  endDate.value = formatDate(moment(), "YYYY-MM-DD");
  const newQuery = {
    ...route.query,
  };

  newQuery.start_date = startDate.value;
  newQuery.end_date = endDate.value;
  router.push({ query: newQuery });

  getReports();
});
</script>

<style lang="scss" scoped></style>
