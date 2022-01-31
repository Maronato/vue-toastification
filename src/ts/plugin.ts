import { Plugin } from "vue"

import type { PluginOptions } from "../types/plugin"

import { createToastInstance, toastInjectionKey } from "./composables/useToast"
import { globalEventBus } from "./eventBus"

export const VueToastificationPlugin: Plugin = (
  App,
  options?: PluginOptions
) => {
  if (options?.shareAppContext === true) {
    options.shareAppContext = App
  }
  const inter = createToastInstance({
    eventBus: globalEventBus,
    ...options,
  })
  App.provide(toastInjectionKey, inter)
}
