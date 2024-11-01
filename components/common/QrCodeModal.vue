<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="onClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 w-full text-left shadow-xl transition-all sm:my-8 w-min-full md:w-full sm:p-6"
              :class="[maxWidth, minWidth]"
            >
              <qrcode-vue class="mx-auto" :value="value" :size="300" level="H" />
              <slot />
              <div class="mt-5 sm:mt-6">
                <div class="flex justify-end gap-2 mt-4">
                  <button
                    @click="onClose"
                    class="px-2 py-1 bg-indigo-500 text-white rounded-md"
                  >
                    Done
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { defineProps } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/20/solid";
import QrcodeVue from "qrcode.vue";

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: "",
  },
  maxWidth: {
    type: String,
    default: "sm:max-w-sm",
  },
  minWidth: {
    type: String,
    default: "sm:min-w-sm",
  },
});
const emit = defineEmits(["onClose"]);
const onClose = () => {
  emit("onClose");
};
</script>
