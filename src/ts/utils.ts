import { Component, defineComponent, toRaw, unref } from "vue"
import type {
  ToastComponent,
  ToastContent,
  RenderableToastContent,
} from "../types"

interface DictionaryLike {
  [index: string]: unknown
}

// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = (value: unknown): value is Function =>
  typeof value === "function"

const isString = (value: unknown): value is string => typeof value === "string"

const isNonEmptyString = (value: unknown): value is string =>
  isString(value) && value.trim().length > 0

const isNumber = (value: unknown): value is number => typeof value === "number"

const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined"

const isObject = (value: unknown): value is DictionaryLike =>
  typeof value === "object" && value !== null

const isJSX = (obj: unknown): obj is JSX.Element =>
  hasProp(obj, "tag") && isNonEmptyString(obj.tag)

const isTouchEvent = (event: Event): event is TouchEvent =>
  window.TouchEvent && event instanceof TouchEvent

const isToastComponent = (obj: unknown): obj is ToastComponent =>
  hasProp(obj, "component") && isToastContent(obj.component)

const isVueComponent = (c: unknown): c is Component =>
  isFunction(c) || isObject(c)

const isToastContent = (obj: unknown): obj is ToastContent =>
  // Ignore undefined
  !isUndefined(obj) &&
  // Is a string
  (isString(obj) ||
    // Regular Vue component
    isVueComponent(obj) ||
    // Nested object
    isToastComponent(obj))

const isDOMRect = (obj: unknown): obj is DOMRect =>
  isObject(obj) &&
  ["height", "width", "right", "left", "top", "bottom"].every(p =>
    isNumber(obj[p])
  )

const hasProp = <O, K extends PropertyKey>(
  obj: O,
  propKey: K
): obj is O & { [key in K]: unknown } =>
  (isObject(obj) || isFunction(obj)) && propKey in obj

/**
 * ID generator
 */
const getId = (
  i => () =>
    i++
)(0)

function getX(event: MouseEvent | TouchEvent) {
  return isTouchEvent(event) ? event.targetTouches[0].clientX : event.clientX
}

function getY(event: MouseEvent | TouchEvent) {
  return isTouchEvent(event) ? event.targetTouches[0].clientY : event.clientY
}

const removeElement = (el: Element) => {
  if (!isUndefined(el.remove)) {
    el.remove()
  } else if (el.parentNode) {
    el.parentNode.removeChild(el)
  }
}

const getVueComponentFromObj = (obj: ToastContent): RenderableToastContent => {
  if (isToastComponent(obj)) {
    // Recurse if component prop
    return getVueComponentFromObj(obj.component)
  }
  if (isJSX(obj)) {
    // Create render function for JSX
    return defineComponent({
      render() {
        return obj
      },
    })
  }
  // Return regular string or raw object
  return typeof obj === "string" ? obj : toRaw(unref(obj))
}

const normalizeToastComponent = (obj: ToastContent): ToastContent => {
  if (typeof obj === "string") {
    return obj
  }
  const props = hasProp(obj, "props") && isObject(obj.props) ? obj.props : {}
  const listeners = (
    hasProp(obj, "listeners") && isObject(obj.listeners) ? obj.listeners : {}
  ) as ToastComponent["listeners"]
  return { component: getVueComponentFromObj(obj), props, listeners }
}

const isBrowser = () => typeof window !== "undefined"

export {
  getId,
  getX,
  getY,
  removeElement,
  isString,
  isNonEmptyString,
  isToastContent,
  getVueComponentFromObj,
  normalizeToastComponent,
  hasProp,
  isUndefined,
  isDOMRect,
  isFunction,
  isBrowser,
}
