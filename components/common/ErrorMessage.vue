<template>
    <span class="text-red-500" v-for="(err, index) in errors" :key="index">
    {{ err.$message }}
  </span>
</template>

<script setup>
defineProps({
    errors: {
        type: Array,
        default: null
    }
})
</script>

<style scoped>

</style>