import { ComponentPublicInstance } from "vue"
import { mount, VueWrapper, DOMWrapper } from "@vue/test-utils"
import merge from "lodash.merge"
import VtToast from "../../../src/components/VtToast.vue"
import VtIcon from "../../../src/components/VtIcon.vue"
import VtProgressBar from "../../../src/components/VtProgressBar.vue"
import VtCloseButton from "../../../src/components/VtCloseButton.vue"
import { ToastOptionsAndContent } from "../../../src/types"
import { VT_NAMESPACE, TYPE, POSITION, EVENTS } from "../../../src/ts/constants"
import Simple from "../../utils/components/Simple.vue"
import { EventBus } from "../../../src"
import { normalizeToastComponent } from "../../../src/ts/utils"

const setData = (
  wrapper: VueWrapper<ComponentPublicInstance>,
  override: Record<string, unknown>
) => {
  merge(wrapper.vm.$data, override)
}

const mountToast = ({ id, content, ...props }: ToastOptionsAndContent = {}) =>
  mount(VtToast, {
    props: {
      id: id || 1,
      content: normalizeToastComponent(content || "content"),
      eventBus: new EventBus(),
      ...props,
    },
  })

describe("VtToast", () => {
  const eventBus = new EventBus()
  const eventsEmmited = Object.values(EVENTS).reduce((agg, eventName) => {
    const handler = jest.fn()
    eventBus.on(eventName, handler)
    return { ...agg, [eventName]: handler }
  }, {} as { [eventName in EVENTS]: jest.Mock })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("snapshots", () => {
    it("renders", () => {
      const wrapper = mountToast()
      expect(wrapper.element).toMatchSnapshot()
    })
  })
  describe("ui", () => {
    it("has all default sub components", () => {
      const wrapper = mountToast({ content: "content" })
      expect(wrapper.find(`div.${VT_NAMESPACE}__toast-body`).text()).toEqual(
        "content"
      )
      expect(wrapper.findComponent(VtIcon).exists()).toBeTruthy()
      expect(wrapper.findComponent(VtCloseButton).exists()).toBeTruthy()
      expect(wrapper.findComponent(VtProgressBar).exists()).toBeTruthy()
      expect(wrapper.element).toMatchSnapshot()
    })
    it("closeButton = false removes it", () => {
      const wrapper = mountToast({ content: "content", closeButton: false })
      expect(wrapper.find(`div.${VT_NAMESPACE}__toast-body`).text()).toEqual(
        "content"
      )
      expect(wrapper.findComponent(VtIcon).exists()).toBeTruthy()
      expect(wrapper.findComponent(VtCloseButton).exists()).toBeFalsy()
      expect(wrapper.findComponent(VtProgressBar).exists()).toBeTruthy()
      expect(wrapper.element).toMatchSnapshot()
    })
    it("icon = false removes it", () => {
      const wrapper = mountToast({ content: "content", icon: false })
      expect(wrapper.find(`div.${VT_NAMESPACE}__toast-body`).text()).toEqual(
        "content"
      )
      expect(wrapper.findComponent(VtIcon).exists()).toBeFalsy()
      expect(wrapper.findComponent(VtCloseButton).exists()).toBeTruthy()
      expect(wrapper.findComponent(VtProgressBar).exists()).toBeTruthy()
      expect(wrapper.element).toMatchSnapshot()
    })
    it("timeout = false removes progress bar", () => {
      const wrapper = mountToast({ content: "content", timeout: false })
      expect(wrapper.find(`div.${VT_NAMESPACE}__toast-body`).text()).toEqual(
        "content"
      )
      expect(wrapper.findComponent(VtIcon).exists()).toBeTruthy()
      expect(wrapper.findComponent(VtCloseButton).exists()).toBeTruthy()
      expect(wrapper.findComponent(VtProgressBar).exists()).toBeFalsy()
      expect(wrapper.element).toMatchSnapshot()
    })
    it("renders custom component", () => {
      const wrapper = mountToast({ content: Simple })
      expect(
        wrapper.find(`div.${VT_NAMESPACE}__toast-component-body`).exists()
      ).toBe(true)
      expect(wrapper.findComponent(Simple).exists()).toBeTruthy()
      expect(wrapper.findComponent(VtIcon).exists()).toBeTruthy()
      expect(wrapper.findComponent(VtCloseButton).exists()).toBeTruthy()
      expect(wrapper.findComponent(VtProgressBar).exists()).toBeTruthy()
      expect(wrapper.element).toMatchSnapshot()
    })
    it("renders default aria role and button aria label", () => {
      const wrapper = mountToast()
      expect(wrapper.find("[role='alert']").exists()).toBe(true)
      expect(wrapper.find("button[aria-label='close']").exists()).toBe(true)
      expect(wrapper.element).toMatchSnapshot()
    })
    it("renders custom aria role and button aria label", () => {
      const wrapper = mountToast({
        accessibility: { toastRole: "status", closeButtonLabel: "text" },
      })
      expect(wrapper.find("[role='status']").exists()).toBe(true)
      expect(wrapper.find("button[aria-label='text']").exists()).toBe(true)
      expect(wrapper.element).toMatchSnapshot()
    })
    it("renders ltr by default", () => {
      const wrapper = mountToast()
      expect(wrapper.find(`div.${VT_NAMESPACE}__toast--rtl`).exists()).toBe(
        false
      )
      expect(wrapper.element).toMatchSnapshot()
    })
    it("renders rtl if set", () => {
      const wrapper = mountToast({ rtl: true })
      expect(wrapper.find(`div.${VT_NAMESPACE}__toast--rtl`).exists()).toBe(
        true
      )
      expect(wrapper.element).toMatchSnapshot()
    })
  })
  describe("classes", () => {
    it("returns default classes", () => {
      const wrapper = mountToast({
        type: TYPE.DEFAULT,
        position: POSITION.TOP_RIGHT,
      })
      const vm = wrapper.vm as unknown as {
        classes: string[]
      }
      const classes = [
        `${VT_NAMESPACE}__toast`,
        `${VT_NAMESPACE}__toast--${TYPE.DEFAULT}`,
        POSITION.TOP_RIGHT,
      ]
      expect(vm.classes).toEqual(classes)
    })
    it("updates with type", () => {
      const wrapper = mountToast({
        type: TYPE.SUCCESS,
      })
      const vm = wrapper.vm as unknown as {
        classes: string[]
      }
      expect(vm.classes).toContain(`${VT_NAMESPACE}__toast--${TYPE.SUCCESS}`)
    })
    it("updates with position", () => {
      const wrapper = mountToast({
        position: POSITION.BOTTOM_CENTER,
      })
      const vm = wrapper.vm as unknown as {
        classes: string[]
      }
      expect(vm.classes).toContain(POSITION.BOTTOM_CENTER)
    })
    it("updates with disableTransitions", () => {
      const wrapper = mountToast()
      setData(wrapper, { disableTransitions: true })
      const vm = wrapper.vm as unknown as {
        classes: string[]
      }
      expect(vm.classes).toContain("disable-transition")
    })
    it("updates with toastClassName as string", () => {
      const wrapper = mountToast({
        toastClassName: "myclass",
      })
      const vm = wrapper.vm as unknown as {
        classes: string[]
      }
      expect(vm.classes).toContain("myclass")
    })
    it("updates with toastClassName as array", () => {
      const wrapper = mountToast({
        toastClassName: ["myclass", "myclass2"],
      })
      const vm = wrapper.vm as unknown as {
        classes: string[]
      }
      expect(vm.classes).toContain("myclass")
      expect(vm.classes).toContain("myclass2")
    })
  })
  describe("bodyClasses", () => {
    it("returns default classes", () => {
      const wrapper = mountToast()
      const vm = wrapper.vm as unknown as {
        bodyClasses: string[]
      }
      const bodyClasses = [`${VT_NAMESPACE}__toast-body`]
      expect(vm.bodyClasses).toEqual(bodyClasses)
    })
    it("returns component-body if custom component", () => {
      const wrapper = mountToast({ content: Simple })
      const vm = wrapper.vm as unknown as {
        bodyClasses: string[]
      }
      const bodyClasses = [`${VT_NAMESPACE}__toast-component-body`]
      expect(vm.bodyClasses).toEqual(bodyClasses)
    })
    it("appends bodyClassName as string", () => {
      const wrapper = mountToast({ bodyClassName: "myclass" })
      const vm = wrapper.vm as unknown as {
        bodyClasses: string[]
      }
      expect(vm.bodyClasses).toContain("myclass")
    })
    it("appends bodyClassName as array", () => {
      const wrapper = mountToast({ bodyClassName: ["myclass", "myclass2"] })
      const vm = wrapper.vm as unknown as {
        bodyClasses: string[]
      }
      expect(vm.bodyClasses).toContain("myclass")
      expect(vm.bodyClasses).toContain("myclass2")
    })
  })
  describe("draggableStyle", () => {
    it("returns empty if dragStart === dragPos.x", () => {
      const wrapper = mountToast()
      const vm = wrapper.vm as unknown as {
        draggableStyle: {
          transition?: string
          opacity?: number
          transform?: string
        }
      }
      expect(vm.draggableStyle).toEqual({})
    })
    it("returns { transform, opacity } if beingDragged", () => {
      const wrapper = mountToast()
      setData(wrapper, { dragPos: { x: 10 }, beingDragged: true })
      const vm = wrapper.vm as unknown as {
        draggableStyle: {
          transition?: string
          opacity?: number
          transform?: string
        }
        removalDistance: number
        dragDelta: number
      }
      expect(vm.draggableStyle).toEqual({
        transform: `translateX(${vm.dragDelta}px)`,
        opacity: 1 - Math.abs(vm.dragDelta / vm.removalDistance),
      })
    })
    it("Returns default values otherwise", () => {
      const wrapper = mountToast()
      setData(wrapper, { dragStart: 10, dragPos: { x: 0 } })
      const vm = wrapper.vm as unknown as {
        draggableStyle: {
          transition?: string
          opacity?: number
          transform?: string
        }
      }
      expect(vm.draggableStyle).toEqual({
        transition: "transform 0.2s, opacity 0.2s",
        transform: "translateX(0)",
        opacity: 1,
      })
    })
  })
  describe("dragDelta", () => {
    it("is being dragged", () => {
      const wrapper = mountToast()
      setData(wrapper, { beingDragged: true, dragPos: { x: 10 }, dragStart: 0 })
      const vm = wrapper.vm as unknown as {
        dragDelta: number
      }
      expect(vm.dragDelta).toBe(10)
    })
    it("is being dragged", () => {
      const wrapper = mountToast()
      setData(wrapper, {
        beingDragged: false,
        dragPos: { x: 10 },
        dragStart: 0,
      })
      const vm = wrapper.vm as unknown as {
        dragDelta: number
      }
      expect(vm.dragDelta).toBe(0)
    })
  })
  describe("removalDistance", () => {
    it("dragRect is a DOMRect", () => {
      const wrapper = mountToast()
      const dragRect: DOMRect = {
        height: 10,
        width: 10,
        top: 10,
        bottom: 10,
        right: 10,
        left: 0,
        x: 10,
        y: 10,
        toJSON: () => ({}),
      }
      setData(wrapper, { dragRect, draggablePercent: 0.6 })
      const vm = wrapper.vm as unknown as {
        removalDistance: number
      }
      expect(vm.removalDistance).toBe(6)
    })
    it("dragRect is not a DOMRect", () => {
      const wrapper = mountToast()
      const dragRect = {}
      setData(wrapper, { dragRect, draggablePercent: 0.6 })
      const vm = wrapper.vm as unknown as {
        removalDistance: number
      }
      expect(vm.removalDistance).toBe(0)
    })
  })
  describe("mounted", () => {
    it("calls draggableSetup if this.draggable is true", () => {
      const spyOnDraggableSetup = jest.spyOn(VtToast.methods, "draggableSetup")

      expect(spyOnDraggableSetup).not.toHaveBeenCalled()

      mount(VtToast, {
        props: {
          draggable: true,
          id: 1,
          content: "content",
        },
      })

      expect(spyOnDraggableSetup).toHaveBeenCalled()
    })
    it("does not call draggableSetup if this.draggable is false", () => {
      const spyOnDraggableSetup = jest.spyOn(VtToast.methods, "draggableSetup")

      expect(spyOnDraggableSetup).not.toHaveBeenCalled()

      mount(VtToast, {
        props: {
          draggable: false,
          id: 1,
          content: "content",
        },
      })

      expect(spyOnDraggableSetup).not.toHaveBeenCalled()
    })
    it("calls focusSetup if this.pauseOnFocusLoss is true", () => {
      const spy = jest.spyOn(VtToast.methods, "focusSetup")

      expect(spy).not.toHaveBeenCalled()

      mount(VtToast, {
        props: {
          pauseOnFocusLoss: true,
          id: 1,
          content: "content",
        },
      })

      expect(spy).toHaveBeenCalled()
    })
    it("does not call focusSetup if this.pauseOnFocusLoss is false", () => {
      const spy = jest.spyOn(VtToast.methods, "focusSetup")

      expect(spy).not.toHaveBeenCalled()

      mount(VtToast, {
        props: {
          pauseOnFocusLoss: false,
          id: 1,
          content: "content",
        },
      })

      expect(spy).not.toHaveBeenCalled()
    })
  })
  describe("beforeunmount", () => {
    it("calls draggableCleanup if this.draggable is true", async () => {
      const wrapper = mountToast({ draggable: true })
      const vm = wrapper.vm as unknown as {
        draggableCleanup(): void
      }

      const spyOnDraggableCleanup = (vm.draggableCleanup = jest.fn())
      expect(spyOnDraggableCleanup).not.toHaveBeenCalled()
      wrapper.unmount()
      expect(spyOnDraggableCleanup).toHaveBeenCalled()
    })
    it("does not call draggableCleanup if this.draggable is false", () => {
      const wrapper = mountToast({ draggable: false })
      const vm = wrapper.vm as unknown as {
        draggableCleanup(): void
      }

      const spyOnDraggableCleanup = (vm.draggableCleanup = jest.fn())
      expect(spyOnDraggableCleanup).not.toHaveBeenCalled()
      wrapper.unmount()
      expect(spyOnDraggableCleanup).not.toHaveBeenCalled()
    })
    it("calls focusCleanup if this.pauseOnFocusLoss is true", () => {
      const wrapper = mountToast({ pauseOnFocusLoss: true })
      const vm = wrapper.vm as unknown as {
        focusCleanup(): void
      }

      const spyOnfocusCleanup = (vm.focusCleanup = jest.fn())
      expect(spyOnfocusCleanup).not.toHaveBeenCalled()
      wrapper.unmount()
      expect(spyOnfocusCleanup).toHaveBeenCalled()
    })
    it("does not call focusCleanup if this.pauseOnFocusLoss is false", () => {
      const wrapper = mountToast({ pauseOnFocusLoss: false })
      const vm = wrapper.vm as unknown as {
        focusCleanup(): void
      }

      const spyOnfocusCleanup = (vm.focusCleanup = jest.fn())
      expect(spyOnfocusCleanup).not.toHaveBeenCalled()
      wrapper.unmount()
      expect(spyOnfocusCleanup).not.toHaveBeenCalled()
    })
  })
  describe("closeToast", () => {
    it("emits dismiss event", () => {
      const wrapper = mountToast({ id: "myId", eventBus })
      const vm = wrapper.vm as unknown as {
        closeToast(): void
      }
      expect(eventsEmmited.dismiss).not.toHaveBeenCalled()
      vm.closeToast()
      expect(eventsEmmited.dismiss).toHaveBeenCalledWith("myId")
    })
  })
  describe("clickHandler", () => {
    it("calls onClick if defined", () => {
      const onClick = jest.fn()
      const wrapper = mountToast({ onClick })
      const vm = wrapper.vm as unknown as {
        closeToast(): void
      }
      expect(onClick).not.toHaveBeenCalled()
      wrapper.trigger("click")
      expect(onClick).toHaveBeenCalledWith(vm.closeToast)
    })
    it("calls closeToast if closeOnClick and not beingDragged", () => {
      const wrapper = mountToast({ closeOnClick: true })
      setData(wrapper, { beingDragged: false })
      const vm = wrapper.vm as unknown as {
        closeToast(): void
      }
      const spyOnCloseToast = (vm.closeToast = jest.fn(vm.closeToast))
      expect(spyOnCloseToast).not.toHaveBeenCalled()
      wrapper.trigger("click")
      expect(spyOnCloseToast).toHaveBeenCalled()
    })
    it("calls closeToast if closeOnClick and at the drag start", () => {
      const wrapper = mountToast({ closeOnClick: true })
      setData(wrapper, { beingDragged: true, dragStart: 0, dragPos: { x: 0 } })
      const vm = wrapper.vm as unknown as {
        closeToast(): void
      }
      const spyOnCloseToast = (vm.closeToast = jest.fn(vm.closeToast))
      expect(spyOnCloseToast).not.toHaveBeenCalled()
      wrapper.trigger("click")
      expect(spyOnCloseToast).toHaveBeenCalled()
    })
    it("does not call closeToast if closeOnClick is false", () => {
      const wrapper = mountToast({ closeOnClick: false })
      const vm = wrapper.vm as unknown as {
        closeToast(): void
      }
      const spyOnCloseToast = (vm.closeToast = jest.fn(vm.closeToast))
      expect(spyOnCloseToast).not.toHaveBeenCalled()
      wrapper.trigger("click")
      expect(spyOnCloseToast).not.toHaveBeenCalled()
    })
    it("does not call closeToast if beingDragged and dragStart is not dragPos.x", () => {
      const wrapper = mountToast({ closeOnClick: true })
      setData(wrapper, { beingDragged: true, dragStart: 1, dragPos: { x: 0 } })
      const vm = wrapper.vm as unknown as {
        closeToast(): void
      }
      const spyOnCloseToast = (vm.closeToast = jest.fn(vm.closeToast))
      expect(spyOnCloseToast).not.toHaveBeenCalled()
      wrapper.trigger("click")
      expect(spyOnCloseToast).not.toHaveBeenCalled()
    })
  })
  describe("timeoutHandler", () => {
    it("calls closeToast if ProgressBar emits close-toast", () => {
      const wrapper = mountToast({ closeOnClick: false })
      const vm = wrapper.vm as unknown as {
        closeToast(): void
      }
      const spyOnCloseToast = (vm.closeToast = jest.fn(vm.closeToast))
      const progressBar = wrapper.findComponent(VtProgressBar)
      expect(spyOnCloseToast).not.toHaveBeenCalled()
      progressBar.vm.$emit("close-toast")
      expect(spyOnCloseToast).toHaveBeenCalled()
    })
  })
  describe("hoverPause", () => {
    it("pauses on mouseenter if pauseOnHover", () => {
      const wrapper = mountToast({ pauseOnHover: true })
      const vm = wrapper.vm as unknown as {
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(true)
      wrapper.trigger("mouseenter")
      expect(vm.isRunning).toBe(false)
    })
    it("does not pause on mouseenter if not pauseOnHover", () => {
      const wrapper = mountToast({ pauseOnHover: false })
      const vm = wrapper.vm as unknown as {
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(true)
      wrapper.trigger("mouseenter")
      expect(vm.isRunning).toBe(true)
    })
  })
  describe("hoverPlay", () => {
    it("resume on mouseleave if pauseOnHover", () => {
      const wrapper = mountToast({ pauseOnHover: true })
      setData(wrapper, { isRunning: false })
      const vm = wrapper.vm as unknown as {
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(false)
      wrapper.trigger("mouseleave")
      expect(vm.isRunning).toBe(true)
    })
    it("does not resume on mouseleave if not pauseOnHover", () => {
      const wrapper = mountToast({ pauseOnHover: false })
      setData(wrapper, { isRunning: false })
      const vm = wrapper.vm as unknown as {
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(false)
      wrapper.trigger("mouseleave")
      expect(vm.isRunning).toBe(false)
    })
  })
  describe("focusPause", () => {
    it("pauses on blur if pauseOnFocusLoss", () => {
      const wrapper = mountToast({ pauseOnFocusLoss: true })
      const vm = wrapper.vm as unknown as {
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(true)
      window.dispatchEvent(new window.FocusEvent("blur"))
      expect(vm.isRunning).toBe(false)
    })
    it("does not pause on blur if not pauseOnFocusLoss", () => {
      const wrapper = mountToast({ pauseOnFocusLoss: false })
      const vm = wrapper.vm as unknown as {
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(true)
      window.dispatchEvent(new window.FocusEvent("blur"))
      expect(vm.isRunning).toBe(true)
    })
  })
  describe("focusPlay", () => {
    it("resume on focus if pauseOnFocusLoss", () => {
      const wrapper = mountToast({ pauseOnFocusLoss: true })
      setData(wrapper, { isRunning: false })
      const vm = wrapper.vm as unknown as {
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(false)
      window.dispatchEvent(new window.FocusEvent("focus"))
      expect(vm.isRunning).toBe(true)
    })
    it("does not resume on focus if not pauseOnFocusLoss", () => {
      const wrapper = mountToast({ pauseOnFocusLoss: false })
      setData(wrapper, { isRunning: false })
      const vm = wrapper.vm as unknown as {
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(false)
      window.dispatchEvent(new window.FocusEvent("focus"))
      expect(vm.isRunning).toBe(false)
    })
  })
  describe("onDragStart", () => {
    it("sets correct values on drag start", () => {
      const wrapper = mountToast({ draggable: true })
      setData(wrapper, {
        beingDragged: false,
        dragPos: { x: 0, y: 0 },
        dragStart: 0,
        dragRect: {},
      })
      const vm = wrapper.vm as unknown as {
        beingDragged: boolean
        dragPos: { x: number; y: number }
        dragStart: number
        dragRect: DOMRect
      }
      expect(vm.beingDragged).toBe(false)
      expect(vm.dragPos).toEqual({ x: 0, y: 0 })
      expect(vm.dragStart).toBe(0)
      expect(vm.dragRect).toEqual({})
      wrapper.trigger("mousedown", {
        clientX: 10,
        clientY: 15,
      })
      expect(vm.beingDragged).toBe(true)
      expect(vm.dragPos).toEqual({ x: 10, y: 15 })
      expect(vm.dragStart).toBe(10)
      expect(vm.dragRect).toEqual(wrapper.vm.$el.getBoundingClientRect())
    })
  })
  describe("onDragMove", () => {
    it("updates if beingDragged and isRunning", () => {
      const wrapper = mountToast({ draggable: true })
      const docWrapper = new DOMWrapper(document.body)
      setData(wrapper, { beingDragged: false, isRunning: true })
      const vm = wrapper.vm as unknown as {
        beingDragged: boolean
        dragPos: { x: number; y: number }
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(true)
      wrapper.trigger("mousedown", {
        clientX: 10,
        clientY: 15,
      })
      expect(vm.isRunning).toBe(true)
      docWrapper.trigger("mousemove", {
        clientX: 20,
        clientY: 25,
      })
      expect(vm.beingDragged).toBe(true)
      expect(vm.isRunning).toBe(false)
      expect(vm.dragPos).toEqual({ x: 20, y: 25 })
    })
    it("event.preventDefault is called if being dragged", () => {
      const wrapper = mountToast({ draggable: true })
      setData(wrapper, { beingDragged: false, isRunning: true })
      wrapper.trigger("mousedown", {
        clientX: 0,
        clientY: 0,
      })
      const event = new MouseEvent("mousemove", { clientX: 10, clientY: 15 })
      const spyPreventDefault = jest.spyOn(event, "preventDefault")
      expect(spyPreventDefault).not.toBeCalled()
      window.dispatchEvent(event)
      expect(spyPreventDefault).toBeCalled()
    })
    it("does nothing if not beingDragged", () => {
      const wrapper = mountToast({ draggable: true })
      const docWrapper = new DOMWrapper(document.body)
      setData(wrapper, { beingDragged: false, isRunning: true })
      const vm = wrapper.vm as unknown as {
        beingDragged: boolean
        dragPos: { x: number; y: number }
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(true)
      docWrapper.trigger("mousemove", {
        clientX: 20,
        clientY: 25,
      })
      expect(vm.beingDragged).toBe(false)
      expect(vm.isRunning).toBe(true)
      expect(vm.dragPos).toEqual({ x: 0, y: 0 })
    })
  })
  describe("onDragEnd", () => {
    it("if drag ended after removalDistance, remove the component", async () => {
      const wrapper = mountToast({ draggable: true })
      const docWrapper = new DOMWrapper(document.body)
      setData(wrapper, { beingDragged: false, isRunning: true })
      const vm = wrapper.vm as unknown as {
        beingDragged: boolean
        dragPos: { x: number; y: number }
        isRunning: boolean
        dragDelta: number
        removalDistance: number
        closeToast(): void
        disableTransitions: boolean
      }
      const spyCloseToast = (vm.closeToast = jest.fn(vm.closeToast))
      wrapper.trigger("mousedown", {
        clientX: 0,
        clientY: 0,
      })
      docWrapper.trigger("mousemove", {
        clientX: 1000,
        clientY: 0,
      })
      expect(Math.abs(vm.dragDelta)).toBeGreaterThanOrEqual(vm.removalDistance)
      expect(spyCloseToast).not.toHaveBeenCalled()
      expect(vm.disableTransitions).toBe(false)
      docWrapper.trigger("mouseup")
      expect(spyCloseToast).not.toHaveBeenCalled()
      expect(vm.disableTransitions).toBe(true)
      await wrapper.vm.$nextTick()
      expect(spyCloseToast).toHaveBeenCalled()
    })
    it("if drag ended before removalDistance but the mouse remains and pauseOnHover, pause", async () => {
      const wrapper = mountToast({ draggable: true, pauseOnHover: true })
      const docWrapper = new DOMWrapper(document.body)
      setData(wrapper, { beingDragged: false, isRunning: true })
      const vm = wrapper.vm as unknown as {
        beingDragged: boolean
        dragPos: { x: number; y: number }
        isRunning: boolean
        dragDelta: number
        removalDistance: number
        disableTransitions: boolean
        dragRect: DOMRect
      }
      wrapper.trigger("mousedown", {
        clientX: 0,
        clientY: 0,
      })
      docWrapper.trigger("mousemove", {
        clientX: 0,
        clientY: 0,
      })
      setData(wrapper, {
        dragRect: { x: 0, y: 0, bottom: 10, top: -10, left: -10, right: 10 },
      })
      expect(Math.abs(vm.dragDelta)).toBeLessThan(vm.removalDistance)
      expect(vm.disableTransitions).toBe(false)
      docWrapper.trigger("mouseup")
      expect(vm.disableTransitions).toBe(false)
      expect(vm.beingDragged).toBe(true)
      await new Promise<void>(resolve => setTimeout(() => resolve()))
      expect(vm.beingDragged).toBe(false)
      expect(vm.isRunning).toBe(false)
    })
    it("if drag ended before removalDistance but the mouse remains and not pauseOnHover, resume", async () => {
      const wrapper = mountToast({ draggable: true, pauseOnHover: false })
      const docWrapper = new DOMWrapper(document.body)
      setData(wrapper, { beingDragged: false, isRunning: true })
      const vm = wrapper.vm as unknown as {
        beingDragged: boolean
        dragPos: { x: number; y: number }
        isRunning: boolean
        dragDelta: number
        removalDistance: number
        disableTransitions: boolean
        dragRect: DOMRect
      }
      wrapper.trigger("mousedown", {
        clientX: 0,
        clientY: 0,
      })
      docWrapper.trigger("mousemove", {
        clientX: 0,
        clientY: 0,
      })
      setData(wrapper, {
        dragRect: { x: 0, y: 0, bottom: 10, top: -10, left: -10, right: 10 },
      })
      expect(Math.abs(vm.dragDelta)).toBeLessThan(vm.removalDistance)
      expect(vm.disableTransitions).toBe(false)
      docWrapper.trigger("mouseup")
      expect(vm.disableTransitions).toBe(false)
      expect(vm.beingDragged).toBe(true)
      await new Promise<void>(resolve => setTimeout(() => resolve()))
      expect(vm.beingDragged).toBe(false)
      expect(vm.isRunning).toBe(true)
    })
    it("if drag ended before removalDistance and the mouse is outside, resume", async () => {
      const wrapper = mountToast({ draggable: true, pauseOnHover: true })
      const docWrapper = new DOMWrapper(document.body)
      setData(wrapper, { beingDragged: false, isRunning: true })
      const vm = wrapper.vm as unknown as {
        beingDragged: boolean
        dragPos: { x: number; y: number }
        isRunning: boolean
        dragDelta: number
        removalDistance: number
        disableTransitions: boolean
        dragRect: DOMRect
      }
      wrapper.trigger("mousedown", {
        clientX: 0,
        clientY: 0,
      })
      docWrapper.trigger("mousemove", {
        clientX: 0,
        clientY: 100,
      })
      setData(wrapper, {
        dragRect: { x: 0, y: 0, bottom: 10, top: -10, left: -10, right: 10 },
      })
      expect(Math.abs(vm.dragDelta)).toBeLessThan(vm.removalDistance)
      expect(vm.disableTransitions).toBe(false)
      docWrapper.trigger("mouseup")
      expect(vm.disableTransitions).toBe(false)
      expect(vm.beingDragged).toBe(true)
      await new Promise<void>(resolve => setTimeout(() => resolve()))
      expect(vm.beingDragged).toBe(false)
      expect(vm.isRunning).toBe(true)
    })
  })
})
