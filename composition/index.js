import Vue from "vue";
import { inject, provide } from "@vue/composition-api";
import { createToastInterface } from "vue-toastification";

const toastSymbol = Symbol("Vue Toastification");

/** @type {ReturnType<typeof createToastInterface>} */
const interfaceFromBus = bus =>
  bus instanceof Vue ? createToastInterface(bus) : undefined;

// Generate provider and consumer
const provideToast = options =>
  provide(toastSymbol, createToastInterface(options));
const useToast = eventBus =>
  interfaceFromBus(eventBus) || inject(toastSymbol, interfaceFromBus(eventBus));

export { provideToast, useToast };
