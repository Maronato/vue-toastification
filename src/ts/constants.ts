export enum TYPE {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  DEFAULT = "default",
}

export enum POSITION {
  TOP_LEFT = "top-left",
  TOP_CENTER = "top-center",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_CENTER = "bottom-center",
  BOTTOM_RIGHT = "bottom-right",
}

export enum EVENTS {
  ADD = "add",
  DISMISS = "dismiss",
  UPDATE = "update",
  CLEAR = "clear",
  UPDATE_DEFAULTS = "update_defaults",
}

export const VT_NAMESPACE = "Vue-Toastification"
