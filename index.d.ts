import { PluginFunction, VueConstructor, Component } from 'vue';

interface CommonOptions {
  /**
   *  Position of the toast on the screen.
   * 
   *  Can be any of top-right, top-center, top-left, bottom-right, bottom-center, bottom-left.
   */ 
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  /**
   *  Position of the toast on the screen.
   * 
   *  Can be any of top-right, top-center, top-left, bottom-right, bottom-center, bottom-left.
   */ 
  draggable?: boolean;
  /**
   *  By how much of the toast width in percent (0 to 1) it must be dragged before being dismissed.
   */
  draggablePercent?: number;
  /**
   *  Whether or not the toast is paused when the window loses focus.
   */
  pauseOnFocusLoss?: boolean;
  /**
   *  Whether or not the toast is paused when it is hovered by the mouse.
   */
  pauseOnHover?: boolean;
   /**
   * 	Whether or not the toast is closed when clicked.
   */
  closeOnClick?: boolean;
  /**
   * How many milliseconds for the toast to be auto dismissed, or false to disable.
   */
  timeout?: number | false;
  /**
   * Container where the toasts are mounted.
   */
  container?: HTMLElement;
  /**
   * 	Custom classes applied to the toast.
   */
  toastClassName?: string | string[];
  /**
   * 	Custom classes applied to the body of the toast.
   */
  bodyClassName?: string | string[];
  /**
   * Whether or not the progress bar is hidden.
   */
  hideProgressBar?: boolean;
  /**
   * Whether or not the close button is hidden.
   */
  hideCloseButton?: boolean;
  /**
   * Custom icon class to be used. 
   * 
   * When set to `true`, the icon is set automatically depending on the toast type and `false` disables the icon.
   */
  icon?: boolean | string;
}

interface PluginOptions extends CommonOptions {
  /**
   *  Whether or not the newest toasts are placed on the top of the stack.
   */
  newestOnTop?: boolean;
  /**
   *  Maximum number of toasts on each stack at a time. Overflows wait until older toasts are dismissed to appear.
   */
  maxToasts?: number;
  /**
   *  Name of the Vue Transition or object with classes to use. 
   * 
   *  Only `enter-active`, `leave-active` and `move` are applied.
   */
  transition?: string | Record<'enter' | 'leave' | 'move', string>;
  /**
   * Duration of the transition. 
   * 
   * Can either be a positive integer for both enter and leave, or an object of shape `{enter: number, leave: number}`.
   */
  transitionDuration?: number | Record<'enter' | 'leave', number>;
}

export interface ToastOptions extends CommonOptions {
  /**
   *  ID of the toast.
   */
  id?: number;
  /**
   *  Type of the toast. 
   * 
   *  Can be any of `success error default info warning`
   */
  type?: 'success' | 'error' | 'default' | 'info' | 'warning';
  /**
   * 	Callback for when the toast is clicked. 
   *  A closeToast callback is passed as argument to onClick when it is called.
   */
  onClick?: (closeToast: Function) => void;
}

interface ToastContent {
  /**
   * Component that will be rendered.
   */
  component: Component<any, any, any, any> | string;
  /**
   * `propName: propValue` pairs of props that will be passed to the component. 
   * 
   * __These are not reactive__
   */
  props?: { [p: string]: any };
  /**
   * `eventName: eventHandler` pairs of events that the component can emit.
   */
  listeners?: {[p: string]: Function}
}

type ToastComponent = string | Component<any, any, any, any> | ToastContent

interface ToastModule { 
  /**
   * Display a toast
   */
  (content: ToastComponent, options?: ToastOptions): void;
  /**
   * Clear all toasts
   */
  clear: () => void;
  /**
   * Dismiss toast specified by an id
   */
  dismiss: (id: number) => void;
  /**
   * Display a success toast
   */
  success: (content: ToastComponent, options?: ToastOptions &  { type: 'success' }) => void;
  /**
   * Display an info toast
   */
  info: (content: ToastComponent, options?: ToastOptions &  { type: 'info' }) => void;
  /**
   * Display an error toast
   */
  error: (content: ToastComponent, options?: ToastOptions &  { type: 'error' }) => void;
  /**
   * Display a warning toast
   */
  warning: (content: ToastComponent, options?: ToastOptions &  { type: 'warning' }) => void;
  /**
   * update
   */
  updateDefaults: (toastOpts: PluginOptions) => void;
}

declare module 'vue/types/vue' {
  interface Vue {
    $toast: ToastModule;
  }
  
  interface VueConstructor {
    $toast: ToastModule;
  }
}

export default class Toast {
  static install: PluginFunction<never>;
}
