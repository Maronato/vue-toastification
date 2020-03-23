// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue, { Component } from "vue";
import ToastInterface from "../ts/interface";
import { TYPE, POSITION } from "../ts/constants";
import { CombinedVueInstance } from "vue/types/vue";

export type ToastID = string | number;

export interface CommonOptions {
  /**
   *  Position of the toast on the screen.
   *
   *  Can be any of top-right, top-center, top-left, bottom-right, bottom-center, bottom-left.
   */
  position?: POSITION;
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
   * Only shows the close button when hovering the toast
   */
  showCloseButtonOnHover?: boolean;
  /**
   * Custom icon class to be used.
   *
   * When set to `true`, the icon is set automatically depending on the toast type and `false` disables the icon.
   */
  icon?:
    | boolean
    | string
    | {
        iconTag?: keyof HTMLElementTagNameMap;
        iconChildren?: string;
        iconClass?: string;
      }
    | Component
    | JSX.Element;
  /**
   * Custom close button component
   *
   * Alternative close button component to be displayed in toasts
   */
  closeButton?: false | keyof HTMLElementTagNameMap | Component | JSX.Element;
  /**
   * 	Custom classes applied to the close button of the toast.
   */
  closeButtonClassName?: string | string[];
}

export type ToastTypeDefaults = {
  [key in TYPE]?: ToastOptions;
};

export interface PluginOptions extends CommonOptions {
  /**
   * Container where the toasts are mounted.
   */
  container?: HTMLElement;
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
  transition?: string | Record<"enter" | "leave" | "move", string>;
  /**
   * Duration of the transition.
   *
   * Can either be a positive integer for both enter and leave, or an object of shape `{enter: number, leave: number}`.
   */
  transitionDuration?: number | Record<"enter" | "leave", number>;
  /**
   *  Toast's defaults object for configuring default toast options for each toast type.
   *
   *  Possible object properties can be any of `success error default info warning`
   */
  toastDefaults?: ToastTypeDefaults;
  /**
   * Callback to filter toasts during creation
   *
   * Takes the new toast and a list of the current toasts and returns a modified toast or false.
   */
  filterBeforeCreate?: (
    toast: ToastOptionsAndRequiredContent,
    toasts: ToastOptionsAndRequiredContent[]
  ) => ToastOptionsAndRequiredContent | false;
  /**
   * Callback to filter toasts during render
   *
   * Filter toasts during render and queues filtered toasts.
   */
  filterToasts?: (
    toasts: ToastOptionsAndRequiredContent[]
  ) => ToastOptionsAndRequiredContent[];
  /**
   * Extra CSS class or classes added to each of the Toast containers.
   *
   * Keep in mind that there is one container for each possible toast position.
   */
  containerClassName?: string | string[];
  /**
   * Callback executed when the toast container is mounted.
   *
   * Receives the Container vue instance as a parameter.
   */
  onMounted?: (
    containerComponent: CombinedVueInstance<
      Record<never, unknown> & Vue,
      object,
      object,
      object,
      Record<never, unknown>
    >
  ) => void;
}

export interface ToastOptions extends CommonOptions {
  /**
   *  ID of the toast.
   */
  id?: ToastID;
  /**
   *  Type of the toast.
   *
   *  Can be any of `success error default info warning`
   */
  type?: TYPE;
  /**
   * 	Callback executed when the toast is clicked.
   *
   *  A closeToast callback is passed as argument to onClick when it is called.
   */
  onClick?: (closeToast: Function) => void;
  /**
   * 	Callback executed when the toast is closed.
   */
  onClose?: () => void;
}

export type RenderableToastContent = string | Component;

export interface ToastComponent {
  /**
   * Component that will be rendered.
   */
  component: ToastContent;
  /**
   * `propName: propValue` pairs of props that will be passed to the component.
   *
   * __These are not reactive__
   */
  props?: { [propName: string]: unknown };
  /**
   * `eventName: eventHandler` pairs of events that the component can emit.
   */
  listeners?: { [listenerEvent: string]: Function };
}

export type ToastContent =
  | RenderableToastContent
  | JSX.Element
  | ToastComponent;

export type ToastOptionsAndContent = ToastOptions & { content?: ToastContent };
export type ToastOptionsAndRequiredContent = ToastOptions & {
  content: ToastContent;
};

export interface NuxtModuleOptions extends PluginOptions {
  /**
   * Path to the CSS file containing styles for the toasts.
   * By default it is original Vue Toastification CSS file.
   *
   * If set to false, no CSS file is injected.
   */
  cssFile?: string | false;
}

declare module "vue/types/vue" {
  interface Vue {
    $toast: ReturnType<typeof ToastInterface>;
  }

  interface VueConstructor {
    $toast: ReturnType<typeof ToastInterface>;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $toast: ReturnType<typeof ToastInterface>;
  }
}

declare module "vuex/types/index" {
  interface Store<S> {
    $toast: ReturnType<typeof ToastInterface>;
  }
}
