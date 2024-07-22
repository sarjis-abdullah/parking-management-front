<template>
  <header class="flex justify-between text-gray-900 mb-3 text-xl">
    <h6 class="hidden md:inline-block capitalize">{{ title }} List</h6>
    <Link :to="'/add/' + title" class="w-full md:w-auto text-center"> Add {{title}} </Link>
  </header>
</template>

<script setup>
import Link from "@/components/common/Link.vue";

defineProps({
    title: {
        type: String,
        required: true
    },
})
</script>

<style lang="scss" scoped></style>
