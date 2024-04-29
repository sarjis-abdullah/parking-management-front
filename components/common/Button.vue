<template>
  <button
    type="button"
    class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
  >
    <slot></slot>
  </button>
</template>
<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
    default: "",
  },
  type: {
    type: String,
    default: "button",
  },
});
</script>
