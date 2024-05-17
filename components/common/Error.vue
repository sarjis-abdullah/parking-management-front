<template>
  <ul>
    <li v-for="item in error" :key="item">
      <span class="text-red-500">
        -{{ item?.length ? item.toString() : 2 }}
      </span>
    </li>
  </ul>
</template>

<script setup>
defineProps({
    error: {
        type: Object,
        required: true
    }
})
</script>

<style lang="scss" scoped></style>
