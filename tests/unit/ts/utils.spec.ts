/* eslint-disable vue/one-component-per-file */
import { defineComponent, h, isProxy, isRef, reactive, ref } from "vue"
import {
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
  isBrowser,
  normalizeToastComponent,
} from "../../../src/ts/utils"
import Simple from "../../utils/components/Simple.vue"

describe("getId", () => {
  it("Generates 100 ids", () => {
    for (let i = 0; i < 100; i++) {
      expect(getId()).toBe(i)
    }
  })
})

describe("getX", () => {
  it("Gets X from a mouse event", () => {
    const event = new MouseEvent("event", { clientX: 10 })
    expect(getX(event)).toBe(10)
  })
  it("Gets X from a touch event", () => {
    const touch = { clientX: 10 } as Touch
    const event = new TouchEvent("event", { targetTouches: [touch] })
    expect(getX(event)).toBe(10)
  })
})

describe("getY", () => {
  it("Gets Y from a mouse event", () => {
    const event = new MouseEvent("event", { clientY: 10 })
    expect(getY(event)).toBe(10)
  })
  it("Gets Y from a touch event", () => {
    const touch = { clientY: 10 } as Touch
    const event = new TouchEvent("event", { targetTouches: [touch] })
    expect(getY(event)).toBe(10)
  })
})

describe("removeElement", () => {
  it("Calls own .remove method", () => {
    const element = document.createElement("div")
    element.remove = jest.fn()
    expect(element.remove).not.toHaveBeenCalled()
    removeElement(element)
    expect(element.remove).toHaveBeenCalled()
  })
  it("Calls parent .removeChild method", () => {
    const element = document.createElement("div")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    element.remove = undefined as any

    const parent = document.createElement("div")
    parent.appendChild(element)
    parent.removeChild = jest.fn()

    expect(parent.removeChild).not.toHaveBeenCalled()
    removeElement(element)
    expect(parent.removeChild).toHaveBeenCalledWith(element)
  })
  it("does nothing if no parent node or remove", () => {
    const element = document.createElement("div")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    element.remove = undefined as any
    expect(removeElement(element)).toBe(undefined)
  })
})

describe("isString", () => {
  it("is string", () => {
    expect(isString("")).toBe(true)
    expect(isString("abc")).toBe(true)
  })
  it("is not string", () => {
    expect(isString(false)).toBe(false)
    expect(isString({})).toBe(false)
  })
})

describe("isNonEmptyString", () => {
  it("is string and empty", () => {
    expect(isNonEmptyString("")).toBe(false)
  })
  it("is string and not empty", () => {
    expect(isNonEmptyString("value")).toBe(true)
  })
  it("is not string", () => {
    expect(isNonEmptyString(123)).toBe(false)
  })
})

describe("isToastContent", () => {
  it("is undefined", () => {
    expect(isToastContent(undefined)).toBe(false)
  })
  it("is null", () => {
    expect(isToastContent(null)).toBe(false)
  })
  it("is string", () => {
    expect(isToastContent("component")).toBe(true)
  })
  it("is defineComponent", () => {
    expect(isToastContent(defineComponent({}))).toBe(true)
  })
  it("is functional component", () => {
    expect(isToastContent(() => h("div"))).toBe(true)
  })
  it("is sfc", () => {
    expect(isToastContent(Simple)).toBe(true)
  })
  it("has render function", () => {
    expect(
      isToastContent({
        render() {
          return h("div")
        },
      })
    ).toBe(true)
  })
  it("is jsx", () => {
    const jsx = { tag: "div" } as unknown as JSX.Element
    expect(isToastContent(jsx)).toBe(true)
  })
  it("is toast component", () => {
    const component = { component: "string" }
    expect(isToastContent(component)).toBe(true)
  })
  it("is not content", () => {
    const component = 123
    expect(isToastContent(component)).toBe(false)
  })
  it("extends or has _Ctor", () => {
    expect(isToastContent({ extends: true })).toBe(true)
    expect(isToastContent({ _Ctor: true })).toBe(true)
  })
  it("has template string", () => {
    expect(isToastContent({ template: "<div>abc</div>" })).toBe(true)
  })
})

describe("getVueComponentFromObj", () => {
  it("gets string component", () => {
    const obj = "component"
    expect(getVueComponentFromObj(obj)).toBe(obj)
  })
  it("get defineComponent", () => {
    const component = defineComponent({})
    expect(getVueComponentFromObj(component)).toBe(component)
  })
  it("get non reactive object", () => {
    const component1 = reactive(defineComponent({}))
    expect(isProxy(component1)).toBe(true)
    expect(isProxy(getVueComponentFromObj(component1))).toBe(false)
    const component2 = ref(defineComponent({}))
    expect(isRef(component2)).toBe(true)
    expect(isRef(getVueComponentFromObj(component2))).toBe(false)
  })
  it("get functional component", () => {
    const component = () => h("div")
    expect(getVueComponentFromObj(component)).toBe(component)
  })
  it("get sfc", () => {
    const component = Simple
    expect(getVueComponentFromObj(component)).toBe(component)
  })
  it("get jsx with render", () => {
    const jsx = { tag: "div" } as unknown as JSX.Element
    const vueComp = getVueComponentFromObj(jsx) as { render(): JSX.Element }
    expect(vueComp.render()).toBe(jsx)
  })
  it("get toast component", () => {
    const component = { component: "my component string" }
    expect(getVueComponentFromObj(component)).toBe(component.component)
  })
})

describe("normalizeToastComponent", () => {
  it("normalizes regular string", () => {
    const component = "my component string"
    expect(normalizeToastComponent(component)).toBe(component)
  })
  it("normalizes shallow vue object", () => {
    const component = Simple
    expect(normalizeToastComponent(component)).toEqual({
      component: getVueComponentFromObj(component),
      props: {},
      listeners: {},
    })
  })
  it("normalizes composite vue object", () => {
    const component = {
      component: Simple,
      props: { myProp: "prop" },
      listeners: { myListener: () => ({}) },
    }
    expect(normalizeToastComponent(component)).toEqual(component)
  })
})

describe("hasProp", () => {
  it("gets prop from object", () => {
    const object = { myProp: 123 }
    expect(hasProp(object, "myProp")).toBe(true)
  })
  it("gets prop from function", () => {
    const func = () => ({})
    func.myProp = 123
    expect(hasProp(func, "myProp")).toBe(true)
  })
  it("missing prop on object", () => {
    const object = { myProp: 123 }
    expect(hasProp(object, "myOtherProp")).toBe(false)
  })
  it("missing prop on function", () => {
    const func = () => ({})
    expect(hasProp(func, "myProp")).toBe(false)
  })
  it("missing prop on primitive", () => {
    const primitive = "my prop"
    expect(hasProp(primitive, "myProp")).toBe(false)
  })
})

describe("isUndefined", () => {
  it("is undefined", () => {
    expect(isUndefined(undefined)).toBe(true)
  })
  it("is not undefined", () => {
    expect(isUndefined("abc")).toBe(false)
  })
})

describe("isDOMRect", () => {
  it("is dom rect", () => {
    expect(
      isDOMRect({
        width: 10,
        height: 10,
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      })
    ).toBe(true)
  })
  it("missing prop", () => {
    expect(
      isDOMRect({ width: 10, height: 10, left: 10, top: 10, bottom: 10 })
    ).toBe(false)
    expect(
      isDOMRect({ width: 10, height: 10, right: 10, top: 10, bottom: 10 })
    ).toBe(false)
    expect(
      isDOMRect({ width: 10, left: 10, right: 10, top: 10, bottom: 10 })
    ).toBe(false)
    expect(
      isDOMRect({ height: 10, left: 10, right: 10, top: 10, bottom: 10 })
    ).toBe(false)
    expect(
      isDOMRect({ width: 10, height: 10, left: 10, right: 10, top: 10 })
    ).toBe(false)
    expect(
      isDOMRect({ width: 10, height: 10, left: 10, right: 10, bottom: 10 })
    ).toBe(false)
  })
  it("prop wrong type", () => {
    expect(
      isDOMRect({
        width: 10,
        height: 10,
        left: 10,
        right: 10,
        top: 10,
        bottom: "abc",
      })
    ).toBe(false)
    expect(
      isDOMRect({
        width: 10,
        height: 10,
        left: 10,
        right: 10,
        top: "abc",
        bottom: 10,
      })
    ).toBe(false)
    expect(
      isDOMRect({
        width: 10,
        height: 10,
        left: 10,
        right: "abc",
        top: 10,
        bottom: 10,
      })
    ).toBe(false)
    expect(
      isDOMRect({
        width: 10,
        height: 10,
        left: "abc",
        right: 10,
        top: 10,
        bottom: 10,
      })
    ).toBe(false)
    expect(
      isDOMRect({
        width: 10,
        height: "abc",
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      })
    ).toBe(false)
    expect(
      isDOMRect({
        width: "abc",
        height: 10,
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      })
    ).toBe(false)
  })
  it("not an object", () => {
    const func = () => ({})
    func.height = 10
    func.width = 10
    func.left = 10
    func.right = 10
    func.top = 10
    func.bottom = 10
    expect(isDOMRect(func)).toBe(false)
  })
})

describe("isBrowser", () => {
  it("window is defined", () => {
    expect(isBrowser()).toBe(true)
  })
})
