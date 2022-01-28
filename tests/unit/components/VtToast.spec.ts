import { ComponentPublicInstance, nextTick, ref } from "vue"
import { mount, VueWrapper } from "@vue/test-utils"
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
import * as useDraggableModule from "../../../src/ts/composables/useDraggable"

const setData = (
  wrapper: VueWrapper<ComponentPublicInstance>,
  override: Record<string, unknown>
) => {
  merge(wrapper.vm, override)
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
    jest.restoreAllMocks()
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
      jest.spyOn(useDraggableModule, "useDraggable").mockImplementation(() => ({
        beingDragged: ref(false),
        dragComplete: ref(true),
      }))
      const wrapper = mountToast()
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
    it("do nothing if being dragged", () => {
      jest.spyOn(useDraggableModule, "useDraggable").mockImplementation(() => ({
        beingDragged: ref(true),
        dragComplete: ref(false),
      }))
      const onClick = jest.fn()
      const wrapper = mountToast({ onClick })
      expect(onClick).not.toHaveBeenCalled()
      wrapper.trigger("click")
      expect(onClick).not.toHaveBeenCalled()
    })
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
    it("calls closeToast if ProgressBar emits close-toast", async () => {
      const id = "my-toast"
      const wrapper = mountToast({ eventBus, id })
      const progressBar = wrapper.findComponent(VtProgressBar)
      expect(eventsEmmited.dismiss).not.toHaveBeenCalled()
      progressBar.vm.$emit("close-toast")
      await nextTick()
      expect(eventsEmmited.dismiss).toHaveBeenCalledWith(id)
    })
  })
  describe("hover", () => {
    it("pauses/resumes if pauseOnHover", async () => {
      const wrapper = mountToast({ pauseOnHover: true })
      const vm = wrapper.vm as unknown as {
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(true)
      await wrapper.trigger("mouseenter")
      expect(vm.isRunning).toBe(false)
      await wrapper.trigger("mouseleave")
      expect(vm.isRunning).toBe(true)
    })
    it("does not pause/resume if not pauseOnHover", () => {
      const wrapper = mountToast({ pauseOnHover: false })
      const vm = wrapper.vm as unknown as {
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(true)
      wrapper.trigger("mouseenter")
      expect(vm.isRunning).toBe(true)
    })
  })
  describe("focus", () => {
    it("pauses/resumes if pauseOnFocusLoss", async () => {
      const wrapper = mountToast({ pauseOnFocusLoss: true })
      const vm = wrapper.vm as unknown as {
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(true)
      window.dispatchEvent(new window.FocusEvent("blur"))
      await nextTick()
      expect(vm.isRunning).toBe(false)
      window.dispatchEvent(new window.FocusEvent("focus"))
      await nextTick()
      expect(vm.isRunning).toBe(true)
    })
    it("does not pause/resume if not pauseOnFocusLoss", async () => {
      const wrapper = mountToast({ pauseOnFocusLoss: false })
      const vm = wrapper.vm as unknown as {
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(true)
      window.dispatchEvent(new window.FocusEvent("blur"))
      await nextTick()
      expect(vm.isRunning).toBe(true)
    })
  })
  describe("drag", () => {
    it("pauses/resumes if draggable", async () => {
      const beingDragged = ref(false)
      jest
        .spyOn(useDraggableModule, "useDraggable")
        .mockImplementation(() => ({ beingDragged, dragComplete: ref(false) }))
      const wrapper = mountToast({ draggable: true })
      const vm = wrapper.vm as unknown as {
        isRunning: boolean
      }
      expect(vm.isRunning).toBe(true)
      beingDragged.value = true
      await nextTick()
      expect(vm.isRunning).toBe(false)
      beingDragged.value = false
      await nextTick()
      expect(vm.isRunning).toBe(true)
    })
    it("closes toast on drag end", async () => {
      const dragComplete = ref(false)
      jest
        .spyOn(useDraggableModule, "useDraggable")
        .mockImplementation(() => ({ beingDragged: ref(false), dragComplete }))
      mountToast({ draggable: true, eventBus, id: "closesOnEnd" })

      await nextTick()
      expect(eventsEmmited.dismiss).not.toHaveBeenCalled()

      dragComplete.value = true

      await nextTick()
      await nextTick()

      expect(eventsEmmited.dismiss).toHaveBeenCalledWith("closesOnEnd")

      dragComplete.value = false
    })
  })
})
