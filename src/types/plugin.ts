import type { App, ComponentPublicInstance } from "vue"

import type { BaseToastOptions } from "./toast"
import type { BaseToastContainerOptions } from "./toastContainer"

export declare interface BasePluginOptions
  extends BaseToastContainerOptions,
    BaseToastOptions {}

export declare interface PluginOptions extends BasePluginOptions {
  /**
   * Callback executed when the toast container is mounted.
   *
   * Receives the Container vue instance as a parameter.
   */
  onMounted?: (
    containerComponent: ComponentPublicInstance,
    containerApp: App<Element>
  ) => void
  /**
   * Shares the context of your app with your toasts
   *
   * This allows toasts to use your app's plugins, mixins, global components, etc.
   *
   * If you set it to `true`, the app wherein the plugin is installed will be used.
   * You may also provide the app instance you wish to use.
   */
  shareAppContext?: boolean | App
}
