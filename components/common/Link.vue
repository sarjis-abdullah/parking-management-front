<template>
  <nuxt-link
    :to="to"
    class="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
  >
    <slot></slot>
  </nuxt-link>
</template>
<script setup>
const props = defineProps({
  to: {
    type: String,
    default: "/",
  },
});
</script>
