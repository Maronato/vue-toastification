import { InjectionKey, provide, inject, getCurrentInstance } from "vue"
import {
  EventBusInterface,
  isEventBusInterface,
  EventBus,
  globalEventBus,
} from "../eventBus"
import { buildInterface } from "../interface"
import { VT_NAMESPACE } from "../constants"
import { isBrowser } from "../utils"
import type { PluginOptions } from "../../types"
import type { ToastInterface } from "../interface"
import * as ownExports from "./useToast"

const toastInjectionKey: InjectionKey<ToastInterface> =
  Symbol("VueToastification")

/**
 * Creates (or recovers) a toast instance and returns
 * an interface to it
 */
interface CreateToastInstance {
  /**
   * Creates an interface to an existing instance from its interface
   */
  (eventBus: EventBusInterface): ToastInterface
  /**
   * Creats a new instance of Vue Toastification
   */
  (options?: PluginOptions): ToastInterface
}

const createMockToastInstance: CreateToastInstance = () => {
  const toast = () =>
    console.warn(`[${VT_NAMESPACE}] This plugin does not support SSR!`)
  return new Proxy(toast, {
    get() {
      return toast
    },
  }) as unknown as ToastInterface
}

const createToastInstance: CreateToastInstance = optionsOrEventBus => {
  if (!isBrowser()) {
    return createMockToastInstance()
  }
  if (isEventBusInterface(optionsOrEventBus)) {
    return buildInterface({ eventBus: optionsOrEventBus }, false)
  }
  return buildInterface(optionsOrEventBus, true)
}

const provideToast = (options?: PluginOptions) => {
  if (getCurrentInstance()) {
    const toast = ownExports.createToastInstance(options)
    provide(toastInjectionKey, toast)
  }
}

const useToast = (eventBus?: EventBus) => {
  if (eventBus) {
    return ownExports.createToastInstance(eventBus)
  }
  const toast = getCurrentInstance()
    ? inject(toastInjectionKey, undefined)
    : undefined
  return toast ? toast : ownExports.createToastInstance(globalEventBus)
}

export { useToast, provideToast, toastInjectionKey, createToastInstance }
