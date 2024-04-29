<template>
  <AuthLayout>
    <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
          >
            <!-- <OrderFilters
            v-if="showFilterButton"
            :title="title"
            :showFilterButton="showFilterButton"
            :pdfLoading="pdfLoading"
            @filterOrderBy="filterOrderBy"
            @downloadOrderStatement="downloadOrderStatement"
          /> -->
            <header class="flex justify-between text-gray-900 mb-3 text-xl">
              <h6>{{ "User List" }}</h6>
              <Link to="/add/user"> Add User </Link>
            </header>
            <!-- <pre>
            {{ users }}
          </pre> -->
            <div v-if="!loadingError && !isLoading">
              <table
                class="min-w-full divide-y divide-gray-300"
                v-if="users && users?.length > 0"
              >
                <thead>
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pl-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Name
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
                      status
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="user in users" :key="user.id">
                    <td
                      class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0"
                    >
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                          <img
                            class="h-10 w-10 rounded-full"
                            src="https://cdn-staging.inaia.cloud/icons/gold-delivery.png"
                            alt=""
                          />
                        </div>
                        <div class="ml-4">
                          <div class="font-medium text-gray-900">
                            {{ user.name }}
                          </div>
                          <div class="mt-1 text-gray-500">
                            <!-- {{ $d(getExecutionDate(order)) }} -->
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-3 py-5 text-sm">
                      <span class="text-gray-900">{{ user.email }}</span>
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-5 text-sm text-gray-500"
                    >
                      {{ user.status }}
                    </td>
                    <td
                      class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                    >
                      ...
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="text-center py-10">
                <p class="text-xl text-gray-400">
                  <!-- {{ $t("you_have_no_transactions") }} -->
                </p>
              </div>
            </div>
            <div v-if="!loadingError && isLoading">
              Loading
              <!-- <ListLoader /> -->
            </div>
            <div v-if="loadingError && !isLoading">
              Loading error
              <!-- <ListLoadingError :message="'cant_load_orders_list'" /> -->
            </div>
          </div>
        </div>
      </div>
      <Pagination
        class="mt-6"
        :perPage="perPage"
        :lastPage="lastPage"
        :total="total"
        :totalPerPage="totalPerPage"
        @onChange="onPageChanged"
      />
      <!-- <OrderDetails
      :showDetails="showDetails"
      :order="selectedOrder"
      @onClose="closeDetails"
    /> -->
    </div>
  </AuthLayout>
</template>
<script setup>
import { onMounted } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Link from "@/components/common/Link.vue";
import Pagination from "@/components/common/Pagination.vue";

const users = ref([]);
const loadingError = ref(null);
const isLoading = ref(false);
const serverErrors = ref(null);

//pagination
const page = ref(1);
const perPage = ref(10);
const lastPage = ref(null);
const total = ref(null);
const totalPerPage = ref(null);

const searchQuery = computed(()=> {
  return `?page=${page.value}&per_page=${perPage.value}`
})

const config = useRuntimeConfig();
const BASE_URL = config.public.BASE_URL;
const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNTg0NzhkMGRlOTBlMGJmYTBlNDM2MzYxYzc4YzNjNDRkNzdmZWFjOGY2MTg0OGI4NmFlZjI5M2U4NjBjMjU2MWM3NDA2ODVkM2JhYzRmMWYiLCJpYXQiOjE3MTQyMjI5NzYuNDMyNDc5LCJuYmYiOjE3MTQyMjI5NzYuNDMyNDgzLCJleHAiOjE3NDU3NTg5NzYuNDE1MDA4LCJzdWIiOiI0Iiwic2NvcGVzIjpbXX0.A-YTSXfW8-0Ulu6fkQKerul9Wrcp3RBTD1huHt2rIJoRqOnUPfeAEG_VmgeqbEpM2v38DdI7oscx3CuFYiteejTT8SQUuWhWjGZC6S83phKYYcL0grQRylJ4jQ0oS-umxSo-yDN91uHulc683eOjzCuGRcZIWLP_k2BGuJMZnbklAxFfLxSfM2-v_uvVO9e-7U8H7QrmjMZAcgGnIlDkP8kKCTDg4VL3w_4Dh7krXZd-PiVd8aOE9hVudyOLDQAKcjhzJp-8ZIu7ey1gfleZkhUwfSBHypIPNE0KgV4YyxBEa7IT7lOcdtTgvdWiCkrw57AAnPIcf8OexMgf6KK-5F4LjTxV4ywq6J6YIcRkRcSOsqxUbZauQHMohuDdfSgpN-AIHoeBWwCT2qlXYD0qqjCwykRayD2NOMsmoAAALeTbw-rP0zq1Fxo9285U687T3Ma22dGVj5HZ_UyAP--9MGakLVxdGzHaSvz53fNUOLe6vL-xAsyVDUJJcd0ACTNePDELo75k51AvpZXzIQtKp-t9ijSb8tXd4EvcCNwMDa8KFdQwv2xxOdGUBHfUASzeJM5_FR7xPjfDNgMA3Z38DI_5GVrKziaRBHqDnwlwqPHQOdPOkB1Hfq0gL3hpK7CYxiViqdS5MkSB8ZmeMwbffiZcJq4ChpN6SnHe7bQfOhE";
const loadData = async () => {
  // const { data } = await useFetch(BASE_URL + 'user')
  try {
    isLoading.value = true;
    const {meta, data} = await $fetch(BASE_URL + "user" + searchQuery.value, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-Type": "application/json", // Adjust content type as needed
      },
    });
    users.value = data;
    console.log(meta, meta.current_page);

    page.value = meta.current_page;
    lastPage.value = meta.last_page;
    total.value = meta.total;
    totalPerPage.value = data.length;

    serverErrors.value = {};
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

const onPageChanged = (p) => {
  page.value = p;
  loadData();
};
onMounted(() => {
  loadData();
});
</script>
