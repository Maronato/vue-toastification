import { mount } from "@vue/test-utils";
import VtTransition from "../../../src/components/VtTransition.vue";

describe("VtTransition", () => {
  it("snapshots default values", () => {
    const wrapper = mount(VtTransition);
    expect(wrapper.element).toMatchSnapshot();
  });
  it("transition-group has default classes", () => {
    const wrapper = mount(VtTransition);
    const transition = wrapper.vm.$props.transition as string;
    const componentProps = wrapper.vm.$children[0].$props;
    expect(componentProps.enterActiveClass).toBe(`${transition}-enter-active`);
    expect(componentProps.moveClass).toBe(`${transition}-move`);
    expect(componentProps.leaveActiveClass).toBe(`${transition}-leave-active`);
  });
  it("transition-group has custom classes", () => {
    const wrapper = mount(VtTransition, {
      propsData: {
        transition: {
          enter: "enter-transition",
          move: "move-transition",
          leave: "leave-transition"
        }
      }
    });
    const componentProps = wrapper.vm.$children[0].$props;
    expect(componentProps.enterActiveClass).toBe("enter-transition");
    expect(componentProps.moveClass).toBe("move-transition");
    expect(componentProps.leaveActiveClass).toBe("leave-transition");
    expect(wrapper.element).toMatchSnapshot();
  });
  it("beforeEnter with default values", () => {
    const wrapper = mount(VtTransition);
    const vm = wrapper.vm as { beforeEnter(el: HTMLElement): void };
    const beforeEnter = vm.beforeEnter;
    const el = document.createElement("div");
    expect(wrapper.emitted("before-enter")).toBeFalsy();
    beforeEnter(el);
    expect(el.style.animationDuration).toBe(
      `${wrapper.vm.$props.transitionDuration}ms`
    );
    expect(wrapper.emitted("before-enter")[0]).toEqual([el]);
  });
  it("beforeEnter with custom duration", () => {
    const wrapper = mount(VtTransition, {
      propsData: {
        transitionDuration: { enter: 100 }
      }
    });
    const vm = wrapper.vm as { beforeEnter(el: HTMLElement): void };
    const beforeEnter = vm.beforeEnter;
    const el = document.createElement("div");
    expect(wrapper.emitted("before-enter")).toBeFalsy();
    beforeEnter(el);
    expect(el.style.animationDuration).toBe("100ms");
    expect(wrapper.emitted("before-enter")[0]).toEqual([el]);
  });
  it("cleanUpStyles", () => {
    const wrapper = mount(VtTransition);
    const vm = wrapper.vm as { cleanUpStyles(el: HTMLElement): void };
    const cleanUpStyles = vm.cleanUpStyles;
    const el = document.createElement("div");
    el.style.animationFillMode = "abc";
    el.style.animationDuration = "10ms";
    cleanUpStyles(el);
    expect(el.style.animationDuration).toBe("");
    expect(el.style.animationFillMode).toBe("");
  });
  it("setAbsolutePosition", () => {
    const wrapper = mount(VtTransition);
    const vm = wrapper.vm as { setAbsolutePosition(el: HTMLElement): void };
    const setAbsolutePosition = vm.setAbsolutePosition;
    const el = document.createElement("div");
    setAbsolutePosition(el);
    expect(el.style.left).toBe(el.offsetLeft + "px");
    expect(el.style.top).toBe(el.offsetTop + "px");
    expect(el.style.width).toBe(el.offsetWidth + "px");
    expect(el.style.position).toBe("absolute");
  });
  it("afterEnter", () => {
    const wrapper = mount(VtTransition);
    const vm = wrapper.vm as { afterEnter(el: HTMLElement): void };
    const afterEnter = vm.afterEnter;
    const el = document.createElement("div");
    el.style.animationFillMode = "abc";
    el.style.animationDuration = "10ms";
    afterEnter(el);
    expect(el.style.animationDuration).toBe("");
    expect(el.style.animationFillMode).toBe("");
    expect(wrapper.emitted("after-enter")[0]).toEqual([el]);
  });
  it("afterLeave", () => {
    const wrapper = mount(VtTransition);
    const vm = wrapper.vm as { afterLeave(el: HTMLElement): void };
    const afterLeave = vm.afterLeave;
    const el = document.createElement("div");
    el.style.animationFillMode = "abc";
    el.style.animationDuration = "10ms";
    afterLeave(el);
    expect(el.style.animationDuration).toBe("");
    expect(el.style.animationFillMode).toBe("");
    expect(wrapper.emitted("after-leave")[0]).toEqual([el]);
  });
  it("leave", () => {
    const wrapper = mount(VtTransition);
    const vm = wrapper.vm as { leave(el: HTMLElement, done: Function): void };
    const done = jest.fn();
    const leave = vm.leave;
    const el = document.createElement("div");
    leave(el, done);
    expect(el.style.left).toBe(el.offsetLeft + "px");
    expect(el.style.top).toBe(el.offsetTop + "px");
    expect(el.style.position).toBe("absolute");
    expect(wrapper.emitted("leave")[0]).toEqual([el, done]);
  });
  it("beforeLeave with default values", () => {
    const wrapper = mount(VtTransition);
    const vm = wrapper.vm as { beforeLeave(el: HTMLElement): void };
    const beforeLeave = vm.beforeLeave;
    const el = document.createElement("div");
    expect(wrapper.emitted("before-leave")).toBeFalsy();
    beforeLeave(el);
    expect(el.style.animationDuration).toBe(
      `${wrapper.vm.$props.transitionDuration}ms`
    );
    expect(wrapper.emitted("before-leave")[0]).toEqual([el]);
  });
  it("beforeLeave with custom duration", () => {
    const wrapper = mount(VtTransition, {
      propsData: {
        transitionDuration: { leave: 100 }
      }
    });
    const vm = wrapper.vm as { beforeLeave(el: HTMLElement): void };
    const beforeLeave = vm.beforeLeave;
    const el = document.createElement("div");
    expect(wrapper.emitted("before-leave")).toBeFalsy();
    beforeLeave(el);
    expect(el.style.animationDuration).toBe("100ms");
    expect(wrapper.emitted("before-leave")[0]).toEqual([el]);
  });
});
