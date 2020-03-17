import { mount } from "@vue/test-utils";
import VtCloseButton from "@/components/VtCloseButton.vue";
import { VT_NAMESPACE } from "@/ts/constants";
import Simple from "../../utils/components/Simple.vue";

describe("VtCloseButton", () => {
  it("matches default snapshot", () => {
    const wrapper = mount(VtCloseButton, {
      propsData: {
        component: false
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });
  it("has default class", () => {
    const wrapper = mount(VtCloseButton, {
      propsData: {
        component: false
      }
    });
    expect(wrapper.classes()).toContain(`${VT_NAMESPACE}__close-button`);
  });
  it("is a button by default", () => {
    const wrapper = mount(VtCloseButton, {
      propsData: {
        component: false
      }
    });
    expect(wrapper.is("button")).toBe(true);
  });
  it("string custom component", () => {
    const wrapper = mount(VtCloseButton, {
      propsData: {
        component: "div"
      }
    });
    expect(wrapper.is("div")).toBe(true);
  });
  it("vue custom component", () => {
    const wrapper = mount(VtCloseButton, {
      propsData: {
        component: Simple
      }
    });
    expect(wrapper.contains(Simple)).toBe(true);
  });
  it("adds 'show-on-hover' class", () => {
    const wrapper = mount(VtCloseButton, {
      propsData: {
        component: false,
        showOnHover: false
      }
    });
    const wrapper2 = mount(VtCloseButton, {
      propsData: {
        component: false,
        showOnHover: true
      }
    });
    expect(wrapper.classes()).not.toContain("show-on-hover");
    expect(wrapper2.classes()).toContain("show-on-hover");
  });
  it("adds custom class string", () => {
    const wrapper = mount(VtCloseButton, {
      propsData: {
        component: false,
        classNames: "my-class"
      }
    });
    expect(wrapper.classes()).toContain("my-class");
  });
  it("adds custom class array", () => {
    const wrapper = mount(VtCloseButton, {
      propsData: {
        component: false,
        classNames: ["my-class", "my-class2"]
      }
    });
    expect(wrapper.classes()).toContain("my-class");
    expect(wrapper.classes()).toContain("my-class2");
  });
  it("attaches onClick listener", () => {
    const onClick = jest.fn();
    const wrapper = mount(VtCloseButton, {
      propsData: {
        component: false
      },
      listeners: { click: onClick }
    });
    expect(onClick).not.toHaveBeenCalled();
    wrapper.trigger("click");
    expect(onClick).toHaveBeenCalled();
  });
});
