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
  if (typeof window === "undefined") {
    return createMockToastInterface()
  }
  if (isEventBusInterface(optionsOrEventBus)) {
    return buildInterface({ eventBus: optionsOrEventBus }, false)
  }
  return buildInterface(optionsOrEventBus, true)
}

const toastInjectionKey: InjectionKey<ToastInterface> = Symbol(
  "VueToastification"
)

const VueToastificationPlugin: Plugin = (App, options?) => {
  const inter = createToastInterface(options)
  App.provide(toastInjectionKey, inter)
}

const provideToast = (options?: PluginOptions) => {
  provide(toastInjectionKey, createToastInterface(options))
}

const useToast = (eventBus?: EventBus) => {
  if (eventBus) {
    return createToastInterface(eventBus)
  }
  const toast = inject(toastInjectionKey)
  return toast ? toast : createToastInterface(new EventBus())
}

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
