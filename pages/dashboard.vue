<script setup>
import { ref, onMounted } from "vue";
import { ReportService } from "@/services/ReportService";
import Loading from "@/components/common/Loading.vue";

definePageMeta({
  layout: "auth-layout",
});
const route = useRoute();
const isLoading = ref(false);

function getQueryString(query) {
  const filteredQuery = {};

  // Filter out null and undefined values
  for (const key in query) {
    if (query[key] !== null && query[key] !== undefined) {
      filteredQuery[key] = query[key];
    }
  }

  const params = new URLSearchParams(filteredQuery);
  return `?${params.toString()}`;
}

const serverErros = ref({});
const reports = ref([]);
const slots = ref([]);
const availableSlotsByCategory = ref([]);
const getSlotReports = async () => {
  isLoading.value = true;
  try {
    const q = getQueryString(route.query);
    const res = await ReportService.getSlotReport(q);
    reports.value = res.data;
    slots.value = res.slots;
    availableSlotsByCategory.value = res.availableSlotsByCategory;
  } catch (error) {
    serverErros.value = error.errors;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getSlotReports();
});
</script>
<template>
  <section class="grid gap-4">
    <section class="shadow-md p-6 border rounded-md border-indigo-400">
      <!-- <section class="flex gap-4">
        <section v-for="(item, index) in slots" :key="index">
          <section
            class="shadow-md py-4 px-6 "
          >
            <article class="grid gap-4">
              <header>
                <h1 class="text-3xl tex-600">
                  <strong>{{ index }}</strong>
                </h1>
              </header>
              <p class="text-4xl tex-800">{{ item }}</p>
            </article>
          </section>
        </section>
      </section> -->
      <section class="grid md:grid-cols-3 gap-4">
        <section v-for="(item, index) in slots" :key="index">
          <section
            class="shadow-md py-4 px-6 "
          >
            <article class="grid gap-4">
              <header>
                <h1 class="text-3xl tex-600 flex justify-between">
                  <strong>{{ index }} </strong>
                  <strong class="bg-indigo-600 px-2 text-white rounded-lg">{{ item }}</strong>
                </h1>
              </header>
            </article>
          </section>
        </section>
        <section v-for="(item, index) in availableSlotsByCategory" :key="index">
          <section
            class="shadow-md py-4 px-6 "
          >
            <article class="grid gap-4">
              <header>
                <h1 class="text-3xl">
                  <strong class="flex justify-between">
                    <span>{{ item.category.name }} </span>
                    <span class="bg-indigo-600 px-2 text-white rounded-lg ml-2">
                      {{ item.available_count }}
                    </span>
                    <!-- <span>slots</span>  -->
                    <!-- <span class="bg-indigo-600 p-1 text-white rounded-lg ml-2"
                      >Available</span
                    > -->
                  </strong>
                </h1>
              </header>
              <!-- <p class="text-4xl text-indigo-800">{{ item.available_count }}</p> -->
            </article>
          </section>
        </section>
      </section>
    </section>
    <section class="grid md:grid-cols-3 gap-4">
      <section v-for="(item, index) in reports" :key="index">
        <section
          class="shadow-md py-4 px-6 border rounded-md border-indigo-400"
        >
          <article class="grid gap-4">
            <header>
              <h1 class="text-3xl te-600">
                <strong>{{ index }}</strong>
              </h1>
            </header>
            <p class="text-4xl te-800">{{ item }}</p>
          </article>
        </section>
      </section>
    </section>
  </section>
  <Loading
    v-if="isLoading"
    parentClass="h-[50vh] flex  justify-center items-center"
  />
</template>

<style lang="scss" scoped></style>
