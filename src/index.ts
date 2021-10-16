import { Plugin, InjectionKey, provide, inject, getCurrentInstance } from "vue"
import { buildInterface } from "./ts/interface"
import type { ToastInterface } from "./ts/interface"
import { POSITION, TYPE } from "./ts/constants"
import { EventBusInterface, isEventBusInterface, EventBus } from "./ts/eventBus"
import type { PluginOptions } from "./types"
import * as ownExports from "./index"
import "./scss/index.scss"
import { isBrowser } from "./ts/utils"

const createMockToastInterface = (): ToastInterface => {
  const toast = () =>
    console.warn("[Vue Toastification] This plugin does not support SSR!")
  return new Proxy(toast, {
    get() {
      return toast
    },
  }) as unknown as ToastInterface
}

function createToastInterface(eventBus: EventBusInterface): ToastInterface
function createToastInterface(options?: PluginOptions): ToastInterface
function createToastInterface(
  optionsOrEventBus?: PluginOptions | EventBusInterface
): ToastInterface {
  if (!isBrowser()) {
    return createMockToastInterface()
  }
  if (isEventBusInterface(optionsOrEventBus)) {
    return buildInterface({ eventBus: optionsOrEventBus }, false)
  }
  return buildInterface(optionsOrEventBus, true)
}

const toastInjectionKey: InjectionKey<ToastInterface> =
  Symbol("VueToastification")

const globalEventBus = new EventBus()

const VueToastificationPlugin: Plugin = (App, options?: PluginOptions) => {
  const inter = createToastInterface({ eventBus: globalEventBus, ...options })
  App.provide(toastInjectionKey, inter)
}

const provideToast = (options?: PluginOptions) => {
  const toast = ownExports.createToastInterface(options)
  provide(toastInjectionKey, toast)
}

const useToast = (eventBus?: EventBus) => {
  if (eventBus) {
    return ownExports.createToastInterface(eventBus)
  }
  const toast = getCurrentInstance() ? inject(toastInjectionKey) : undefined
  return toast ? toast : ownExports.createToastInterface(globalEventBus)
}

export default VueToastificationPlugin

export {
  // Types
  ToastInterface,
  PluginOptions,
  // Consts
  POSITION,
  TYPE,
  toastInjectionKey,
  // Functions
  createToastInterface,
  useToast,
  provideToast,
  // Classes
  EventBus,
  // Instances
  globalEventBus,
}
