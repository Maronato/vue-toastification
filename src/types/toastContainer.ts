import type { TYPE } from "../ts/constants"
import type { ClassNames, EventBusable } from "./common"
import type {
  BaseToastOptions,
  ToastOptions,
  ToastOptionsAndContent,
} from "./toast"

type ContainerCallback = () => HTMLElement | Promise<HTMLElement>

export declare interface BaseToastContainerOptions extends EventBusable {
  position?: BaseToastOptions["position"]
  /**
   * Container where the toasts are mounted.
   */
  container?: HTMLElement | ContainerCallback
  /**
   *  Whether or not the newest toasts are placed on the top of the stack.
   */
  newestOnTop?: boolean
  /**
   *  Maximum number of toasts on each stack at a time. Overflows wait until older toasts are dismissed to appear.
   */
  maxToasts?: number
  /**
   *  Name of the Vue Transition or object with classes to use.
   *
   *  Only `enter-active`, `leave-active` and `move` are applied.
   */
  transition?: string | Record<"enter" | "leave" | "move", string>
  /**
   *  Toast's defaults object for configuring default toast options for each toast type.
   *
   *  Possible object properties can be any of `success error default info warning`
   */
  toastDefaults?: Partial<Record<TYPE, ToastOptions>>
  /**
   * Callback to filter toasts during creation
   *
   * Takes the new toast and a list of the current toasts and returns a modified toast or false.
   */
  filterBeforeCreate?: (
    toast: ToastOptionsAndContent,
    toasts: ToastOptionsAndContent[]
  ) => ToastOptionsAndContent | false
  /**
   * Callback to filter toasts during render
   *
   * Filter toasts during render and queues filtered toasts.
   */
  filterToasts?: (toasts: ToastOptionsAndContent[]) => ToastOptionsAndContent[]
  /**
   * Extra CSS class or classes added to each of the Toast containers.
   *
   * Keep in mind that there is one container for each possible toast position.
   */
  containerClassName?: ClassNames
}

export declare interface ToastContainerOptions
  extends BaseToastContainerOptions {
  defaultToastProps?: BaseToastOptions
}
