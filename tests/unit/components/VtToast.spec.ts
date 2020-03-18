import { mount, createLocalVue, createWrapper } from "@vue/test-utils";
import VtToast from "../../../src/components/VtToast.vue";
import VtIcon from "../../../src/components/VtIcon.vue";
import VtProgressBar from "../../../src/components/VtProgressBar.vue";
import VtCloseButton from "../../../src/components/VtCloseButton.vue";
import { ToastOptionsAndContent } from "../../../src/types";
import events from "../../../src/ts/events";
import {
  VT_NAMESPACE,
  TYPE,
  POSITION,
  EVENTS
} from "../../../src/ts/constants";
import Simple from "../../utils/components/Simple.vue";

const mountToast = ({ id, content, ...props }: ToastOptionsAndContent = {}) =>
  mount(VtToast, {
    propsData: {
      id: id || 1,
      content: content || "content",
      ...props
    }
  });

describe("VtToast", () => {
  const eventsEmmited = Object.values(EVENTS).reduce((agg, eventName) => {
    const handler = jest.fn();
    events.$on(eventName, handler);
    return { ...agg, [eventName]: handler };
  }, {} as { [eventName in EVENTS]: jest.Mock });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("snapshots", () => {
    it("renders", () => {
      const wrapper = mountToast();
      expect(wrapper.element).toMatchSnapshot();
    });
  });
  describe("ui", () => {
    it("has all default sub components", () => {
      const wrapper = mountToast({ content: "content" });
      expect(wrapper.find(`div.${VT_NAMESPACE}__toast-body`).text()).toEqual(
        "content"
      );
      expect(wrapper.contains(VtIcon)).toBe(true);
      expect(wrapper.contains(VtCloseButton)).toBe(true);
      expect(wrapper.contains(VtProgressBar)).toBe(true);
      expect(wrapper.element).toMatchSnapshot();
    });
    it("closeButton = false removes it", () => {
      const wrapper = mountToast({ content: "content", closeButton: false });
      expect(wrapper.find(`div.${VT_NAMESPACE}__toast-body`).text()).toEqual(
        "content"
      );
      expect(wrapper.contains(VtIcon)).toBe(true);
      expect(wrapper.contains(VtCloseButton)).toBe(false);
      expect(wrapper.contains(VtProgressBar)).toBe(true);
      expect(wrapper.element).toMatchSnapshot();
    });
    it("icon = false removes it", () => {
      const wrapper = mountToast({ content: "content", icon: false });
      expect(wrapper.find(`div.${VT_NAMESPACE}__toast-body`).text()).toEqual(
        "content"
      );
      expect(wrapper.contains(VtIcon)).toBe(false);
      expect(wrapper.contains(VtCloseButton)).toBe(true);
      expect(wrapper.contains(VtProgressBar)).toBe(true);
      expect(wrapper.element).toMatchSnapshot();
    });
    it("timeout = false removes progress bar", () => {
      const wrapper = mountToast({ content: "content", timeout: false });
      expect(wrapper.find(`div.${VT_NAMESPACE}__toast-body`).text()).toEqual(
        "content"
      );
      expect(wrapper.contains(VtIcon)).toBe(true);
      expect(wrapper.contains(VtCloseButton)).toBe(true);
      expect(wrapper.contains(VtProgressBar)).toBe(false);
      expect(wrapper.element).toMatchSnapshot();
    });
    it("renders custom component", () => {
      const wrapper = mountToast({ content: Simple });
      expect(
        wrapper.find(`div.${VT_NAMESPACE}__toast-component-body`).exists()
      ).toBe(true);
      expect(wrapper.contains(Simple)).toBe(true);
      expect(wrapper.contains(VtIcon)).toBe(true);
      expect(wrapper.contains(VtCloseButton)).toBe(true);
      expect(wrapper.contains(VtProgressBar)).toBe(true);
      expect(wrapper.element).toMatchSnapshot();
    });
  });
  describe("classes", () => {
    it("returns default classes", () => {
      const wrapper = mountToast({
        type: TYPE.DEFAULT,
        position: POSITION.TOP_RIGHT
      });
      const vm = wrapper.vm as {
        classes: string[];
      };
      const classes = [
        `${VT_NAMESPACE}__toast`,
        `${VT_NAMESPACE}__toast--${TYPE.DEFAULT}`,
        POSITION.TOP_RIGHT
      ];
      expect(vm.classes).toEqual(classes);
    });
    it("updates with type", () => {
      const wrapper = mountToast({
        type: TYPE.SUCCESS
      });
      const vm = wrapper.vm as {
        classes: string[];
      };
      expect(vm.classes).toContain(`${VT_NAMESPACE}__toast--${TYPE.SUCCESS}`);
    });
    it("updates with position", () => {
      const wrapper = mountToast({
        position: POSITION.BOTTOM_CENTER
      });
      const vm = wrapper.vm as {
        classes: string[];
      };
      expect(vm.classes).toContain(POSITION.BOTTOM_CENTER);
    });
    it("updates with disableTransitions", () => {
      const wrapper = mountToast();
      wrapper.setData({ disableTransitions: true });
      const vm = wrapper.vm as {
        classes: string[];
      };
      expect(vm.classes).toContain("disable-transition");
    });
    it("updates with toastClassName as string", () => {
      const wrapper = mountToast({
        toastClassName: "myclass"
      });
      const vm = wrapper.vm as {
        classes: string[];
      };
      expect(vm.classes).toContain("myclass");
    });
    it("updates with toastClassName as array", () => {
      const wrapper = mountToast({
        toastClassName: ["myclass", "myclass2"]
      });
      const vm = wrapper.vm as {
        classes: string[];
      };
      expect(vm.classes).toContain("myclass");
      expect(vm.classes).toContain("myclass2");
    });
  });
  describe("bodyClasses", () => {
    it("returns default classes", () => {
      const wrapper = mountToast();
      const vm = wrapper.vm as {
        bodyClasses: string[];
      };
      const bodyClasses = [`${VT_NAMESPACE}__toast-body`];
      expect(vm.bodyClasses).toEqual(bodyClasses);
    });
    it("returns component-body if custom component", () => {
      const wrapper = mountToast({ content: Simple });
      const vm = wrapper.vm as {
        bodyClasses: string[];
      };
      const bodyClasses = [`${VT_NAMESPACE}__toast-component-body`];
      expect(vm.bodyClasses).toEqual(bodyClasses);
    });
    it("appends bodyClassName as string", () => {
      const wrapper = mountToast({ bodyClassName: "myclass" });
      const vm = wrapper.vm as {
        bodyClasses: string[];
      };
      expect(vm.bodyClasses).toContain("myclass");
    });
    it("appends bodyClassName as array", () => {
      const wrapper = mountToast({ bodyClassName: ["myclass", "myclass2"] });
      const vm = wrapper.vm as {
        bodyClasses: string[];
      };
      expect(vm.bodyClasses).toContain("myclass");
      expect(vm.bodyClasses).toContain("myclass2");
    });
  });
  describe("draggableStyle", () => {
    it("returns empty if dragStart === dragPos.x", () => {
      const wrapper = mountToast();
      const vm = wrapper.vm as {
        draggableStyle: {
          transition?: string;
          opacity?: number;
          transform?: string;
        };
      };
      expect(vm.draggableStyle).toEqual({});
    });
    it("returns { transform, opacity } if beingDragged", () => {
      const wrapper = mountToast();
      wrapper.setData({ dragPos: { x: 10 }, beingDragged: true });
      const vm = wrapper.vm as {
        draggableStyle: {
          transition?: string;
          opacity?: number;
          transform?: string;
        };
        removalDistance: number;
        dragDelta: number;
      };
      expect(vm.draggableStyle).toEqual({
        transform: `translateX(${vm.dragDelta}px)`,
        opacity: 1 - Math.abs(vm.dragDelta / vm.removalDistance)
      });
    });
    it("Returns default values otherwise", () => {
      const wrapper = mountToast();
      wrapper.setData({ dragStart: 10 });
      const vm = wrapper.vm as {
        draggableStyle: {
          transition?: string;
          opacity?: number;
          transform?: string;
        };
      };
      expect(vm.draggableStyle).toEqual({
        transition: "transform 0.2s, opacity 0.2s",
        transform: "translateX(0)",
        opacity: 1
      });
    });
  });
  describe("dragDelta", () => {
    it("is being dragged", () => {
      const wrapper = mountToast();
      wrapper.setData({ beingDragged: true, dragPos: { x: 10 }, dragStart: 0 });
      const vm = wrapper.vm as {
        dragDelta: number;
      };
      expect(vm.dragDelta).toBe(10);
    });
    it("is being dragged", () => {
      const wrapper = mountToast();
      wrapper.setData({
        beingDragged: false,
        dragPos: { x: 10 },
        dragStart: 0
      });
      const vm = wrapper.vm as {
        dragDelta: number;
      };
      expect(vm.dragDelta).toBe(0);
    });
  });
  describe("removalDistance", () => {
    it("dragRect is a DOMRect", () => {
      const wrapper = mountToast();
      const dragRect: DOMRect = {
        height: 10,
        width: 10,
        top: 10,
        bottom: 10,
        right: 10,
        left: 0,
        x: 10,
        y: 10,
        toJSON: () => ({})
      };
      wrapper.setData({ dragRect, draggablePercent: 0.6 });
      const vm = wrapper.vm as {
        removalDistance: number;
      };
      expect(vm.removalDistance).toBe(6);
    });
    it("dragRect is not a DOMRect", () => {
      const wrapper = mountToast();
      const dragRect = {};
      wrapper.setData({ dragRect, draggablePercent: 0.6 });
      const vm = wrapper.vm as {
        removalDistance: number;
      };
      expect(vm.removalDistance).toBe(0);
    });
  });
  describe("mounted", () => {
    it("calls draggableSetup if this.draggable is true", () => {
      const localVue = createLocalVue();
      const Constructor = localVue.extend(VtToast);
      const component = new Constructor({
        propsData: {
          draggable: true,
          id: 1,
          content: "content"
        }
      });
      const loadedComponent = component as { draggableSetup(): void };
      const spyOnDraggableSetup = jest.spyOn(loadedComponent, "draggableSetup");

      expect(spyOnDraggableSetup).not.toHaveBeenCalled();
      component.$mount();
      expect(spyOnDraggableSetup).toHaveBeenCalled();
    });
    it("does not call draggableSetup if this.draggable is false", () => {
      const localVue = createLocalVue();
      const Constructor = localVue.extend(VtToast);
      const component = new Constructor({
        propsData: {
          draggable: false,
          id: 1,
          content: "content"
        }
      });
      const loadedComponent = component as { draggableSetup(): void };
      const spyOnDraggableSetup = jest.spyOn(loadedComponent, "draggableSetup");

      expect(spyOnDraggableSetup).not.toHaveBeenCalled();
      component.$mount();
      expect(spyOnDraggableSetup).not.toHaveBeenCalled();
    });
  });
  describe("beforeDestroy", () => {
    it("calls draggableSetup if this.draggable is true", () => {
      const wrapper = mountToast({ draggable: true });
      const vm = wrapper.vm as {
        draggableCleanup(): void;
      };
      const spyOnDraggableCleanup = jest.spyOn(vm, "draggableCleanup");
      expect(spyOnDraggableCleanup).not.toHaveBeenCalled();
      wrapper.destroy();
      expect(spyOnDraggableCleanup).toHaveBeenCalled();
    });
    it("does not call draggableSetup if this.draggable is false", () => {
      const wrapper = mountToast({ draggable: false });
      const vm = wrapper.vm as {
        draggableCleanup(): void;
      };
      const spyOnDraggableCleanup = jest.spyOn(vm, "draggableCleanup");
      expect(spyOnDraggableCleanup).not.toHaveBeenCalled();
      wrapper.destroy();
      expect(spyOnDraggableCleanup).not.toHaveBeenCalled();
    });
  });
  describe("destroyed", () => {
    it("removes element after timeout", async () => {
      const parent = document.createElement("div");
      const wrapper = mountToast();
      wrapper.destroy();
      parent.appendChild(wrapper.vm.$el);
      expect(parent.childElementCount).toBe(1);
      await new Promise(resolve => setTimeout(() => resolve(), 1000));
      expect(parent.childElementCount).toBe(0);
    });
  });
  describe("closeToast", () => {
    it("emits dismiss event", () => {
      const wrapper = mountToast({ id: "myId" });
      const vm = wrapper.vm as {
        closeToast(): void;
      };
      expect(eventsEmmited.dismiss).not.toHaveBeenCalled();
      vm.closeToast();
      expect(eventsEmmited.dismiss).toHaveBeenCalledWith("myId");
    });
  });
  describe("clickHandler", () => {
    it("calls onClick if defined", () => {
      const onClick = jest.fn();
      const wrapper = mountToast({ onClick });
      const vm = wrapper.vm as {
        closeToast(): void;
      };
      expect(onClick).not.toHaveBeenCalled();
      wrapper.trigger("click");
      expect(onClick).toHaveBeenCalledWith(vm.closeToast);
    });
    it("calls closeToast if closeOnClick and not beingDragged", () => {
      const wrapper = mountToast({ closeOnClick: true });
      wrapper.setData({ beingDragged: false });
      const vm = wrapper.vm as {
        closeToast(): void;
      };
      const spyOnCloseToast = jest.spyOn(vm, "closeToast");
      expect(spyOnCloseToast).not.toHaveBeenCalled();
      wrapper.trigger("click");
      expect(spyOnCloseToast).toHaveBeenCalled();
    });
    it("calls closeToast if closeOnClick and at the drag start", () => {
      const wrapper = mountToast({ closeOnClick: true });
      wrapper.setData({ beingDragged: true, dragStart: 0, dragPos: { x: 0 } });
      const vm = wrapper.vm as {
        closeToast(): void;
      };
      const spyOnCloseToast = jest.spyOn(vm, "closeToast");
      expect(spyOnCloseToast).not.toHaveBeenCalled();
      wrapper.trigger("click");
      expect(spyOnCloseToast).toHaveBeenCalled();
    });
    it("does not call closeToast if closeOnClick is false", () => {
      const wrapper = mountToast({ closeOnClick: false });
      const vm = wrapper.vm as {
        closeToast(): void;
      };
      const spyOnCloseToast = jest.spyOn(vm, "closeToast");
      expect(spyOnCloseToast).not.toHaveBeenCalled();
      wrapper.trigger("click");
      expect(spyOnCloseToast).not.toHaveBeenCalled();
    });
    it("does not call closeToast if beingDragged and dragStart is not dragPos.x", () => {
      const wrapper = mountToast({ closeOnClick: true });
      wrapper.setData({ beingDragged: true, dragStart: 1, dragPos: { x: 0 } });
      const vm = wrapper.vm as {
        closeToast(): void;
      };
      const spyOnCloseToast = jest.spyOn(vm, "closeToast");
      expect(spyOnCloseToast).not.toHaveBeenCalled();
      wrapper.trigger("click");
      expect(spyOnCloseToast).not.toHaveBeenCalled();
    });
  });
  describe("timeoutHandler", () => {
    it("calls closeToast if ProgressBar emits close-toast", () => {
      const wrapper = mountToast({ closeOnClick: false });
      const vm = wrapper.vm as {
        closeToast(): void;
      };
      const spyOnCloseToast = jest.spyOn(vm, "closeToast");
      const progressBar = wrapper.find(VtProgressBar);
      expect(spyOnCloseToast).not.toHaveBeenCalled();
      progressBar.vm.$emit("close-toast");
      expect(spyOnCloseToast).toHaveBeenCalled();
    });
  });
  describe("hoverPause", () => {
    it("pauses on mouseenter if pauseOnHover", () => {
      const wrapper = mountToast({ pauseOnHover: true });
      const vm = wrapper.vm as {
        isRunning: boolean;
      };
      expect(vm.isRunning).toBe(true);
      wrapper.trigger("mouseenter");
      expect(vm.isRunning).toBe(false);
    });
    it("does not pause on mouseenter if not pauseOnHover", () => {
      const wrapper = mountToast({ pauseOnHover: false });
      const vm = wrapper.vm as {
        isRunning: boolean;
      };
      expect(vm.isRunning).toBe(true);
      wrapper.trigger("mouseenter");
      expect(vm.isRunning).toBe(true);
    });
  });
  describe("hoverPlay", () => {
    it("resume on mouseleave if pauseOnHover", () => {
      const wrapper = mountToast({ pauseOnHover: true });
      wrapper.setData({ isRunning: false });
      const vm = wrapper.vm as {
        isRunning: boolean;
      };
      expect(vm.isRunning).toBe(false);
      wrapper.trigger("mouseleave");
      expect(vm.isRunning).toBe(true);
    });
    it("does not resume on mouseleave if not pauseOnHover", () => {
      const wrapper = mountToast({ pauseOnHover: false });
      wrapper.setData({ isRunning: false });
      const vm = wrapper.vm as {
        isRunning: boolean;
      };
      expect(vm.isRunning).toBe(false);
      wrapper.trigger("mouseleave");
      expect(vm.isRunning).toBe(false);
    });
  });
  describe("focusPause", () => {
    it("pauses on blur if pauseOnFocusLoss", () => {
      const wrapper = mountToast({ pauseOnFocusLoss: true });
      const vm = wrapper.vm as {
        isRunning: boolean;
      };
      expect(vm.isRunning).toBe(true);
      wrapper.trigger("blur");
      expect(vm.isRunning).toBe(false);
    });
    it("does not pause on blur if not pauseOnFocusLoss", () => {
      const wrapper = mountToast({ pauseOnFocusLoss: false });
      const vm = wrapper.vm as {
        isRunning: boolean;
      };
      expect(vm.isRunning).toBe(true);
      wrapper.trigger("blur");
      expect(vm.isRunning).toBe(true);
    });
  });
  describe("focusPlay", () => {
    it("resume on focus if pauseOnFocusLoss", () => {
      const wrapper = mountToast({ pauseOnFocusLoss: true });
      wrapper.setData({ isRunning: false });
      const vm = wrapper.vm as {
        isRunning: boolean;
      };
      expect(vm.isRunning).toBe(false);
      wrapper.trigger("focus");
      expect(vm.isRunning).toBe(true);
    });
    it("does not resume on focus if not pauseOnFocusLoss", () => {
      const wrapper = mountToast({ pauseOnFocusLoss: false });
      wrapper.setData({ isRunning: false });
      const vm = wrapper.vm as {
        isRunning: boolean;
      };
      expect(vm.isRunning).toBe(false);
      wrapper.trigger("focus");
      expect(vm.isRunning).toBe(false);
    });
  });
  describe("onDragStart", () => {
    it("sets correct values on drag start", () => {
      const wrapper = mountToast({ draggable: true });
      wrapper.setData({
        beingDragged: false,
        dragPos: { x: 0, y: 0 },
        dragStart: 0,
        dragRect: {}
      });
      const vm = wrapper.vm as {
        beingDragged: boolean;
        dragPos: { x: number; y: number };
        dragStart: number;
        dragRect: DOMRect;
      };
      expect(vm.beingDragged).toBe(false);
      expect(vm.dragPos).toEqual({ x: 0, y: 0 });
      expect(vm.dragStart).toBe(0);
      expect(vm.dragRect).toEqual({});
      wrapper.trigger("mousedown", {
        clientX: 10,
        clientY: 15
      });
      expect(vm.beingDragged).toBe(true);
      expect(vm.dragPos).toEqual({ x: 10, y: 15 });
      expect(vm.dragStart).toBe(10);
      expect(vm.dragRect).toEqual(wrapper.vm.$el.getBoundingClientRect());
    });
  });
  describe("onDragMove", () => {
    it("updates if beingDragged and isRunning", () => {
      const wrapper = mountToast({ draggable: true });
      const docWrapper = createWrapper(document.body);
      wrapper.setData({ beingDragged: false, isRunning: true });
      const vm = wrapper.vm as {
        beingDragged: boolean;
        dragPos: { x: number; y: number };
        isRunning: boolean;
      };
      expect(vm.isRunning).toBe(true);
      wrapper.trigger("mousedown", {
        clientX: 10,
        clientY: 15
      });
      expect(vm.isRunning).toBe(true);
      docWrapper.trigger("mousemove", {
        clientX: 20,
        clientY: 25
      });
      expect(vm.beingDragged).toBe(true);
      expect(vm.isRunning).toBe(false);
      expect(vm.dragPos).toEqual({ x: 20, y: 25 });
    });
    it("does nothing if not beingDragged", () => {
      const wrapper = mountToast({ draggable: true });
      const docWrapper = createWrapper(document.body);
      wrapper.setData({ beingDragged: false, isRunning: true });
      const vm = wrapper.vm as {
        beingDragged: boolean;
        dragPos: { x: number; y: number };
        isRunning: boolean;
      };
      expect(vm.isRunning).toBe(true);
      docWrapper.trigger("mousemove", {
        clientX: 20,
        clientY: 25
      });
      expect(vm.beingDragged).toBe(false);
      expect(vm.isRunning).toBe(true);
      expect(vm.dragPos).toEqual({ x: 0, y: 0 });
    });
  });
  describe("onDragEnd", () => {
    it("if drag ended after removalDistance, remove the component", async () => {
      const wrapper = mountToast({ draggable: true });
      const docWrapper = createWrapper(document.body);
      wrapper.setData({ beingDragged: false, isRunning: true });
      const vm = wrapper.vm as {
        beingDragged: boolean;
        dragPos: { x: number; y: number };
        isRunning: boolean;
        dragDelta: number;
        removalDistance: number;
        closeToast(): void;
        disableTransitions: boolean;
      };
      const spyCloseToast = jest.spyOn(vm, "closeToast");
      wrapper.trigger("mousedown", {
        clientX: 0,
        clientY: 0
      });
      docWrapper.trigger("mousemove", {
        clientX: 1000,
        clientY: 0
      });
      expect(Math.abs(vm.dragDelta)).toBeGreaterThanOrEqual(vm.removalDistance);
      expect(spyCloseToast).not.toHaveBeenCalled();
      expect(vm.disableTransitions).toBe(false);
      docWrapper.trigger("mouseup");
      expect(spyCloseToast).not.toHaveBeenCalled();
      expect(vm.disableTransitions).toBe(true);
      await wrapper.vm.$nextTick();
      expect(spyCloseToast).toHaveBeenCalled();
    });
    it("if drag ended before removalDistance but the mouse remains and pauseOnHover, pause", async () => {
      const wrapper = mountToast({ draggable: true, pauseOnHover: true });
      const docWrapper = createWrapper(document.body);
      wrapper.setData({ beingDragged: false, isRunning: true });
      const vm = wrapper.vm as {
        beingDragged: boolean;
        dragPos: { x: number; y: number };
        isRunning: boolean;
        dragDelta: number;
        removalDistance: number;
        disableTransitions: boolean;
        dragRect: DOMRect;
      };
      wrapper.trigger("mousedown", {
        clientX: 0,
        clientY: 0
      });
      docWrapper.trigger("mousemove", {
        clientX: 0,
        clientY: 0
      });
      wrapper.setData({
        dragRect: { x: 0, y: 0, bottom: 10, top: -10, left: -10, right: 10 }
      });
      expect(Math.abs(vm.dragDelta)).toBeLessThan(vm.removalDistance);
      expect(vm.disableTransitions).toBe(false);
      docWrapper.trigger("mouseup");
      expect(vm.disableTransitions).toBe(false);
      expect(vm.beingDragged).toBe(true);
      await new Promise(resolve => setTimeout(() => resolve()));
      expect(vm.beingDragged).toBe(false);
      expect(vm.isRunning).toBe(false);
    });
    it("if drag ended before removalDistance but the mouse remains and not pauseOnHover, resume", async () => {
      const wrapper = mountToast({ draggable: true, pauseOnHover: false });
      const docWrapper = createWrapper(document.body);
      wrapper.setData({ beingDragged: false, isRunning: true });
      const vm = wrapper.vm as {
        beingDragged: boolean;
        dragPos: { x: number; y: number };
        isRunning: boolean;
        dragDelta: number;
        removalDistance: number;
        disableTransitions: boolean;
        dragRect: DOMRect;
      };
      wrapper.trigger("mousedown", {
        clientX: 0,
        clientY: 0
      });
      docWrapper.trigger("mousemove", {
        clientX: 0,
        clientY: 0
      });
      wrapper.setData({
        dragRect: { x: 0, y: 0, bottom: 10, top: -10, left: -10, right: 10 }
      });
      expect(Math.abs(vm.dragDelta)).toBeLessThan(vm.removalDistance);
      expect(vm.disableTransitions).toBe(false);
      docWrapper.trigger("mouseup");
      expect(vm.disableTransitions).toBe(false);
      expect(vm.beingDragged).toBe(true);
      await new Promise(resolve => setTimeout(() => resolve()));
      expect(vm.beingDragged).toBe(false);
      expect(vm.isRunning).toBe(true);
    });
    it("if drag ended before removalDistance and the mouse is outside, resume", async () => {
      const wrapper = mountToast({ draggable: true, pauseOnHover: true });
      const docWrapper = createWrapper(document.body);
      wrapper.setData({ beingDragged: false, isRunning: true });
      const vm = wrapper.vm as {
        beingDragged: boolean;
        dragPos: { x: number; y: number };
        isRunning: boolean;
        dragDelta: number;
        removalDistance: number;
        disableTransitions: boolean;
        dragRect: DOMRect;
      };
      wrapper.trigger("mousedown", {
        clientX: 0,
        clientY: 0
      });
      docWrapper.trigger("mousemove", {
        clientX: 0,
        clientY: 100
      });
      wrapper.setData({
        dragRect: { x: 0, y: 0, bottom: 10, top: -10, left: -10, right: 10 }
      });
      expect(Math.abs(vm.dragDelta)).toBeLessThan(vm.removalDistance);
      expect(vm.disableTransitions).toBe(false);
      docWrapper.trigger("mouseup");
      expect(vm.disableTransitions).toBe(false);
      expect(vm.beingDragged).toBe(true);
      await new Promise(resolve => setTimeout(() => resolve()));
      expect(vm.beingDragged).toBe(false);
      expect(vm.isRunning).toBe(true);
    });
  });
});
