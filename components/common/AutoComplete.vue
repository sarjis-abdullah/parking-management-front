<template>
  <div
    class="relative rounded-md border-2 border-gray-300 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500"
  >
    <div class="flex items-center justify-between">
      <input
        :value="modelValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleOnblur"
        :placeholder="placeholder"
        ref="inputRef"
        tabindex="0"
        :class="inputClass"
      />
      <XMarkIcon
        v-if="modelValue"
        @click.prevent="reset()"
        class="h-5 w-5 text-red-500 cursor-pointer mr-2"
        aria-hidden="true"
      />
    </div>
    <div
      v-show="modelValue && showOptions"
      @click.self="handleSelf()"
      @focusout="handleFocusOut"
      tabindex="0"
      :class="showList ? 'hidden' : dropdownClass"
    >
      <ul class="py-1">
        <li
          v-if="isLoading"
          class="px-3 py-2 text-center"
        >
          Loading
        </li>
        
        <li
          v-else-if="!searchResults.length && showNoDataMsg"
          class="px-3 py-2 text-center"
        >
          No Matching results
        </li>
        <li
          v-else
          v-for="(item, index) in searchResults"
          :key="index"
          @click="handleClick(item)"
          class="px-3 py-2 cursor-pointer hover:bg-gray-200"
        >
          {{ item.number }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useDebounce } from "~/hooks/useDebounce";
import { VehicleService } from "~/services/VehicleService";
import { XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: "",
  },
  placeholder: {
    type: String,
    required: false,
    default: "Enter text here.",
  },
  showNoDataMsg: {
    type: Boolean,
    default: true,
  },
  districtCode: {
    type: String,
    default: '',
  },
  inputClass: {
    type: String,
    required: false,
    default:
      "border-0 py-2 px-3 rounded-md focus:outline-none focus:shadow-outline",
  },
  dropdownClass: {
    type: String,
    required: false,
    default:
      "absolute w-full z-50 bg-white border border-gray-300 mt-2 mh-48 overflow-hidden overflow-y-scroll rounded-md shadow-md",
  },
});

const showOptions = ref(false);

const chosenOption = ref("");
const searchTerm = ref("");
const inputRef = ref(null);

const emit = defineEmits(["update:modelValue", "chosen", "resetSearch", "createNew"]);

const emitValue = (e) => emit("update:modelValue", e.target.value);
const searchResults = ref([]);
const isLoading = ref(false);

const showList = computed(
  () => !!(!props.showNoDataMsg && !searchResults.value.length)
);
const search = async () => {
  try {
    isLoading.value = true;
    let query = "";
    if (searchTerm.value) {
      query += `?query=${searchTerm.value}`;
    }
    if (props.districtCode) {
      query += `&district_code=${props.districtCode}`
    }
    const result = await VehicleService.getAll(query);
    if (result?.data?.length) {
      searchResults.value = result.data;
    } else {
      searchResults.value = [];
    }
  } catch (error) {}
  finally {
    isLoading.value = false
  }
};
const debouncedSearch = useDebounce(search, 500);

function reset() {
  emit("update:modelValue", "");
  emit("resetSearch");

  chosenOption.value = "";
}

function handleFocus() {
  if (searchResults.value.length) {
    showOptions.value = true; // Show options when input is focused if data exists
  }
}

function handleInput(evt) {
  emit("update:modelValue", evt.target.value);
  searchTerm.value = evt.target.value;
  showOptions.value = true;
  debouncedSearch();
}

function handleClick(item) {
  emit("update:modelValue", item.number);
  emit("chosen", item);
  chosenOption.value = item.number;
  showOptions.value = false;
  // inputRef.value?.focus();
  // $refs.input.focus();
}

function clickedOutside() {
  showOptions.value = false;

  if (!chosenOption.value) {
    emit("update:modelValue", "");
  }
}
function handleFocusOut() {
  showOptions.value = false;
  console.log(1234);
}
function handleOnblur() {
  if (props.showNoDataMsg) {
    return;
  }
  if (!props.showNoDataMsg && props.modelValue && !searchResults.value.length) {
    emit("createNew");
  }
}
</script>

<style scoped>
.mh-48 {
  max-height: 10rem;
}
</style>
