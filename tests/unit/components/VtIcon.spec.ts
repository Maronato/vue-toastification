import { mount } from "@vue/test-utils";
import { TYPE, VT_NAMESPACE } from "../../../src/ts/constants";
import VtIcon from "../../../src/components/VtIcon.vue";
import VtSuccessIcon from "../../../src/components/icons/VtSuccessIcon.vue";
import VtInfoIcon from "../../../src/components/icons/VtInfoIcon.vue";
import VtWarningIcon from "../../../src/components/icons/VtWarningIcon.vue";
import VtErrorIcon from "../../../src/components/icons/VtErrorIcon.vue";
import Simple from "../../utils/components/Simple.vue";

describe("VtIcon", () => {
  describe("snapshots", () => {
    it("matches success icon", () => {
      const wrapper = mount(VtIcon, {
        propsData: {
          type: TYPE.SUCCESS,
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it("matches info icon", () => {
      const wrapper = mount(VtIcon, {
        propsData: {
          type: TYPE.INFO,
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it("matches warning icon", () => {
      const wrapper = mount(VtIcon, {
        propsData: {
          type: TYPE.WARNING,
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
    it("matches error icon", () => {
      const wrapper = mount(VtIcon, {
        propsData: {
          type: TYPE.ERROR,
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
  });
  describe("renders default icons", () => {
    it("renders success", () => {
      const wrapper = mount(VtIcon, {
        propsData: {
          type: TYPE.SUCCESS,
        },
      });
      expect(wrapper.findComponent(VtSuccessIcon).element).toBeTruthy();
      expect(wrapper.classes()).toContain(`${VT_NAMESPACE}__icon`);
    });
    it("renders info", () => {
      const wrapper = mount(VtIcon, {
        propsData: {
          type: TYPE.INFO,
        },
      });
      expect(wrapper.findComponent(VtInfoIcon).element).toBeTruthy();
      expect(wrapper.classes()).toContain(`${VT_NAMESPACE}__icon`);
    });
    it("renders warning", () => {
      const wrapper = mount(VtIcon, {
        propsData: {
          type: TYPE.WARNING,
        },
      });
      expect(wrapper.findComponent(VtWarningIcon).element).toBeTruthy();
      expect(wrapper.classes()).toContain(`${VT_NAMESPACE}__icon`);
    });
    it("renders error", () => {
      const wrapper = mount(VtIcon, {
        propsData: {
          type: TYPE.ERROR,
        },
      });
      expect(wrapper.findComponent(VtErrorIcon).element).toBeTruthy();
      expect(wrapper.classes()).toContain(`${VT_NAMESPACE}__icon`);
    });
  });
  describe("renders custom components", () => {
    it("renders regular icon if true", () => {
      const wrapper = mount(VtIcon, {
        propsData: {
          type: TYPE.SUCCESS,
          customIcon: true,
        },
      });
      expect(wrapper.findComponent(VtSuccessIcon).element).toBeTruthy();
      expect(wrapper.element).toMatchSnapshot();
    });
    it("renders string as class", () => {
      const wrapper = mount(VtIcon, {
        propsData: {
          customIcon: "myString",
        },
      });
      expect(wrapper.find("i").classes()).toContain("myString");
      expect(wrapper.element).toMatchSnapshot();
    });
    it("renders custom component as icon", () => {
      const wrapper = mount(VtIcon, {
        propsData: {
          customIcon: Simple,
        },
      });
      expect(wrapper.findComponent(Simple).element).toBeTruthy();
      expect(wrapper.findComponent(Simple).classes()).toContain(
        `${VT_NAMESPACE}__icon`
      );
      expect(wrapper.element).toMatchSnapshot();
    });
    it("renders custom icon class string", () => {
      const wrapper = mount(VtIcon, {
        propsData: {
          customIcon: { iconClass: "my-class" },
        },
      });
      expect(wrapper.find("i").element).toBeTruthy();
      expect(wrapper.find("i").classes()).toContain(`${VT_NAMESPACE}__icon`);
      expect(wrapper.find("i").classes()).toContain("my-class");
      expect(wrapper.element).toMatchSnapshot();
    });
    it("renders custom icon tag", () => {
      const wrapper = mount(VtIcon, {
        propsData: {
          customIcon: { iconClass: "my-class", iconTag: "span" },
        },
      });
      expect(wrapper.find("i").element).toBeFalsy();
      expect(wrapper.find("span").element).toBeTruthy();
      expect(wrapper.find("span").classes()).toContain("my-class");
      expect(wrapper.element).toMatchSnapshot();
    });
    it("renders custom icon children", () => {
      const wrapper = mount(VtIcon, {
        propsData: {
          customIcon: { iconClass: "my-class", iconChildren: "my child" },
        },
      });
      expect(wrapper.find("i").element).toBeTruthy();
      expect(wrapper.text()).toBe("my child");
      expect(wrapper.element).toMatchSnapshot();
    });
  });
  it("trimValue trims string", () => {
    const wrapper = mount(VtIcon);
    const vm = (wrapper.vm as unknown) as {
      trimValue(value: unknown, empty?: string): string;
    };
    const trimValue = vm.trimValue;
    expect(trimValue(" my string ")).toBe("my string");
  });
  it("trimValue does nothing to trimmed string", () => {
    const wrapper = mount(VtIcon);
    const vm = (wrapper.vm as unknown) as {
      trimValue(value: unknown, empty?: string): string;
    };
    const trimValue = vm.trimValue;
    expect(trimValue("my string")).toBe("my string");
  });
  it("trimValue returns default if empty", () => {
    const wrapper = mount(VtIcon);
    const vm = (wrapper.vm as unknown) as {
      trimValue(value: unknown, empty?: string): string;
    };
    const trimValue = vm.trimValue;
    expect(trimValue("")).toBe("");
  });
  it("trimValue returns given default if empty", () => {
    const wrapper = mount(VtIcon);
    const vm = (wrapper.vm as unknown) as {
      trimValue(value: unknown, empty?: string): string;
    };
    const trimValue = vm.trimValue;
    expect(trimValue("", "default")).toBe("default");
  });
  it("trimValue returns default if not string", () => {
    const wrapper = mount(VtIcon);
    const vm = (wrapper.vm as unknown) as {
      trimValue(value: unknown, empty?: string): string;
    };
    const trimValue = vm.trimValue;
    expect(trimValue(123)).toBe("");
  });
});
