<!--
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
-->
<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white">
    <body class="h-full">
    ```
  -->
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog
        as="div"
        class="relative z-50 lg:hidden"
        @close="sidebarOpen = false"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in-out duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div
                  class="absolute left-full top-0 flex w-16 justify-center pt-5"
                >
                  <button
                    type="button"
                    class="-m-2.5 p-2.5"
                    @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div
                class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4"
              >
                <div class="flex h-16 shrink-0 items-center">
                  <img
                    class="h-8 w-auto"
                    src="/assets/khulshi.png"
                    alt="Your Company"
                  />
                </div>
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="grid grid-cols-2 gap-2 -mx-2 space-y-1">
                        <li
                          v-for="(item, index) in state.menuItems"
                          :key="index"
                          class="cursor-pointer shadow-md py-4 px-2"
                        >
                          <a
                            @click.prevent="toggleMenu(index)"
                            class="flex gap-2 items-center"
                          >
                            <!-- Use the icon dynamically -->
                            <component
                              class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                              :is="item.icon"
                            ></component>
                            <nuxt-link v-if="!(item?.children?.length)" @click="sidebarOpen = false" class="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md text-sm leading-6 font-semibold" :to="item.href">{{
                              item.name
                            }}</nuxt-link>
                            <span v-else class="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md text-sm leading-6 font-semibold" :to="item.href">{{
                              item.name
                            }}</span>
                          </a>
                          <ul
                            v-if="item.show && item.children"
                            class="ml-8 mt-4"
                          >
                            <li
                              v-for="(child, idx) in item.children"
                              :key="idx"
                              @click="sidebarOpen = false"
                              class="flex gap-2"
                            >
                              <component
                                v-if="child.icon"
                                class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                :is="child.icon"
                              ></component>

                              <nuxt-link :to="child.href">{{
                                child.name
                              }}</nuxt-link>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div
      class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:max-w-72 lg:flex-col"
    >
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div
        class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4"
      >
        <div class="flex h-16 shrink-0 items-center">
          <img
            class="h-8 w-auto"
            src="/assets/khulshi.png"
            alt="Your Company"
          />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li
              v-for="(item, index) in state.menuItems"
              :key="index"
              class="cursor-pointer"
            >
              <a @click.prevent="toggleMenu(index)" class="flex gap-2">
                <!-- Use the icon dynamically -->
                <component
                  class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                  :is="item.icon"
                ></component>
                <nuxt-link v-if="!(item?.children?.length)" :to="item.href">{{ item.name }}</nuxt-link>
                <span v-else>{{ item.name }}</span>
              </a>
              <ul v-if="item.show && item.children" class="ml-8 mt-4">
                <li
                  v-for="(child, idx) in item.children"
                  :key="idx"
                  class="flex gap-2"
                >
                  <component
                    v-if="child.icon"
                    class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                    :is="child.icon"
                  ></component>

                  <nuxt-link :to="child.href">{{ child.name }}</nuxt-link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="lg:pl-72">
      <div class="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
        <div
          class="flex md:hidden h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none"
        >
          <button
            type="button"
            class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            @click="sidebarOpen = true"
          >
            <span class="sr-only">Open sidebar</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>

          <!-- Separator -->

          
        </div>
      </div>

      <main class="md:py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NuxtPage />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import SingleNav from "@/components/SingleNav.vue";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
const route = useRoute();
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
import { useMenu } from "~/hooks/useMenu";
const { state, toggleMenu, setActiveMenu } = useMenu();
onMounted(() => {
  setActiveMenu();
});

watch(
  () => useRoute().fullPath,
  () => {
    setActiveMenu();
  }
);
const rawNavigation = ref([
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, show: false },
  {
    name: "User",
    href: "/user",
    icon: UsersIcon,
    show: false,
    children: [
      { name: "Add", href: "/add/user" },
      { name: "List", href: "/user" },
    ],
  },
  {
    name: "Place",
    href: "/place",
    icon: CalendarIcon,
    show: false,
    children: [
      { name: "Add", href: "/add/place" },
      { name: "List", href: "/place" },
    ],
  },
  {
    name: "Category",
    href: "/category",
    icon: DocumentDuplicateIcon,
    show: false,
    children: [
      { name: "Add", href: "/add/category" },
      { name: "List", href: "/category" },
    ],
  },
  {
    name: "Floor",
    href: "/floor",
    icon: ChartPieIcon,
    show: false,
    children: [
      { name: "Add", href: "/add/floor" },
      { name: "List", href: "/floor" },
    ],
  },
  {
    name: "Tariff",
    href: "/tariff",
    icon: ChartPieIcon,
    show: false,
    children: [
      { name: "Add", href: "/add/tariff" },
      { name: "List", href: "/tariff" },
    ],
  },
  {
    name: "Slot setup",
    href: "/slot",
    icon: ChartPieIcon,
    show: false,
    children: [
      { name: "Add", href: "/add/slot" },
      { name: "List", href: "/slot" },
    ],
  },
  {
    name: "Parking",
    href: "/parking",
    icon: ChartPieIcon,
    show: false,
    children: [
      { name: "Add", href: "/add/parking" },
      { name: "List", href: "/parking" },
    ],
  },
  {
    name: "Reports",
    href: "/reports",
    icon: ChartPieIcon,
    show: false,
    children: [
      { name: "parking", href: "/reports/parking" },
      { name: "transaction", href: "reports/transaction" },
    ],
  },
]);
const navigation = computed(() => {
  return rawNavigation.value.map((item) => {
    // console.log(route.name, item.href);
    const href = item.href.split("/")[1];
    // console.log(href);
    return {
      ...item,
      // show: false,
      current: route.name.includes(href),
      children: item?.children?.length
        ? item.children.map((child) => {
            const href = item.href.split("/")[1];
            return {
              ...child,
              current: !!(child.href == route.path),
            };
          })
        : [],
    };
  });
});
const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];
const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];
const showChild = (key) => {
  rawNavigation.value = rawNavigation.value.map((item) => {
    console.log(item.href, 7777, key);
    if (item.href == key) {
      return {
        ...item,
        show: !item.show,
      };
    }
    return {
      ...item,
      show: false,
    };
  });
};
const barcode = ref("");
const checkout = () => {
  // window.location.href='/parking-checkout/'
  console.log(barcode.value, 12345);

  const router = useRouter();
  router.push(`/parking-checkout/${barcode.value}`);
};

const sidebarOpen = ref(false);
onMounted(() => {
  console.log(123, "auth layout");
});
</script>
