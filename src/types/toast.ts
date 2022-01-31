import type { Component } from "vue"

import type { TYPE, POSITION } from "../ts/constants"
import type {
  Button,
  ClassNames,
  Draggable,
  EventBusable,
  Focusable,
  Hoverable,
  Icon,
  ToastID,
} from "./common"

export declare interface BaseToastOptions
  extends EventBusable,
    Draggable,
    Hoverable,
    Focusable {
  /**
   *  Position of the toast on the screen.
   *
   *  Can be any of top-right, top-center, top-left, bottom-right, bottom-center, bottom-left.
   */
  position?: POSITION

  /**
   * 	Whether or not the toast is closed when clicked.
   */
  closeOnClick?: boolean
  /**
   * How many milliseconds for the toast to be auto dismissed, or false to disable.
   */
  timeout?: number | false
  /**
   * 	Custom classes applied to the toast.
   */
  toastClassName?: ClassNames
  /**
   * 	Custom classes applied to the body of the toast.
   */
  bodyClassName?: ClassNames
  /**
   * Whether or not the progress bar is hidden.
   */
  hideProgressBar?: boolean
  /**
   * Only shows the close button when hovering the toast
   */
  showCloseButtonOnHover?: boolean
  /**
   * Custom icon class to be used.
   *
   * When set to `true`, the icon is set automatically depending on the toast type and `false` disables the icon.
   */
  icon?: Icon
  /**
   * Custom close button component
   *
   * Alternative close button component to be displayed in toasts
   */
  closeButton?: Button
  /**
   * 	Custom classes applied to the close button of the toast.
   */
  closeButtonClassName?: ClassNames
  /**
   * Accessibility options
   */
  accessibility?: {
    /**
     * Toast accessibility role
     *
     * Accessibility option "role" for screen readers. Defaults to "alert".
     */
    toastRole?: string
    /**
     * Close button label
     *
     * Accessibility option of the closeButton's "label" for screen readers. Defaults to "close".
     */
    closeButtonLabel?: string
  }
  /**
   * Right-to-Left support.
   *
   * If true, switches the toast contents from right to left. Defaults to false.
   */
  rtl?: boolean
}

export declare interface ToastOptions extends BaseToastOptions {
  /**
   *  ID of the toast.
   */
  id?: ToastID
  /**
   *  Type of the toast.
   *
   *  Can be any of `success error default info warning`
   */
  type?: TYPE
  /**
   * 	Callback executed when the toast is clicked.
   *
   *  A closeToast callback is passed as argument to onClick when it is called.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClick?: (closeToast: Function) => void
  /**
   * 	Callback executed when the toast is closed.
   */
  onClose?: () => void
}

export declare type RenderableToastContent = string | Component

export declare interface ToastComponent {
  /**
   * Component that will be rendered.
   */
  component: ToastContent
  /**
   * `propName: propValue` pairs of props that will be passed to the component.
   *
   * __These are not reactive__
   */
  props?: { [propName: string]: unknown }
  /**
   * `eventName: eventHandler` pairs of events that the component can emit.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  listeners?: { [listenerEvent: string]: Function }
}

export declare type ToastContent =
  | RenderableToastContent
  | JSX.Element
  | ToastComponent

export declare type ToastOptionsAndContent = ToastOptions & {
  content: ToastContent
}
