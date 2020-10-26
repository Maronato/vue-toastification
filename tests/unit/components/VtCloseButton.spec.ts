import { mount } from "@vue/test-utils"
import { markRaw } from "vue"
import VtCloseButton from "../../../src/components/VtCloseButton.vue"
import { VT_NAMESPACE } from "../../../src/ts/constants"
import Simple from "../../utils/components/Simple.vue"

describe("VtCloseButton", () => {
  it("matches default snapshot", () => {
    const wrapper = mount(VtCloseButton, {
      props: {
        component: false,
      },
    })
    expect(wrapper.element).toMatchSnapshot()
  })
  it("has default class", () => {
    const wrapper = mount(VtCloseButton, {
      props: {
        component: false,
      },
    })
    expect(wrapper.classes()).toContain(`${VT_NAMESPACE}__close-button`)
  })
  it("is a button by default", () => {
    const wrapper = mount(VtCloseButton, {
      props: {
        component: false,
      },
    })
    expect(wrapper.element.tagName).toEqual("BUTTON")
  })
  it("string custom component", () => {
    const wrapper = mount(VtCloseButton, {
      props: {
        component: "div",
      },
    })
    expect(wrapper.element.tagName).toEqual("DIV")
    expect(wrapper.element).toMatchSnapshot()
  })
  it("vue custom component", () => {
    const wrapper = mount(VtCloseButton, {
      props: {
        component: markRaw(Simple),
      },
    })
    expect(wrapper.findComponent(Simple).element).toBeTruthy()
    expect(wrapper.element).toMatchSnapshot()
  })
  it("adds 'show-on-hover' class", () => {
    const wrapper = mount(VtCloseButton, {
      props: {
        component: false,
        showOnHover: false,
      },
    })
    const wrapper2 = mount(VtCloseButton, {
      props: {
        component: false,
        showOnHover: true,
      },
    })
    expect(wrapper.classes()).not.toContain("show-on-hover")
    expect(wrapper2.classes()).toContain("show-on-hover")
    expect(wrapper.element).toMatchSnapshot()
    expect(wrapper2.element).toMatchSnapshot()
  })
  it("adds custom class string", () => {
    const wrapper = mount(VtCloseButton, {
      props: {
        component: false,
        classNames: "my-class",
      },
    })
    expect(wrapper.classes()).toContain("my-class")
    expect(wrapper.element).toMatchSnapshot()
  })
  it("adds custom class array", () => {
    const wrapper = mount(VtCloseButton, {
      props: {
        component: false,
        classNames: ["my-class", "my-class2"],
      },
    })
    expect(wrapper.classes()).toContain("my-class")
    expect(wrapper.classes()).toContain("my-class2")
    expect(wrapper.element).toMatchSnapshot()
  })
  it("attaches onClick listener", () => {
    const onClick = jest.fn()
    const wrapper = mount(VtCloseButton, {
      props: {
        component: false,
      },
      attrs: { onClick },
    })
    expect(onClick).not.toHaveBeenCalled()
    wrapper.trigger("click")
    expect(onClick).toHaveBeenCalled()
  })
  it("renders default aria label", () => {
    const wrapper = mount(VtCloseButton)
    expect(wrapper.find("button[aria-label='close']").exists()).toBe(true)
    expect(wrapper.element).toMatchSnapshot()
  })
  it("renders custom aria label", () => {
    const wrapper = mount(VtCloseButton, {
      props: {
        ariaLabel: "text",
      },
    })
    expect(wrapper.find("button[aria-label='text']").exists()).toBe(true)
    expect(wrapper.element).toMatchSnapshot()
  })
})
