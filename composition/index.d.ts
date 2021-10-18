import _Vue from "vue"
import type { VueConstructor } from "vue/types/vue"
import type { PluginOptions } from "../src/types"
import type ToastInterface from "../src/ts/interface"

declare let provideToast: (options?: PluginOptions) => void
declare let useToast: (
  eventBus?: InstanceType<VueConstructor>
) => ReturnType<typeof ToastInterface>

export { provideToast, useToast }
