<template>
  <Default>
    <section class="grid items-center h-screen">
      <div class="p-4 min-w-[30rem] max-w-lg mx-auto shadow-2xl bg-white">
        <section class="p-4">
          <form
            v-if="!regFormSubmitted"
            @submit.prevent="submitForm"
            class="grid gap-2"
          >
            <img src="/assets/khulshi.png" class="bg-white mb-4" />
            <!-- Name -->
            <div class="grid gap-2" :style="style">
              <label for="name" :class="brandColor" class="block font-bold"
                >Name</label
              >
              <input
                type="text"
                id="name"
                v-model="formData.name"
                :class="inputClass"
                placeholder="e.g. John Doe"
                required
              />
              <span v-if="errors.name" class="text-red-500">{{
                errors.name
              }}</span>
            </div>
            <!-- Phone -->
            <div class="grid gap-2" :style="style">
              <label for="phone" :class="brandColor" class="block font-bold"
                >Phone</label
              >
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

            <!-- Birth Date -->
            <div class="grid gap-2" :style="style">
              <label for="birthDate" :class="brandColor" class="block font-bold"
                >Birth Date</label
              >
              <input
                type="date"
                id="birthDate"
                v-model="formData.birthDate"
                :class="inputClass"
                required
              />
              <span v-if="errors.birthDate" class="text-red-500">{{
                errors.birthDate
              }}</span>
            </div>

            <!-- Address -->
            <div class="grid gap-2" :style="style">
              <label for="address" :class="brandColor" class="block font-bold"
                >Address</label
              >
              <input
                type="text"
                id="address"
                v-model="formData.address"
                :class="inputClass"
                placeholder="e.g. 1 no road, Khulshi, Chittagong"
                required
              />
              <span v-if="errors.address" class="text-red-500">{{
                errors.address
              }}</span>
            </div>

            <!-- Email -->
            <div class="grid gap-2" :style="style">
              <label for="email" :class="brandColor" class="block font-bold"
                >Email</label
              >
              <input
                type="email"
                id="emailid"
                v-model="formData.email"
                placeholder="e.g. john@gmail.com"
                :class="inputClass"
              />
              <span v-if="errors.email" class="text-red-500">{{
                errors.email
              }}</span>
            </div>

            <!-- Occupation -->
            <div class="grid gap-2" :style="style">
              <label
                for="occupation"
                :class="brandColor"
                class="block font-bold"
                >Occupation</label
              >
              <select
                id="occupation"
                v-model="formData.occupation"
                class="focus:outline-none bg-none"
                style="background: none"
                :class="inputClass"
              >
                <option disabled :value="''">Select Occupation</option>
                <option value="Business">Business</option>
                <option value="Service">Service</option>
                <option value="Student">Student</option>
                <option value="Other">Other</option>
                <!-- Add more options as needed -->
              </select>
            </div>

            <!-- Family Members -->
            <div class="grid gap-2" :style="style">
              <label
                for="familyMembers"
                :class="brandColor"
                class="block font-bold"
                >Family Members</label
              >
              <select
                id="familyMembers"
                v-model="formData.familyMembers"
                class="focus:outline-none bg-none"
                :class="inputClass"
                style="background: none"
              >
                <option disabled :value="''">Select Family Members</option>
                <option value="1-3">1-3</option>
                <option value="4-6">4-6</option>
                <option value="7-Above">7-Above</option>
                <!-- Add more options as needed -->
              </select>
            </div>

            <!-- Anniversary -->
            <div class="grid gap-2" :style="style">
              <label
                for="anniversary"
                :class="brandColor"
                class="block font-bold"
                >Anniversary</label
              >
              <input
                type="date"
                id="anniversary"
                v-model="formData.anniversary"
                :class="inputClass"
              />
              <span v-if="errors.anniversary" class="text-red-500">{{
                errors.anniversary
              }}</span>
            </div>

            <!-- Gender -->
            <div class="flex gap-4 mt-2" style="">
              <label :class="brandColor" class="block font-bold">Gender</label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  v-model="formData.gender"
                  value="Male"
                  class="form-radio"
                />
                <span class="ml-2">Male</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  v-model="formData.gender"
                  value="Female"
                  class="form-radio"
                />
                <span class="ml-2">Female</span>
              </label>
            </div>
            <div class="flex gap-4 mt-2">
              <label :class="brandColor" class="block font-bold"
                >Complimentary Card</label
              >
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="card"
                  v-model="formData.hasComplimentaryCard"
                  value="Yes"
                  class="form-radio"
                />
                <span class="ml-2">Yes</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="card"
                  v-model="formData.hasComplimentaryCard"
                  value="No"
                  class="form-radio"
                />
                <span class="ml-2">No</span>
              </label>
            </div>
            <div class="flex gap-4 mt-2">
              <input type="checkbox" v-model="isAgree" />
              <a
                :class="brandColor"
                :href="TERMS_AND_CONDITION_LINK"
                target="_blank"
                class="block underline hover:text-blue-500"
                >I agree with terms & condition</a
              >
            </div>

            <button
              type="submit"
              v-if="!loading"
              :disabled="!isAgree"
              :class="
                isAgree
                  ? 'bg-[#89BC40] hover:bg-[#89BC40]'
                  : 'bg-gray-500 hover:bg-gray-600'
              "
              class="text-white px-4 py-2 rounded mt-4"
            >
              Submit
            </button>
            <span v-else>Processing</span>
          </form>

          <form v-else @submit.prevent="submitOtpForm" class="grid gap-2">
            <label
              @click="
                () => {
                  success = false;
                  regFormSubmitted = false;
                  errors.otpError = '';
                  otp = '';
                  errors = {};
                }
              "
              class="block cursor-pointer"
              >< Back</label
            >
            <!-- Name -->
            <div class="grid gap-2" :style="style">
              <label for="name" class="block font-bold">OTP</label>
              <input
                type="text"
                id="name"
                v-model="otp"
                :class="inputClass"
                placeholder="e.g. 1234"
                required
              />
              <span v-if="errors?.otp" class="text-red-500">{{
                errors.otp
              }}</span>
            </div>

            <button
              type="submit"
              :disabled="otp == '' || otp == null"
              v-if="!loading"
              class="bg-[#89BC40] hover:bg-[#89BC40] text-white px-4 py-2 rounded mt-4"
            >
              Submit
            </button>
            <span v-else>Processing</span>
            <div class="mt-4 text-center text-red-500" v-if="errors.otpError">
              {{ errors.otpError }}
            </div>
          </form>
        </section>
      </div>
    </section>
  </Default>
</template>

<script setup>
import { useReCaptcha } from "vue-recaptcha-v3";
import { ref } from "vue";
import Default from "../layouts/Default.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
definePageMeta({
  layout: "Default",
});
const config = useRuntimeConfig();
const url = config.public.BASE_URL + "user";
const style = "";
const inputClass =
  "relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none focus:ring-blue-500 sm:text-sm focus:border-blue-500";
const defaultData = {
  name: "",
  address: "",
  phone: "",
  birthDate: "",
  email: "",
  occupation: "",
  familyMembers: "",
  gender: "",
  anniversary: "",
  hasComplimentaryCard: false,
};
const TERMS_AND_CONDITION_LINK =
  "https://l.facebook.com/l.php?u=https%3A%2F%2Freg.kbakery.com.bd%2Fterms%26condition%3Ffbclid%3DIwAR3ZHAuljA8NIQrStmVdluorz8VY4EWvitgrQvpPS5kMCxeboy4-Zgzdvw4_aem_AX98AXyHp5MERWziwe-z6zha2l6MmwgUPO7OD5sOi7nSXQpUMafwcgnJUTJ8BMLSL-5bWtuyrL95BUSdxRFX2OTY&h=AT2B_Sr8ONx6XxdMkG2Dtu1GZBmkicPQY201twhQlPY8-0Djn3DfSQqhPEVrpbjHP1qCCnL3M_HJUKAohCkSMgn6lbnkew774nnlQufP8xmAngdBOEQhsOcrAyUrDA";
const formData = ref({ ...defaultData });

const errors = ref({});
const loading = ref(false);
const isAgree = ref(false);
const regFormSubmitted = ref(false);
const success = ref(false);
const userId = ref(null);
const otp = ref("");
const brandColor = ref("");

const recaptchaInstance = useReCaptcha();

const onSubmit = async ()=> {
        // get the token on your method
        const token = await this.recaptcha();

        // use the token as your convenience
    }
const recaptcha = async () => {
  // optional you can await for the reCaptcha load
  await recaptchaInstance?.recaptchaLoaded();

  // get the token, a custom action could be added as argument to the method
  const token = await recaptchaInstance?.executeRecaptcha("onSubmit");

  return token;
};
recaptcha()

const formattedData = computed(() => {
  return {
    ...formData.value,
    hasComplimentaryCard: !!formData.value.hasComplimentaryCard == "Yes",
  };
});

const submitForm = () => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedData.value),
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
      console.log("Success:", data);
      userId.value = data.data.id;
      formData.value = { ...defaultData };
      setTimeout(() => {
        loading.value = false;
      }, 1000);
      regFormSubmitted.value = true;
    })
    .catch((error) => {
      setTimeout(() => {
        loading.value = false;
      }, 1000);
      // Handle error from the server or network
    });
};
const notify = () => {
  toast.success("Thanks for the registration.", {
    autoClose: 2000,
  }); // ToastOptions
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
      regFormSubmitted.value = false;
      errors.value = {};
      isAgree.value = false;
      notify();
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
