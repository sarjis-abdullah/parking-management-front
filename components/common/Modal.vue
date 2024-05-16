<template>
  
    <TransitionRoot as="template" :show="open" >
      <Dialog as="div" class="relative z-50" @close="onClose">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto" >
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" >
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 w-full text-left shadow-xl transition-all sm:my-8 w-min-full md:w-full sm:p-6" :class="[maxWidth,minWidth]">
                <div class="flex justify-between mb-3">
                  <span v-html="title"></span>
                  <a @click="onClose" class="cursor-pointer"><XMarkIcon class="w-6 h-6"/></a>
                </div>
                <slot />
                <div class="mt-5 sm:mt-6">
                  <slot name="footer"></slot>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
  import { XMarkIcon } from '@heroicons/vue/20/solid'
 defineProps({
    open:{
        type: Boolean,
        default: false
    },
    title:{
        type: String,
        default: ""
    },
    maxWidth:{
        type: String,
        default: "sm:max-w-sm"
    },
    minWidth:{
        type: String,
        default: "sm:min-w-sm"
    },
 })
 const emit = defineEmits(['onClose'])
 const onClose = ()=>{
  emit('onClose');
 }
  </script>