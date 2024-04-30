<template>
  <li>
    <span
      :to="item.href"
      :class="[
        item.current
          ? 'bg-gray-50 text-indigo-600'
          : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
      ]"
    >
      <component
        :is="item.icon"
        :class="[
          item.current
            ? 'text-indigo-600'
            : 'text-gray-400 group-hover:text-indigo-600',
          'h-6 w-6 shrink-0',
        ]"
        aria-hidden="true"
      />
      <span class="cursor-pointer border px-2 py-1" @click="show = !show">
        {{ item.name }}
        <!-- current: {{ item.current }}
        show: {{ item.show }} -->
        </span
      >
    </span>
    <div
      class="ml-16"
      v-if="show || item.current"
      v-for="child in item.children"
      :key="child.href"
    >
      <nuxt-link
        :class="[
          child.current
            ? 'text-indigo-600'
            : 'text-gray-400 group-hover:text-indigo-600',
          'h-6 w-6 shrink-0',
        ]"
        :to="child.href"
      >
        {{ child.name }}
      </nuxt-link>
    </div>
  </li>
</template>

<script setup>
import { ref } from "vue";
defineProps({
  item: null,
});
const show = ref(false);
</script>

<style lang="scss" scoped></style>
