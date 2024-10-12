<template>
  <div
    class="flex flex-col justify-center items-center md:w-[80%] h-screen text-green-500 text-3xl"
  >
    Congratulations!
    <div class="text-center">
      <strong class="ml-2"> Transaction successful.</strong>
    </div>
  </div>
  <CheckoutForm :show="showInvoice" @onClose="showInvoice = false" />
</template>

<script setup>
import { PaymentService } from "~/services/PaymentService";
import CheckoutForm from "~/components/common/CheckoutPrintForm.vue";
import { onMounted, nextTick, computed, ref } from "vue";

definePageMeta({
  layout: "auth-layout",
});

const route = useRoute();
const router = useRouter();
const showInvoice = ref(false)

watch(
  route,
  (o, n) => {
    if (route.query) {
      const newQuery = {
        ...route.query,
      };
      if (route.query.transaction_id) {
        const query = `?transaction_id=${route.query.transaction_id}`;
        PaymentService.findBy(query).then((result) => {
          showInvoice.value = true
        }).catch((err) => {
          
        });;
        // newQuery.transaction_id = route.query.start_date;
      }

      // router.push({ query: newQuery });
    }
  },
  { deep: false, immediate: true }
);
</script>

<style lang="scss" scoped></style>
