<template>
  <div class="p-4 max-w-lg mx-auto shadow-2xl">
    <section class="p-4">
      <form
        v-if="!regFormSubmitted"
        @submit.prevent="submitForm"
        class="grid gap-2"
      >
        <!-- Phone -->
        <div class="grid gap-2" :style="style">
          <label for="phone" class="block font-bold">Phone</label>
          <input
            type="text"
            id="phone"
            v-model="formData.phone"
            :class="inputClass"
            placeholder="e.g. +880123456789"
            required
          />
          <span v-if="errors.phone" class="text-red-500">{{
            errors.phone
          }}</span>
        </div>

        <!-- Email -->
        <div class="grid gap-2" :style="style">
          <label for="email" class="block font-bold">Password</label>
          <input
            type="password"
            id="email"
            v-model="formData.password"
            :class="inputClass"
          />
          <span v-if="errors.email" class="text-red-500">{{
            errors.email
          }}</span>
        </div>

        <button
          type="submit"
          v-if="!loading"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
        >
          Login
        </button>
        <span v-else>Processing</span>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
// import AccountStorage from "../storage/Index";

const route = useRoute();

const config = useRuntimeConfig();
const url = config.public.BASE_URL + "user/login";
const style = "";
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
const defaultData = {
  password: "",
  phone: "",
};
const formData = ref({ ...defaultData });

const errors = ref({});
const loading = ref(false);
const regFormSubmitted = ref(false);
const success = ref(false);
const userId = ref(null);
const otp = ref("");

const submitForm = () => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData.value),
  };
  loading.value = true;
  errors.otpError = "";
  // Send POST request using fetch
  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          errors.value = data;
          throw new Error(data);
        });
      }
      return response.json();
    })
    .then((data) => {
      loading.value = false;
      console.log(data, 12345);
      if (data.user) {
        localStorage.setItem('LOGIN_ACCOUNT',JSON.stringify(data.user));
        // AccountStorage.saveAccount(data.user);
      }
    })
    .catch((error) => {
      setTimeout(() => {
        loading.value = false;
      }, 1000);
      // Handle error from the server or network
    });
};
const submitOtpForm = () => {
  // Options for the fetch request
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: otp.value,
    }),
  };
  loading.value = true;
  errors.value.otpError = "";
  // Send POST request using fetch
  fetch(url + "/" + userId.value, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      setTimeout(() => {
        loading.value = false;
      }, 1000);
      // regFormSubmitted.value = false
      errors.value.otpError = "";
      otp.value = null;
      userId.value = null;
      success.value = true;
    })
    .catch((error) => {
      console.error("Error:", error);
      setTimeout(() => {
        loading.value = false;
      }, 1000);
      errors.value.otpError = "Otp not matched";
      // Handle error from the server or network
    });
};
</script>
