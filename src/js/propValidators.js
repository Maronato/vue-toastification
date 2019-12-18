import {
  isIn,
  isVueComponent,
  isPositiveInt,
  isString,
  isNonEmptyString,
  isDefined,
  isPositiveNumber
} from "./utils";
import { TYPE, POSITION, VT_NAMESPACE } from "./constants";

const COMMON = {
  type: {
    type: String,
    default: TYPE.DEFAULT,
    validator: value => isIn(value, Object.values(TYPE))
  },
  classNames: {
    type: [Array, String],
    default: () => [],
    validator: value => isString(value) || value.every(isString)
  },
  noop: {
    type: Function,
    default: () => {}
  },
  passThrough: {
    type: Function,
    default: values => values
  },
  trueBoolean: {
    type: Boolean,
    default: true
  }
};

const ICON = {
  type: COMMON.type,
  customIcon: {
    type: [String, Boolean, Object],
    default: true,
    validator: value =>
      typeof value === "boolean" ||
      isNonEmptyString(value) ||
      ["class", "children", "tag"].every(
        k => !isDefined(value[k]) || isNonEmptyString(value[k])
      )
  }
};

const PROGRESS_BAR = {
  timeout: {
    type: [Number, Boolean],
    default: 5000,
    validator: value => isPositiveInt(value) || value === false
  },
  hideProgressBar: Boolean,
  isRunning: Boolean
};

const TRANSITION = {
  transition: {
    type: [Object, String],
    default: `${VT_NAMESPACE}__bounce`,
    validator: value =>
      isNonEmptyString(value) ||
      ["enter", "leave", "move"].every(k => isNonEmptyString(value[k]))
  },
  transitionDuration: {
    type: [Number, Object],
    default: 750,
    validator: value =>
      isPositiveInt(value) ||
      ["leave", "enter"].every(k => isPositiveInt(value[k]))
  }
};

const CORE_TOAST = {
  position: {
    type: String,
    default: POSITION.TOP_RIGHT,
    validator: value => isIn(value, Object.values(POSITION))
  },
  draggable: COMMON.trueBoolean,
  draggablePercent: {
    type: Number,
    default: 0.6,
    validator: isPositiveNumber
  },
  pauseOnFocusLoss: COMMON.trueBoolean,
  pauseOnHover: COMMON.trueBoolean,
  closeOnClick: COMMON.trueBoolean,
  timeout: PROGRESS_BAR.timeout,
  hideProgressBar: PROGRESS_BAR.hideProgressBar,
  hideCloseButton: Boolean,
  toastClassName: COMMON.classNames,
  bodyClassName: COMMON.classNames,
  icon: ICON.customIcon
};

const TOAST = {
  ...CORE_TOAST,
  id: {
    type: [String, Number],
    required: true
  },
  type: COMMON.type,
  content: {
    type: [String, Object, Function],
    required: true,
    validator: value => isString(value) || isVueComponent(value)
  },
  onClick: COMMON.noop
};

const CONTAINER = {
  ...CORE_TOAST,
  ...TRANSITION,
  newestOnTop: COMMON.trueBoolean,
  maxToasts: {
    type: Number,
    default: 20,
    validator: isPositiveInt
  },
  container: {
    type: Element,
    default: () => document.body
  },
  filterBeforeCreate: COMMON.passThrough,
  filterToasts: COMMON.passThrough
};

export default {
  TOAST,
  CONTAINER,
  PROGRESS_BAR,
  ICON,
  TRANSITION
};
