import { inject, provide } from "@vue/composition-api";
import { createToastInterface } from "vue-toastification";

const toastSymbol = Symbol("Vue Toastification");

/** @type {ReturnType<typeof createToastInterface>} */
const injectDefault = {};

// Generate provider and consumer
const provideToast = options =>
  provide(toastSymbol, createToastInterface(options));
const useToast = () => inject(toastSymbol, injectDefault);

export { provideToast, useToast };
