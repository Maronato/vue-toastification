import { createApp, nextTick } from "vue"

import ToastContainer from "../components/VtToastContainer.vue"

import type { ToastID } from "../types/common"
import type { BasePluginOptions, PluginOptions } from "../types/plugin"
import type {
  ToastContent,
  ToastOptions,
  ToastOptionsAndContent,
} from "../types/toast"

import { TYPE, EVENTS } from "./constants"
import { EventBus, EventBusInterface } from "./eventBus"
import { asContainerProps, getId, isUndefined } from "./utils"

/**
 * Display a toast
 */
interface ToastMethod<T extends TYPE = TYPE> {
  /**
   * @param content Toast content.
   *
   * Can be a string, JSX or a custom component passed directly
   *
   * To provide props and listeners to the custom component, you
   * do so by providing an object with the following shape:
   *
   * ```ts
   * {
   *  component: JSX | VueComponent
   *  props: Record<string, unknown>
   *  listeners: Record<string, Function>
   * }
   * ```
   *
   * for more details, see https://github.com/Maronato/vue-toastification#toast-content-object
   *
   * @param options Toast configuration
   *
   * For details, see: https://github.com/Maronato/vue-toastification#toast-options-object
   *
   * @returns ID of the created toast
   */
  (content: ToastContent, options?: ToastOptions & { type?: T }): ToastID
}

interface DismissToast {
  /**
   * @param toastID ID of the toast to be dismissed
   */
  (toastID: ToastID): void
}

interface ClearToasts {
  (): void
}

interface UpdateDefaults {
  /**
   * @param update Plugin options to update
   *
   * Accepts all* options provided during plugin
   * registration and updates them.
   *
   * For details, see https://github.com/Maronato/vue-toastification#updating-default-options
   */
  (update: BasePluginOptions): void
}

interface UpdateToast {
  /**
   * @param toastID ID of the toast to update
   * @param update Object that may contain the content to update, or the options to merge
   * @param create If set to false, this method only updates existing toasts and does
   * nothing if the provided `toastID` does not exist
   */
  (
    toastID: ToastID,
    update: { content?: ToastContent; options?: ToastOptions },
    create?: false
  ): void
  /**
   * @param toastID ID of the toast to create / update
   * @param update Object that must contain the toast content and may contain the options to merge
   * @param create If set to true, this method updates existing toasts or creates new toasts if
   * the provided `toastID` does not exist
   */
  (
    toastID: ToastID,
    update: { content: ToastContent; options?: ToastOptions },
    create: true
  ): void
}

export interface ToastInterface extends ToastMethod {
  /**
   * Display a success toast
   */
  success: ToastMethod<TYPE.SUCCESS>
  /**
   * Display an info toast
   */
  info: ToastMethod<TYPE.INFO>
  /**
   * Display a warning toast
   */
  warning: ToastMethod<TYPE.WARNING>
  /**
   * Display an error toast
   */
  error: ToastMethod<TYPE.ERROR>
  /**
   * Dismiss toast specified by an id
   */
  dismiss: DismissToast
  /**
   * Update Toast
   */
  update: UpdateToast
  /**
   * Clear all toasts
   */
  clear: ClearToasts
  /**
   * Update Plugin Defaults
   */
  updateDefaults: UpdateDefaults
}

/**
 * Creates and mounts the plugin app
 * @param options Plugin options passed during init
 */
function mountPlugin(options: PluginOptions) {
  const { shareAppContext, onMounted, ...basePluginOptions } = options

  const containerProps = asContainerProps(basePluginOptions)

  const app = createApp(ToastContainer, {
    ...containerProps,
  })

  if (shareAppContext && shareAppContext !== true) {
    const userApp = shareAppContext
    app._context.components = userApp._context.components
    app._context.directives = userApp._context.directives
    app._context.mixins = userApp._context.mixins
    app._context.provides = userApp._context.provides
    app.config.globalProperties = userApp.config.globalProperties
  }

  const component = app.mount(document.createElement("div"))

  if (!isUndefined(onMounted)) {
    onMounted(component, app)
  }
}

const createInterface = (events: EventBusInterface): ToastInterface => {
  const createToastMethod = <T extends TYPE = TYPE>(
    type: T
  ): ToastMethod<T> => {
    const method: ToastMethod<T> = (content, options) => {
      const props: ToastOptionsAndContent & {
        id: ToastID
      } = Object.assign({ id: getId(), type, content }, options)
      events.emit(EVENTS.ADD, props)
      return props.id
    }
    return method
  }

  const dismiss: DismissToast = toastID => events.emit(EVENTS.DISMISS, toastID)
  const clear: ClearToasts = () => events.emit(EVENTS.CLEAR, undefined)
  const updateDefaults: UpdateDefaults = update =>
    events.emit(EVENTS.UPDATE_DEFAULTS, asContainerProps(update))
  const update: UpdateToast = (toastID, update, create) => {
    const { content, options } = update
    events.emit(EVENTS.UPDATE, {
      id: toastID,
      create: create || false,
      options: { ...options, content: content as ToastContent },
    })
  }

  return Object.assign(createToastMethod<TYPE>(TYPE.DEFAULT), {
    success: createToastMethod(TYPE.SUCCESS),
    info: createToastMethod(TYPE.INFO),
    warning: createToastMethod(TYPE.WARNING),
    error: createToastMethod(TYPE.ERROR),
    dismiss,
    clear,
    update,
    updateDefaults,
  })
}

export const buildInterface = (
  globalOptions: PluginOptions = {},
  mountContainer = true
): ToastInterface => {
  const options = { ...globalOptions }
  const events = (options.eventBus = options.eventBus || new EventBus())

  if (mountContainer) {
    nextTick(() => mountPlugin(options))
  }
  return createInterface(events)
}
