/* eslint-disable @typescript-eslint/no-empty-function */
import type { PropType, ComponentObjectPropsOptions } from "vue"
import { EventBus } from "./eventBus"
import type {
  ToastContent,
  CommonOptions,
  PluginOptions,
  ToastID,
  ToastOptions,
  ToastOptionsAndRequiredContent,
} from "../types"
import { TYPE, POSITION, VT_NAMESPACE } from "./constants"

const COMMON = {
  type: {
    type: String as PropType<TYPE>,
    default: TYPE.DEFAULT,
  },
  classNames: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => [],
  },
  trueBoolean: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
}

const ICON = {
  type: COMMON.type,
  customIcon: {
    type: [String, Boolean, Object, Function] as PropType<
      NonNullable<CommonOptions["icon"]>
    >,
    default: true,
  },
}

const CLOSE_BUTTON = {
  component: {
    type: [String, Object, Function, Boolean] as PropType<
      NonNullable<CommonOptions["closeButton"]>
    >,
    default: "button" as keyof HTMLElementTagNameMap,
  },
  classNames: COMMON.classNames,
  showOnHover: {
    type: Boolean,
    default: false,
  },
  ariaLabel: {
    type: String as PropType<string>,
    default: "close",
  },
}

const PROGRESS_BAR = {
  timeout: {
    type: [Number, Boolean] as PropType<number | false>,
    default: 5000,
  },
  hideProgressBar: {
    type: Boolean,
    default: false,
  },
  isRunning: {
    type: Boolean,
    default: false,
  },
}

const TRANSITION = {
  transition: {
    type: [Object, String] as PropType<
      NonNullable<PluginOptions["transition"]>
    >,
    default: `${VT_NAMESPACE}__bounce`,
  },
}

type CommonOptionsType = Required<CommonOptions>
const CORE_TOAST = {
  position: {
    type: String as PropType<POSITION>,
    default: POSITION.TOP_RIGHT,
  },
  draggable: COMMON.trueBoolean,
  draggablePercent: {
    type: Number as PropType<number>,
    default: 0.6,
  },
  pauseOnFocusLoss: COMMON.trueBoolean,
  pauseOnHover: COMMON.trueBoolean,
  closeOnClick: COMMON.trueBoolean,
  timeout: PROGRESS_BAR.timeout,
  hideProgressBar: PROGRESS_BAR.hideProgressBar,
  toastClassName: COMMON.classNames,
  bodyClassName: COMMON.classNames,
  icon: ICON.customIcon,
  closeButton: CLOSE_BUTTON.component,
  closeButtonClassName: CLOSE_BUTTON.classNames,
  showCloseButtonOnHover: CLOSE_BUTTON.showOnHover,
  accessibility: {
    type: Object as PropType<NonNullable<PluginOptions["accessibility"]>>,
    default: () => ({
      toastRole: "alert",
      closeButtonLabel: "close",
    }),
  },
  rtl: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  eventBus: {
    type: Object as PropType<NonNullable<PluginOptions["eventBus"]>>,
    required: false,
    default: () => new EventBus(),
  },
}

const TOAST = {
  id: {
    type: [String, Number] as PropType<ToastID>,
    required: true,
    default: 0,
  },
  type: COMMON.type,
  content: {
    type: [String, Object, Function] as PropType<ToastContent>,
    required: true,
    default: "",
  },
  onClick: {
    type: Function as PropType<ToastOptions["onClick"]>,
    default: undefined,
  },
  onClose: {
    type: Function as PropType<ToastOptions["onClose"]>,
    default: undefined,
  },
}

export type PluginOptionsType = Required<
  Omit<PluginOptions, keyof CommonOptionsType>
>
const CONTAINER: ComponentObjectPropsOptions<PluginOptionsType> = {
  container: {
    type: [
      Object as unknown as PluginOptions["container"],
      Function,
    ] as PropType<NonNullable<PluginOptions["container"]>>,
    default: () => document.body,
  },
  newestOnTop: COMMON.trueBoolean,
  maxToasts: {
    type: Number as PropType<number>,
    default: 20,
  },
  transition: TRANSITION.transition,
  toastDefaults: Object as PropType<
    NonNullable<PluginOptions["toastDefaults"]>
  >,
  filterBeforeCreate: {
    type: Function as PropType<
      NonNullable<PluginOptions["filterBeforeCreate"]>
    >,
    default: (toast: ToastOptionsAndRequiredContent) => toast,
  },
  filterToasts: {
    type: Function as PropType<NonNullable<PluginOptions["filterToasts"]>>,
    default: (toasts: ToastOptionsAndRequiredContent[]) => toasts,
  },
  containerClassName: COMMON.classNames,
  onMounted: Function as PropType<NonNullable<PluginOptions["onMounted"]>>,
  shareAppContext: [Boolean, Object] as PropType<
    NonNullable<PluginOptions["shareAppContext"]>
  >,
}

export default {
  CORE_TOAST,
  TOAST,
  CONTAINER,
  PROGRESS_BAR,
  ICON,
  TRANSITION,
  CLOSE_BUTTON,
}
