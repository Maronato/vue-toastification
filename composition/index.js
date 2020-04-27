import Vue from "vue";
import { inject, provide } from "@vue/composition-api";
import { createToastInterface } from "vue-toastification";

const toastSymbol = Symbol("Vue Toastification");

/** @type {ReturnType<typeof createToastInterface>} */
const injectDefault = bus =>
  bus instanceof Vue ? createToastInterface(bus) : undefined;

// Generate provider and consumer
const provideToast = options =>
  provide(toastSymbol, createToastInterface(options));
const useToast = eventBus => inject(toastSymbol, injectDefault(eventBus));

export { provideToast, useToast };
