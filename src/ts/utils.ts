import Vue from "vue";
import { ToastComponent, ToastContent, RenderableToastContent } from "../types";

interface DictionaryLike {
  [index: string]: unknown;
}

/**
 * ID generator
 */
export const getId = (i => () => i++)(0);

const isTouchEvent = (event: Event): event is TouchEvent =>
  event instanceof TouchEvent;

export function getX(event: MouseEvent | TouchEvent) {
  return isTouchEvent(event) ? event.targetTouches[0].clientX : event.clientX;
}

export function getY(event: MouseEvent | TouchEvent) {
  return isTouchEvent(event) ? event.targetTouches[0].clientY : event.clientY;
}

export const removeElement = (el: Element) => {
  if (typeof el.remove !== "undefined") {
    el.remove();
  } else if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
};

const isFunction = (value: unknown): value is Function =>
  typeof value === "function";

export const isString = (value: unknown): value is string =>
  typeof value === "string";

export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

export const isNonEmptyString = (value: unknown): value is string =>
  isString(value) && value.trim().length > 0;

export const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined";

export const isObject = (value: unknown): value is DictionaryLike =>
  typeof value === "object" && value !== null;

export const hasProp = <O extends unknown, K extends PropertyKey>(
  obj: O,
  propKey: K
): obj is O & { [key in K]: unknown } => isObject(obj) && propKey in obj;

const isToastComponent = (obj: unknown): obj is ToastComponent =>
  hasProp(obj, "component") && isVueComponent(obj.component);

const isJSX = (obj: unknown): obj is JSX.Element =>
  hasProp(obj, "tag") && isNonEmptyString(obj.tag);

const hasRenderFunction = <O extends unknown>(
  obj: O
): obj is O & { render: Function } =>
  hasProp(obj, "render") && isFunction(obj.render);

const isVueInstance = <O extends unknown>(
  obj: O
): obj is O & (Vue | { prototype: Vue }) =>
  obj instanceof Vue ||
  (hasProp(obj, "prototype") && obj.prototype instanceof Vue);

export const isVueComponent = (obj: unknown): obj is ToastContent =>
  // Ignore undefined
  !isUndefined(obj) &&
  // Regular Vue instances
  (isVueInstance(obj) ||
    // Object with a render function
    hasRenderFunction(obj) ||
    // JSX template
    isJSX(obj) ||
    // Nested object
    isToastComponent(obj));

export const isPositiveNumber = (value: unknown): value is number =>
  isNumber(value) && Number.isFinite(value) && value > 0;

export const isPositiveInt = (value: unknown): value is number =>
  isNumber(value) && Number.isInteger(value) && isPositiveNumber(value);

export const isIn = (value: unknown, list: Array<unknown>) =>
  list.indexOf(value) !== -1;

export const getVueComponentFromObj = (
  obj: ToastContent
): RenderableToastContent => {
  if (isToastComponent(obj)) {
    // Recurse if component prop
    return getVueComponentFromObj(obj.component);
  }
  if (isJSX(obj)) {
    // Create render function for JSX
    return {
      render() {
        return obj;
      }
    };
  }
  // Return the actual object if regular vue component
  return obj;
};
