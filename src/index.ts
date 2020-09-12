import { Plugin, InjectionKey, provide, inject } from "vue"
import { buildInterface, ToastInterface } from "./ts/interface"
import { POSITION, TYPE } from "./ts/constants"
import { EventBusInterface, isEventBusInterface, EventBus } from "./ts/eventBus"
import type { PluginOptions } from "./types"
import "./scss/index.scss"

const createMockToastInterface = (): ToastInterface => {
  const toast = () =>
    console.warn("[Vue Toastification] This plugin does not support SSR!")
  return (new Proxy(toast, {
    get() {
      return toast
    },
  }) as unknown) as ToastInterface
}

function createToastInterface(eventBus: EventBusInterface): ToastInterface
function createToastInterface(options?: PluginOptions): ToastInterface
function createToastInterface(
  optionsOrEventBus?: PluginOptions | EventBusInterface
): ToastInterface {
  console.log("creating interface")
  if (typeof window === "undefined") {
    return createMockToastInterface()
  }
  if (isEventBusInterface(optionsOrEventBus)) {
    console.log("created from bus")
    return buildInterface({ eventBus: optionsOrEventBus }, false)
  }
  console.log("creating brand new interface")
  return buildInterface(optionsOrEventBus, true)
}

const toastInjectionKey: InjectionKey<ToastInterface> = Symbol(
  "VueToastification"
)

const VueToastificationPlugin: Plugin = (App, options?) => {
  console.log("providing")
  const inter = createToastInterface(options)
  console.log(inter)
  App.provide(toastInjectionKey, inter)
}

const provideToast = (options?: PluginOptions) => {
  provide(toastInjectionKey, createToastInterface(options))
}

const useToast = (eventBus?: EventBusInterface): ToastInterface =>
  eventBus
    ? createToastInterface(eventBus)
    : inject(toastInjectionKey, createToastInterface(new EventBus()))

export default VueToastificationPlugin

export {
  POSITION,
  TYPE,
  createToastInterface,
  toastInjectionKey,
  EventBus,
  useToast,
  provideToast,
  PluginOptions,
}
