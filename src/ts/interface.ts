import { createApp, nextTick } from "vue"
import { EventBus, EventBusInterface } from "./eventBus"
import ToastContainer from "../components/VtToastContainer.vue"
import {
  ToastContent,
  ToastOptions,
  ToastID,
  PluginOptions,
  ToastOptionsAndRequiredContent,
} from "../types"
import { TYPE, EVENTS } from "./constants"
import { getId, isUndefined } from "./utils"
import { eventBusPlugin } from "./composables/useEventBus"

/**
 * Display a toast
 */
interface ToastMethod<T extends TYPE = TYPE> {
  (content: ToastContent, options?: ToastOptions & { type?: T }): ToastID
}

interface DismissToast {
  (toastID: ToastID): void
}

interface ClearToasts {
  (): void
}

interface UpdateDefaults {
  (update: PluginOptions): void
}

interface UpdateToast {
  (
    toastID: ToastID,
    update: { content?: ToastContent; options?: ToastOptions },
    create?: false
  ): void
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
  const { shareAppContext, eventBus, onMounted, ...containerOptions } = options

  const app = createApp(ToastContainer, {
    ...containerOptions,
  })

  if (shareAppContext && shareAppContext !== true) {
    const userApp = shareAppContext
    app._context.components = userApp._context.components
    app._context.directives = userApp._context.directives
    app._context.mixins = userApp._context.mixins
    app._context.provides = userApp._context.provides
    app.config.globalProperties = userApp.config.globalProperties
  }

  app.use(eventBusPlugin, eventBus)

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
      const props: ToastOptionsAndRequiredContent & {
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
    events.emit(EVENTS.UPDATE_DEFAULTS, update)
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
  const events = (globalOptions.eventBus =
    globalOptions.eventBus || new EventBus())

  if (mountContainer) {
    nextTick(() => mountPlugin(globalOptions))
  }
  return createInterface(events)
}
