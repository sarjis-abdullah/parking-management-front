<script setup>
import { onMounted } from "vue";
import Link from "@/components/common/Link.vue";
import Titlebar from "@/components/common/Titlebar.vue";
import Pagination from "@/components/common/Pagination.vue";
import { MembershipTypeService } from "~/services/MembershipTypeService.js";
import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/vue/20/solid";
import Loading from "@/components/common/Loading.vue";
import ServerError from "@/components/common/Error.vue";

definePageMeta({
  layout: "auth-layout",
});
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
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

const searchQuery = computed(() => {
  return `?page=${page.value}&per_page=${perPage.value}`;
});

const loadData = async () => {
  try {
    isLoading.value = true;
    const { meta, data } = await MembershipTypeService.getAll(
      searchQuery.value
    );
    list.value = data;

    page.value = meta.current_page;
    lastPage.value = meta.last_page;
    total.value = meta.total;
    totalPerPage.value = data.length;

    serverErrors.value = {};
    // handleReset();
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    isLoading.value = false;
  }
};
const isDeleting = ref(false);
const deleteRecord = async (id) => {
  if (confirm("Are you sure to delete this record?")) {
    try {
      isDeleting.value = true;
      const res = await MembershipTypeService.delete(id);
      list.value = list.value.filter((item) => item.id != id);

      serverErrors.value = {};
      // handleReset();
    } catch (error) {
      console.log(error, 1111);
      serverErrors.value = error.errors;
    } finally {
      isDeleting.value = false;
    }
  }
};
const record = reactive({
  id: "",
  name: "",
  discount_amount: "",
  discount_type: "",
  allow_separate_discount: false,
  default: false,
});
const editRecord = (props) => {
  record.id = props.id;
  record.name = props.name;
  record.discount_amount = props.discount_amount;
  record.discount_type = props.discount_type;
  record.allow_separate_discount = props.allow_separate_discount;
  record.default = props.default;
  list.value = list.value.map((item) => {
    if (item.id == props.id) {
      return {
        ...item,
        editMode: true,
      };
    }
    return {
      ...item,
      editMode: false,
    };
  });
};
const isUpdating = ref(false);
const updateableRecord = computed(() => {
  return {
    name: record.name,
    discount_amount: record.discount_amount,
    discount_type: record.discount_type,
    allow_separate_discount: record.allow_separate_discount,
    default: record.default,
  };
});
const cancelUpdatingRecord = async (id) => {
  list.value = list.value.map((item) => {
    return {
      ...item,
      editMode: false,
    };
  });
};
const updateRecord = async (id) => {
  try {
    isUpdating.value = true;
    const res = await MembershipTypeService.put(id, updateableRecord.value);
    if (res?.data) {
      list.value = list.value.map((item) => {
        if (item.id == id) {
          item.name = record.name;
          item.discount_amount = res.data.discount_amount;
          item.discount_type = record.discount_type;
          item.default = record.default;
          item.allow_separate_discount = record.allow_separate_discount;
          item.editMode = false;
          return item;
        }
        if (record.default) {
          item.default = false
        }
        return item;
      });
    }

    serverErrors.value = {};
  } catch (error) {
    serverErrors.value = error.errors;
  } finally {
    isUpdating.value = false;
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
<template>
  <div class="rounded-lg bg-slate-[#A8A8A8] shadow-lg p-6">
    <div class="md:mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <!-- <OrderFilters
          v-if="showFilterButton"
          :title="title"
          :showFilterButton="showFilterButton"
          :pdfLoading="pdfLoading"
          @filterOrderBy="filterOrderBy"
          @downloadOrderStatement="downloadOrderStatement"
        /> -->
        <Titlebar title="membership-type"></Titlebar>

          <div v-if="!loadingError && !isLoading">
            <table
              class="min-w-full divide-y divide-gray-300"
              v-if="list && list?.length > 0"
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
                    Discount type
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Discount amount
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Default Status
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Allow separate discount
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="singleData in list" :key="singleData.id">
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center">
                      <div class="">
                        <div
                          v-if="singleData.editMode"
                          class="mt-1 text-gray-500"
                        >
                          <input
                            :class="inputClass"
                            v-model="record.name"
                            type="text"
                            placeholder="e.g. Membership type name"
                          />
                        </div>
                        <div v-else class="font-medium text-gray-900">
                          {{ singleData.name }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <div v-if="singleData.editMode" class="mt-1 text-gray-500">
                      <select
                        class="focus:outline-none bg-none"
                        :class="inputClass"
                        style="background: none"
                        name="place"
                        v-model="record.discount_type"
                      >
                        <option value="flat">Flat</option>
                        <option value="percentage">Percentage</option>
                        <option value="free">Free</option>
                      </select>
                      <!-- <input
                        :class="inputClass"
                        v-model="record.discount_type"
                        type="text"
                        placeholder="e.g. Text about place"
                      /> -->
                    </div>
                    <span v-else class="text-gray-900">{{
                      singleData.discount_type
                    }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <div v-if="singleData.editMode" class="mt-1 text-gray-500">
                      <input
                        :class="inputClass"
                        v-model="record.discount_amount"
                        type="text"
                        placeholder="e.g. Text about place"
                      />
                    </div>
                    <span v-else class="text-gray-900">{{
                      singleData.discount_amount
                    }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <div
                      v-if="singleData.editMode"
                      class="flex items-center gap-1 mt-1 text-gray-500"
                    >
                      <input
                        v-model="record.default"
                        type="checkbox"
                        value=""
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label class="text-gray-500">Marked as default</label>
                    </div>
                    <span v-else class="text-gray-900">{{
                      singleData.default ? "Yes" : "No"
                    }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <div
                      v-if="singleData.editMode"
                      class="flex items-center gap-1 mt-1 text-gray-500"
                    >
                      <input
                        v-model="record.allow_separate_discount"
                        type="checkbox"
                        value=""
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label class="text-gray-500">Allow other discount with this</label>
                    </div>
                    <span v-else class="text-gray-900">{{
                      singleData.allow_separate_discount ? "Allowed" : "Not allowed"
                    }}</span>
                  </td>
                  <td
                    class="flex justify-center gap-1 relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                  >
                    <TrashIcon
                      @click="deleteRecord(singleData.id)"
                      class="h-5 w-5"
                      aria-hidden="true"
                    />
                    <PencilIcon
                      @click="editRecord(singleData)"
                      class="h-5 w-5"
                      aria-hidden="true"
                    />
                    <CheckIcon
                      v-if="singleData?.editMode"
                      @click="updateRecord(singleData.id)"
                      class="h-5 w-5 text-blue-500"
                      aria-hidden="true"
                    />
                    <XMarkIcon
                      v-if="singleData?.editMode"
                      @click="cancelUpdatingRecord(singleData.id)"
                      class="h-5 w-5 text-red-500"
                      aria-hidden="true"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="text-center py-10">
              <p class="text-xl text-gray-400">
                No data available
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
    <ServerError :error="serverErrors" />
    <Loading v-if="isLoading || isDeleting || isUpdating" />
    <Pagination
      class="mt-6"
      :perPage="perPage"
      :lastPage="lastPage"
      :total="total"
      :totalPerPage="totalPerPage"
      @onChange="onPageChanged"
    />
  </div>
</template>

