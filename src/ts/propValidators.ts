import { PropOptions, PropType } from "vue";
import {
  ToastContent,
  CommonOptions,
  PluginOptions,
  ToastID,
  ToastOptions,
  ToastOptionsAndRequiredContent,
} from "../types";
import { TYPE, POSITION, VT_NAMESPACE } from "./constants";
import { RecordPropsDefinition } from "vue/types/options";

const COMMON = {
  type: {
    type: String,
    default: TYPE.DEFAULT,
  } as PropOptions<TYPE>,
  classNames: {
    type: [String, Array],
    default: () => [],
  } as PropOptions<string | string[]>,
  trueBoolean: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
};

const ICON = {
  type: COMMON.type,
  customIcon: {
    type: [String, Boolean, Object, Function],
    default: true,
  } as PropOptions<NonNullable<CommonOptions["icon"]>>,
};

const CLOSE_BUTTON = {
  component: {
    type: [String, Object, Function, Boolean],
    default: "button" as keyof HTMLElementTagNameMap,
  } as PropOptions<NonNullable<CommonOptions["closeButton"]>>,
  classNames: COMMON.classNames,
  showOnHover: Boolean as PropType<boolean>,
  ariaLabel: {
    type: String,
    default: "close",
  } as PropOptions<string>,
};

const PROGRESS_BAR = {
  timeout: {
    type: [Number, Boolean],
    default: 5000,
  } as PropOptions<number | false>,
  hideProgressBar: Boolean as PropType<boolean>,
  isRunning: Boolean as PropType<boolean>,
};

const TRANSITION = {
  transition: {
    type: [Object, String],
    default: `${VT_NAMESPACE}__bounce`,
  } as PropOptions<NonNullable<PluginOptions["transition"]>>,
  transitionDuration: {
    type: [Number, Object],
    default: 750,
  } as PropOptions<NonNullable<PluginOptions["transitionDuration"]>>,
};

type CommonOptionsType = Required<CommonOptions>;
const CORE_TOAST: RecordPropsDefinition<CommonOptionsType> = {
  position: {
    type: String,
    default: POSITION.TOP_RIGHT,
  } as PropOptions<POSITION>,
  draggable: COMMON.trueBoolean,
  draggablePercent: {
    type: Number,
    default: 0.6,
  } as PropOptions<number>,
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
    type: Object,
    default: () => ({
      toastRole: "alert",
      closeButtonLabel: "close",
    }),
  } as PropOptions<NonNullable<PluginOptions["accessibility"]>>,
  rtl: Boolean as PropType<boolean>,
  eventBus: Object as PropOptions<NonNullable<PluginOptions["eventBus"]>>,
};

type ToastOptionsType = Required<
  Omit<ToastOptionsAndRequiredContent, keyof CommonOptionsType>
>;
const TOAST: RecordPropsDefinition<ToastOptionsType> = {
  id: {
    type: [String, Number],
    required: true,
  } as PropOptions<ToastID>,
  type: COMMON.type,
  content: {
    type: [String, Object, Function],
    required: true,
  } as PropOptions<ToastContent>,
  onClick: Function as PropType<NonNullable<ToastOptions["onClick"]>>,
  onClose: Function as PropType<NonNullable<ToastOptions["onClose"]>>,
};

export type PluginOptionsType = Required<
  Omit<PluginOptions, keyof CommonOptionsType>
>;
const CONTAINER: RecordPropsDefinition<PluginOptionsType> = {
  container: {
    type: undefined,
    default: () => document.body,
  } as PropOptions<NonNullable<PluginOptions["container"]>>,
  newestOnTop: COMMON.trueBoolean,
  maxToasts: {
    type: Number,
    default: 20,
  } as PropOptions<number>,
  transition: TRANSITION.transition,
  transitionDuration: TRANSITION.transitionDuration,
  toastDefaults: Object as PropType<
    NonNullable<PluginOptions["toastDefaults"]>
  >,
  filterBeforeCreate: {
    type: Function,
    default: (toast: ToastOptionsAndRequiredContent) => toast,
  } as PropOptions<NonNullable<PluginOptions["filterBeforeCreate"]>>,
  filterToasts: {
    type: Function,
    default: (toasts: ToastOptionsAndRequiredContent[]) => toasts,
  } as PropOptions<NonNullable<PluginOptions["filterToasts"]>>,
  containerClassName: COMMON.classNames,
  onMounted: Function as PropType<NonNullable<PluginOptions["onMounted"]>>,
};

export default {
  CORE_TOAST,
  TOAST,
  CONTAINER,
  PROGRESS_BAR,
  ICON,
  TRANSITION,
  CLOSE_BUTTON,
};
