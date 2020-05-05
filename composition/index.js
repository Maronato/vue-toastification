const Vue = require("vue"); // eslint-disable-line @typescript-eslint/no-var-requires
const { inject, provide } = require("@vue/composition-api"); // eslint-disable-line @typescript-eslint/no-var-requires

const toastSymbol = Symbol("Vue Toastification");

let createToastInterface = () => {
  const toast = () =>
    console.warn("[Vue Toastification] This plugin does not support SSR!");
  return new Proxy(toast, {
    get: function() {
      return toast;
    }
  });
};

if (typeof window !== "undefined") {
  const toastification = require("vue-toastification"); // eslint-disable-line @typescript-eslint/no-var-requires
  createToastInterface = toastification.createToastInterface;
}

/** @type {ReturnType<typeof createToastInterface>} */
const interfaceFromBus = bus => {
  const VueClass = typeof Vue.prototype === "undefined" ? Vue.default : Vue;
  return bus instanceof VueClass ? createToastInterface(bus) : undefined;
};

// Generate provider and consumer
const provideToast = options =>
  provide(toastSymbol, createToastInterface(options));
const useToast = eventBus =>
  interfaceFromBus(eventBus) || inject(toastSymbol, interfaceFromBus(eventBus));

module.exports = { provideToast, useToast };
