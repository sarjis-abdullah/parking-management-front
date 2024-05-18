<template>
  <ul>
    <li v-for="item in error" :key="item">
      <span class="text-red-500">
        -{{ item?.length ? item.toString() : '' }}
      </span>
    </li>
  </ul>
</template>

<script setup>
defineProps({
    error: {
        type: [Object, null],
        required: true
    }
})
</script>

<style lang="scss" scoped></style>
