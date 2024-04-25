<template>
  <Default>
    <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto shadow-2xl">
      <section class="grid grid-cols-3">
              <div class="grid gap-2">
                <!-- <label for="search" class="block font-bold">Password</label> -->
                <input
                  type="text"
                  id="search"
                  v-model="searchQuery"
                  @input="debouncedSearch"
                  placeholder="Search by phone number"
                  class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500"
                />
              </div>
            </section>
      <div class="mt-8 flow-root" v-if="!loading && userList?.length">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
          >
            
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    SL No.
                  </th>
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Address
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Dob
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Occupation
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Family Members
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Gender
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Complimentary Card
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="(person, index) in userList" :key="person.id">
                  <td
                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                  >
                    {{ index + 1 }}
                  </td>
                  <td
                    class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                  >
                    {{ person.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ person.phone }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ person.address }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ person.birthDate }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ person.email }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ person.occupation }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ person.familyMembers }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ person.gender }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {{ person.hasComplimentaryCard ? "Yes" : "No" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        class="text-center h-screen flex items-center justify-center"
        v-else-if="loading"
      >
        Loading
      </div>
      <div
        class="text-center h-screen flex items-center justify-center"
        v-else-if="!loading && userList.length == 0"
      >
        No data
      </div>
    </div>
  </Default>
</template>

<script setup>
import { ref } from "vue";
import Default from "../layouts/Default.vue";
import debounce from "lodash.debounce";

definePageMeta({
  layout: "Default",
});
const route = useRoute();
const config = useRuntimeConfig();
const url = config.public.BASE_URL + "user";
const style = "";
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
const defaultData = {
  name: "",
  address: "",
  phone: "",
  birthDate: "",
  email: "",
  occupation: "",
  familyMembers: "",
  gender: "",
  anniversary: "",
  hasComplimentaryCard: false,
};
const formData = ref({ ...defaultData });

const searchQuery = ref("");
const errors = ref({});
const loading = ref(false);
const userList = ref([]);
const success = ref(false);
const userId = ref(null);
const otp = ref("");

const formattedData = computed(() => {
  return {
    ...formData.value,
    hasComplimentaryCard: !!formData.value.hasComplimentaryCard == "Yes",
  };
});

const loadData = (query='') => {
  loading.value = true;
  errors.otpError = "";
  const token =
    window != null && window != undefined
      ? window.localStorage.getItem("ACCESS_TOKEN")
      : null;
  let finalUrl = url
  if (query != '') {
    finalUrl+= `?phone=${query}`
  }
  fetch(finalUrl, {
    headers: { Authorization: "Bearer " + token },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Process the retrieved data
      userList.value = data.data;
      loading.value = false;
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      loading.value = false;
      console.error("There was a problem with the fetch operation:", error);
    });
};
const search = async () => {
  loadData(searchQuery.value)
};
const debouncedSearch = debounce(search, 500);
onMounted(() => {
  loadData();
});
</script>
