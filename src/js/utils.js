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

const isNonEmptyString = value =>
  typeof value === "string" && value.trim().length > 0;

const isObject = value => typeof value === "object";

export const isVueComponent = obj =>
  isObject(obj) &&
  (isVueComponent(obj.component) ||
    (isFunction(obj.render) || isNonEmptyString(obj.tag)));

export const isPositiveInt = value => Number.isInteger(value) && value > 0;

export const isString = value => typeof value === "string";

export const isIn = (value, list) => list.indexOf(value) !== -1;

export const getVueComponentFromObj = obj => {
  if (isObject(obj.component)) {
    // Recurse if component prop
    return getVueComponentFromObj(obj.component);
  }
  if (isNonEmptyString(obj.tag)) {
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
