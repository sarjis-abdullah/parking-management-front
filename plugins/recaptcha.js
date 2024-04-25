import { VueReCaptcha } from 'vue-recaptcha-v3';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueReCaptcha, {
        siteKey: '6LfC86opAAAAAGql83oBtvT0oSX33Aa9hA76LOLn',
    });
});