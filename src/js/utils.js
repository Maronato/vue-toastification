/**
 * ID generator
 */
export const getId = (i => () => i++)(0);

export function getX(e) {
  return e.targetTouches && e.targetTouches.length >= 1
    ? e.targetTouches[0].clientX
    : e.clientX;
}

export function getY(e) {
  return e.targetTouches && e.targetTouches.length >= 1
    ? e.targetTouches[0].clientY
    : e.clientY;
}

export const removeElement = el => {
  if (typeof el.remove !== "undefined") {
    el.remove();
  } else {
    el.parentNode.removeChild(el);
  }
};

const isFunction = value => typeof value === "function";

const isNonEmptyString = value => value === "string" && value.trim().length > 0;

export const isVueComponent = obj =>
  isFunction(obj) || isNonEmptyString(obj.template);

export const isPositiveInt = value => Number.isInteger(value) && value > 0;

export const isString = value => typeof value === "string";

export const isIn = (value, list) => list.indexOf(value) !== -1;
