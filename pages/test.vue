<script setup>
import { PaymentService } from "~/services/PaymentService";
import CheckoutForm from "~/components/common/CheckoutPrintFormTest.vue";
import { onMounted, nextTick, computed, ref } from "vue";

definePageMeta({
  layout: "auth-layout",
});

const route = useRoute();
const router = useRouter();
const showInvoice = ref(false);
const responses = ref(null);
const includeQuery = computed(
  () => `?include=p.parking,p.place,p.category,p.slot,p.floor,p.vehicle`
);

watch(
  route,
  (o, n) => {
    if (route.query) {
      const newQuery = {
        ...route.query,
      };
      showInvoice.value = true;
      responses.value = [
        {
          id: 4,
          method: "cash",
          paid_now: "0.00",
          payable_amount: "50.00",
          discount_amount: "0.00",
          membership_discount: "20.00",
          paid_amount: "30.00",
          due_amount: "0.00",
          status: "success",
          parking: {
            id: 5,
            barcode_image:
              "iVBORw0KGgoAAAANSUhEUgAAAPAAAAAyAQMAAABYu8RuAAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADRJREFUOI1j6N6149Widy9evXj1TuvFrkXv3mnt2AXC6/R2rOvexTAqPSo9Kj0qPSo9EqQB7/QaPRX7RZQAAAAASUVORK5CYII=",
            place_id: 1,
            category_id: 1,
            vehicle_id: 1,
            slot_id: 2,
            barcode: "67553873939d2",
            in_time: "2024-12-08 12:10:59",
            out_time: "2024-12-08 12:11:18",
            status: "",
            duration: 1,
            place: {
              id: 1,
              name: "Khulshi",
              description: null,
              status: "active",
            },
            category: {
              id: 1,
              name: "Car",
              description: null,
            },
            slot: {
              id: 2,
              name: "Slot 2",
              remarks: null,
              status: "available",
              created_by: 1,
              floor_id: 1,
              createdByUser: null,
              floor: null,
              category: null,
              place: null,
              block: null,
              updated_by: 2,
              deleted_by: 2,
            },
            payments: null,
            payment: null,
            tariff: null,
            floor: {
              id: 1,
              name: "Ground",
              remarks: null,
              place_id: 1,
              place: null,
              blocks: null,
            },
            vehicle: {
              id: 1,
              number: "12345",
              driver_name: "John Doe",
              driver_mobile: "01521478778",
              status: "checked_out",
              category_id: 1,
              membership: null,
            },
          },
          transaction_id: "67553890c8fb7",
          payment_type: "full",
        },
      ];

      // router.push({ query: newQuery });
    }
  },
  { deep: false, immediate: true }
);
</script>
<template>
  <div
    class="flex flex-col justify-center items-center md:w-[80%] h-screen text-green-500 text-3xl"
  >
    Congratulations!
    <div class="text-center">
      <strong class="ml-2"> Transaction successful.</strong>
    </div>
    <button
      @click="showInvoice = !showInvoice"
      class="mt-2 rounded-md border border-transparent px-3 py-2 bg-indigo-600 text-white text-base font-medium shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
    >
      Print invoice
    </button>
  </div>
  <CheckoutForm
    :show="showInvoice"
    @onClose="showInvoice = false"
    :pdfData="responses"
  />
</template>
<style lang="scss" scoped></style>
