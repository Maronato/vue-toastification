import Vue, { Component } from "vue";
import { ToastComponent, ToastContent, RenderableToastContent } from "../types";

interface DictionaryLike {
  [index: string]: unknown;
}

/**
 * Utility type to declare an extended Vue constructor
 */
type VueClass<V extends Vue> = (new (...args: unknown[]) => V) & typeof Vue;

// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = (value: unknown): value is Function =>
  typeof value === "function";

const isString = (value: unknown): value is string => typeof value === "string";

const isNonEmptyString = (value: unknown): value is string =>
  isString(value) && value.trim().length > 0;

const isNumber = (value: unknown): value is number => typeof value === "number";

const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined";

const isObject = (value: unknown): value is DictionaryLike =>
  typeof value === "object" && value !== null;

const isJSX = (obj: unknown): obj is JSX.Element =>
  hasProp(obj, "tag") && isNonEmptyString(obj.tag);

const isTouchEvent = (event: Event): event is TouchEvent =>
  window.TouchEvent && event instanceof TouchEvent;

const isToastComponent = (obj: unknown): obj is ToastComponent =>
  hasProp(obj, "component") && isToastContent(obj.component);

const isConstructor = (c: unknown): c is VueClass<Vue> => {
  return isFunction(c) && hasProp(c, "cid");
};

const isVueComponent = (c: unknown): c is Component => {
  if (isConstructor(c)) {
    return true;
  }
  if (!isObject(c)) {
    return false;
  }
  if (c.extends || c._Ctor) {
    return true;
  }
  if (isString(c.template)) {
    return true;
  }
  return hasRenderFunction(c);
};

const isVueInstanceOrComponent = <O extends unknown>(
  obj: O
): obj is O & Component => obj instanceof Vue || isVueComponent(obj);

const isToastContent = (obj: unknown): obj is ToastContent =>
  // Ignore undefined
  !isUndefined(obj) &&
  // Is a string
  (isString(obj) ||
    // Regular Vue instance or component
    isVueInstanceOrComponent(obj) ||
    // Object with a render function
    hasRenderFunction(obj) ||
    // JSX template
    isJSX(obj) ||
    // Nested object
    isToastComponent(obj));

const isDOMRect = (obj: unknown): obj is DOMRect =>
  isObject(obj) &&
  isNumber(obj.height) &&
  isNumber(obj.width) &&
  isNumber(obj.right) &&
  isNumber(obj.left) &&
  isNumber(obj.top) &&
  isNumber(obj.bottom);

const hasProp = <O extends unknown, K extends PropertyKey>(
  obj: O,
  propKey: K
): obj is O & { [key in K]: unknown } =>
  Object.prototype.hasOwnProperty.call(obj, propKey);

const hasRenderFunction = <O extends unknown>(
  obj: O
  // eslint-disable-next-line @typescript-eslint/ban-types
): obj is O & { render: Function } =>
  hasProp(obj, "render") && isFunction(obj.render);

/**
 * ID generator
 */
const getId = ((i) => () => i++)(0);

function getX(event: MouseEvent | TouchEvent) {
  return isTouchEvent(event) ? event.targetTouches[0].clientX : event.clientX;
}

function getY(event: MouseEvent | TouchEvent) {
  return isTouchEvent(event) ? event.targetTouches[0].clientY : event.clientY;
}

const removeElement = (el: Element) => {
  if (!isUndefined(el.remove)) {
    el.remove();
  } else if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
};

const getVueComponentFromObj = (obj: ToastContent): RenderableToastContent => {
  if (isToastComponent(obj)) {
    // Recurse if component prop
    return getVueComponentFromObj(obj.component);
  }
  if (isJSX(obj)) {
    // Create render function for JSX
    return {
      render() {
        return obj;
      },
    };
  }
  // Return the actual object if regular vue component
  return obj;
};

export {
  getId,
  getX,
  getY,
  removeElement,
  isString,
  isNonEmptyString,
  isToastContent,
  getVueComponentFromObj,
  hasProp,
  isUndefined,
  isDOMRect,
  isFunction,
};
