<template>
    <div v-if="total" class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div class="flex flex-1 justify-between sm:hidden">
        <a href="#" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
        <a href="#" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            {{ ' ' }}
            <span class="font-medium">{{ (currentPage-1)*perPage+1 }}</span>
            {{ ' ' }}
            -
            {{ ' ' }}
            <span class="font-medium">{{ (currentPage-1)*perPage + totalPerPage }}</span>
            {{ ' ' }}
            {{'of'}}
            {{ ' ' }}
            <span class="font-medium">{{ total }}</span>
          </p>
        </div>
        <div class="flex items-center gap-4">
          <slot></slot>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <a :class="currentPage > 1 ?'cursor-pointer' :''" @click.prevent="prev" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <span class="sr-only">Previous</span>
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </a>
            <a v-for="page in pages" :key="page" @click.prevent="navigate(page)" class="cursor-pointer" :class="page==currentPage?'relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600':'relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex'">{{ page }}</a>

            <a :class="currentPage < lastPage ?'cursor-pointer' :''" @click="next" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              <span class="sr-only">Next</span>
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid';

  const props = defineProps({
    lastPage: {
      default:1
    },
    perPage:{
      default:10
    },
    totalPerPage:{
      default:0
    },
    total:{
      default: 0
    }
  })
  const emit = defineEmits(['onChange'])
  const pages = ref([]);
  watch(props,(currentValue)=>{
    pages.value = [];
    for (let index = 1; index <= currentValue.lastPage; index++) {
      pages.value.push(index);

    }
  })
  const currentPage = ref(1);
  onMounted(()=>{
    pages.value = [];
    for (let index = 1; index <= props.lastPage; index++) {
      pages.value.push(index);

    }
  })
  const prev = ()=>{
    if(currentPage.value >1){
      currentPage.value = currentPage.value-1;
      emit('onChange',currentPage.value);
    }
  }
  const navigate = (page)=>{
    currentPage.value = page;
    emit('onChange',currentPage.value);
  }
  const next = ()=>{
    if(currentPage.value <props.lastPage){
      currentPage.value = currentPage.value+1;
      emit('onChange',currentPage.value);
    }
  }
  </script>
