import { PropType } from "vue";
import { TYPE, POSITION, VT_NAMESPACE } from "./constants";
import {
  ToastContent,
  CommonOptions,
  PluginOptions,
  ToastID,
  ToastOptions
} from "../types";

const COMMON = {
  type: {
    type: String as PropType<TYPE>,
    default: TYPE.DEFAULT
  },
  classNames: {
    type: [String, Array] as PropType<string | string[]>,
    default: () => []
  },
  trueBoolean: {
    type: Boolean,
    default: true
  }
};

const ICON = {
  type: COMMON.type,
  customIcon: {
    type: [String, Boolean, Object, Function] as PropType<
      NonNullable<CommonOptions["icon"]>
    >,
    default: true
  }
};

const CLOSE_BUTTON = {
  component: {
    type: [String, Object, Function, Boolean] as PropType<
      NonNullable<CommonOptions["closeButton"]>
    >,
    default: "button"
  },
  classNames: COMMON.classNames,
  showOnHover: Boolean
};

const PROGRESS_BAR = {
  timeout: {
    type: [Number, Boolean] as PropType<number | false>,
    default: 5000
  },
  hideProgressBar: Boolean,
  isRunning: Boolean
};

const TRANSITION = {
  transition: {
    type: [Object, String] as PropType<
      NonNullable<PluginOptions["transition"]>
    >,
    default: `${VT_NAMESPACE}__bounce`
  },
  transitionDuration: {
    type: [Number, Object] as PropType<
      NonNullable<PluginOptions["transitionDuration"]>
    >,
    default: 750
  }
};

const CORE_TOAST = {
  position: {
    type: String as PropType<POSITION>,
    default: POSITION.TOP_RIGHT
  },
  draggable: COMMON.trueBoolean,
  draggablePercent: {
    type: Number,
    default: 0.6
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
  showCloseButtonOnHover: CLOSE_BUTTON.showOnHover
};

const TOAST = {
  id: {
    type: [String, Number] as PropType<ToastID>,
    required: true
  },
  type: COMMON.type,
  content: {
    type: [String, Object, Function] as PropType<ToastContent>,
    required: true
  },
  onClick: Function as PropType<NonNullable<ToastOptions["onClick"]>>
};

const CONTAINER = {
  newestOnTop: COMMON.trueBoolean,
  maxToasts: {
    type: Number,
    default: 20
  },
  container: {
    type: (Element as unknown) as PropType<
      NonNullable<PluginOptions["container"]>
    >,
    default: () => document.body
  },
  filterBeforeCreate: Function as PropType<
    NonNullable<PluginOptions["filterBeforeCreate"]>
  >,
  filterToasts: Function as PropType<
    NonNullable<PluginOptions["filterToasts"]>
  >,
  containerClassName: COMMON.classNames
};

export default {
  CORE_TOAST,
  TOAST,
  CONTAINER,
  PROGRESS_BAR,
  ICON,
  TRANSITION,
  CLOSE_BUTTON
};
