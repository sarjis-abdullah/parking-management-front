<template>
  <section class="grid md:grid-cols-3 gap-4">
    <section
      
      v-for="(item, index) in reports"
      :key="index"
    >
      <section class="shadow-md py-4 px-6 border rounded-md border-indigo-400">
        <article class="grid gap-4">
          <header>
            <h1 class="text-3xl text-indigo-600">
              <strong>{{ index }}</strong>
            </h1>
          </header>
          <p class="text-4xl text-indigo-800">{{ item }}</p>
        </article>
      </section>
    </section>
  </section>
  <Loading
    v-if="isLoading"
    parentClass="h-[50vh] flex  justify-center items-center"
  />
</template>

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
const getSlotReports = async () => {
  isLoading.value = true;
  try {
    const q = getQueryString(route.query);
    const res = await ReportService.getSlotReport(q);
    reports.value = res.data;
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

<style lang="scss" scoped></style>
