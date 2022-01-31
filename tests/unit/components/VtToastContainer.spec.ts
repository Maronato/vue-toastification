import { PluginOptions } from "../../../src/types"
import { EVENTS, POSITION, TYPE } from "../../../src/ts/constants"
import VtToastContainer from "../../../src/components/VtToastContainer.vue"
import VtToast from "../../../src/components/VtToast.vue"
import VtProgressBar from "../../../src/components/VtProgressBar.vue"
import { ComponentPublicInstance, h, nextTick } from "vue"
import { mount, VueWrapper } from "@vue/test-utils"
import { createToastInstance, EventBus } from "../../../src"

const mountToastContainer = async (props: PluginOptions = {}) => {
  const eventBus = new EventBus()
  const toast = createToastInstance(eventBus)
  const wrapper = mount(VtToastContainer, {
    props: { container: undefined, eventBus, ...props },
  })
  await nextTick()
  return {
    eventBus,
    toast,
    wrapper,
  }
}

const defaultToastMessage = (message: string) => `${message} ×`

describe("VtToastContainer", () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.resetAllMocks()
  })

  it("snapshots with default value", async () => {
    const { wrapper } = await mountToastContainer()
    expect(wrapper.element).toMatchSnapshot()
  })
  it("snapshots with classes", async () => {
    const { wrapper } = await mountToastContainer({
      containerClassName: "myclass",
    })
    expect(wrapper.element).toMatchSnapshot()
  })
  it("snapshots with toasts", async () => {
    const { wrapper, toast } = await mountToastContainer()

    toast("default")
    toast.info("info")
    toast.error("error", { position: POSITION.BOTTOM_RIGHT })
    await nextTick()

    expect(wrapper.element).toMatchSnapshot()
  })
  describe("setup", () => {
    it("removes element and reassigns", async () => {
      const container = document.createElement("div")

      const { wrapper, toast } = await mountToastContainer()

      // Should be other container
      expect(wrapper.element.parentElement).not.toBe(container)

      // Should be new container
      toast.updateDefaults({ container })
      await nextTick()

      expect(wrapper.element.parentElement).toBe(container)
    })
    it("accepts function container", async () => {
      const container = document.createElement("div")

      const { wrapper, toast } = await mountToastContainer()

      // Should be other container
      expect(wrapper.element.parentElement).not.toBe(container)

      // Should be new container
      toast.updateDefaults({ container: () => container })
      await nextTick()

      expect(wrapper.element.parentElement).toBe(container)
    })
    it("accepts async container", async () => {
      const container = document.createElement("div")

      const { wrapper, toast } = await mountToastContainer()

      // Should be other container
      expect(wrapper.element.parentElement).not.toBe(container)

      // Should be new container
      toast.updateDefaults({ container: () => new Promise(r => r(container)) })
      await nextTick()

      expect(wrapper.element.parentElement).toBe(container)
    })
  })
  describe("create toast", () => {
    it("creates simple toast", async () => {
      const { wrapper, toast } = await mountToastContainer()
      expect(wrapper.findAllComponents(VtToast).length).toBe(0)

      const message = "I'm a toast"
      toast.info(message)
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(1)
      expect(
        wrapper.find(`.${POSITION.TOP_RIGHT}`).findAllComponents(VtToast).length
      ).toBe(1)
      // Test with startsWith as there is a "x" from
      expect(wrapper.findComponent(VtToast).text()).toEqual(
        defaultToastMessage(message)
      )
      expect(wrapper.findComponent(VtToast).isVisible()).toBe(true)
    })

    it("creates toast with props", async () => {
      const { wrapper, toast } = await mountToastContainer()

      const message = "I'm a toast"
      toast.info(message, { closeButton: () => h("div", " close") })
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(1)
      // Test with startsWith as there is a "x" from
      expect(wrapper.findComponent(VtToast).text()).toEqual(`${message} close`)
    })

    it("creates toast with default props", async () => {
      const { wrapper, toast } = await mountToastContainer({
        closeButton: () => h("div", " close"),
      })

      const message = "I'm a toast"
      toast.info(message)
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(1)
      // Test with startsWith as there is a "x" from
      expect(wrapper.findComponent(VtToast).text()).toEqual(`${message} close`)
    })

    it("creates toast in a different position", async () => {
      const { wrapper, toast } = await mountToastContainer()

      const message = "I'm a toast"
      toast.info(message, { position: POSITION.BOTTOM_CENTER })
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(1)
      expect(
        wrapper.find(`.${POSITION.BOTTOM_CENTER}`).findAllComponents(VtToast)
          .length
      ).toBe(1)
    })

    it("creates multiple toasts", async () => {
      const { wrapper, toast } = await mountToastContainer()

      // Create many messages
      const list = [1, 2, 3, 4, 5]
      const getMessage = (i: number) => `message ${i}`
      list.forEach(i => toast(getMessage(i)))
      await nextTick()

      const toasts = wrapper.findAllComponents(VtToast)
      expect(toasts.length).toBe(list.length)

      const toastTexts = toasts.map(t => t.text())
      const expectedTexts = list.map(i => defaultToastMessage(getMessage(i)))

      expect(toastTexts.sort()).toEqual(expectedTexts.sort())
    })

    it("displays maximum toasts only", async () => {
      const maxToasts = 3
      const { wrapper, toast } = await mountToastContainer({ maxToasts })

      // Create many messages
      const list = [1, 2, 3, 4, 5]
      const getMessage = (i: number) => `message ${i}`
      list.forEach(i => toast(getMessage(i)))
      await nextTick()

      const toasts = wrapper.findAllComponents(VtToast)
      expect(toasts.length).toBe(maxToasts)

      const toastTexts = toasts.map(t => t.text())
      const expectedTexts = list
        .slice(0, maxToasts)
        .map(i => defaultToastMessage(getMessage(i)))

      expect(toastTexts.sort()).toEqual(expectedTexts.sort())
    })

    it("displays in reverse if newestOnTop", async () => {
      const { wrapper, toast } = await mountToastContainer({
        newestOnTop: false,
      })

      // Create many messages
      const list = [1, 2, 3, 4, 5]
      const getMessage = (i: number) => `message ${i}`
      list.forEach(i => toast(getMessage(i)))
      await nextTick()

      const oldestToasts = wrapper.findAllComponents(VtToast)

      const oldestTexts = oldestToasts.map(t => t.text())

      toast.updateDefaults({ newestOnTop: true })
      await nextTick()

      const newestToasts = wrapper.findAllComponents(VtToast)
      const newestTexts = newestToasts.map(t => t.text())

      expect(oldestTexts).not.toEqual(newestTexts)
      expect(oldestTexts.reverse()).toEqual(newestTexts)
    })

    it("creates multiple toasts in different positions", async () => {
      const { wrapper, toast } = await mountToastContainer()

      // Create many messages
      const list: [number, POSITION][] = [
        [1, POSITION.BOTTOM_CENTER],
        [2, POSITION.TOP_CENTER],
        [3, POSITION.TOP_LEFT],
        [4, POSITION.TOP_LEFT],
      ]
      const getMessage = (i: number) => `message ${i}`
      list.forEach(([i, position]) => toast(getMessage(i), { position }))
      await nextTick()

      const toasts = wrapper.findAllComponents(VtToast)
      expect(toasts.length).toBe(list.length)

      type MessagePosition = [string, POSITION]

      const toastTexts = Object.values(POSITION)
        .map(position => {
          const toasts = wrapper
            .find(`.${position}`)
            .findAllComponents(VtToast) as VueWrapper<ComponentPublicInstance>[]
          return toasts.map(toast => [
            toast.text(),
            position,
          ]) as MessagePosition[]
        })
        .reduce((agg, value) => [...agg, ...value], [])

      const expectedTexts: MessagePosition[] = list.map(([i, position]) => [
        defaultToastMessage(getMessage(i)),
        position,
      ])

      expect(toastTexts.sort()).toEqual(expectedTexts.sort())
    })
    it("uses type defaults", async () => {
      const infoClass = "info-class"
      const errorClass = "error-class"
      const { wrapper, toast } = await mountToastContainer({
        toastDefaults: {
          [TYPE.ERROR]: {
            toastClassName: errorClass,
          },
          [TYPE.INFO]: {
            toastClassName: infoClass,
          },
        },
      })

      const infoText = "info toast"
      const errorText = "error toast"

      toast.info(infoText)
      toast.error(errorText)
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(2)
      expect(wrapper.find(`.${infoClass}`).text()).toEqual(
        defaultToastMessage(infoText)
      )
      expect(wrapper.find(`.${errorClass}`).text()).toEqual(
        defaultToastMessage(errorText)
      )
    })

    it("filters before creating", async () => {
      const showText = "I'm a toast"
      const hideText = "do not show"
      const filterBeforeCreate: PluginOptions["filterBeforeCreate"] = toast =>
        toast.content === hideText ? false : toast
      const { wrapper, toast } = await mountToastContainer({
        filterBeforeCreate,
      })

      toast.info(showText)
      toast.info(hideText)
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(1)
      expect(wrapper.findComponent(VtToast).text()).toEqual(
        defaultToastMessage(showText)
      )
    })

    it("filters after creating", async () => {
      const showText = "I'm a toast"
      const hideText = "do not show"
      const filterToasts: PluginOptions["filterToasts"] = toasts =>
        toasts.filter(toast => toast.content !== hideText)
      const { wrapper, toast } = await mountToastContainer({
        filterToasts,
      })

      toast.info(showText)
      toast.info(hideText)
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(1)
      expect(wrapper.findComponent(VtToast).text()).toEqual(
        defaultToastMessage(showText)
      )
    })

    it("does nothing if filterToasts is undefined", async () => {
      const showText = "I'm a toast"
      const hideText = "do not show"
      const { wrapper, toast } = await mountToastContainer({
        filterToasts: undefined,
      })

      toast.info(showText)
      toast.info(hideText)
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(2)
    })

    it("does not create if toastID is undefined", async () => {
      const { wrapper, eventBus } = await mountToastContainer()
      expect(wrapper.findAllComponents(VtToast).length).toBe(0)

      const content = "I'm a toast"
      eventBus.emit(EVENTS.ADD, { content, id: undefined as unknown as number })
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(0)
    })
  })
  describe("dismiss toast", () => {
    it("dismisses existing toast", async () => {
      const { wrapper, toast } = await mountToastContainer()

      const message = "I'm a toast"
      const toastID = toast.info(message)
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(1)

      toast.dismiss(toastID)
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(0)
    })

    it("do not dismiss if wrong toastID", async () => {
      const { wrapper, toast } = await mountToastContainer()

      const message = "I'm a toast"
      const toastID = toast.info(message)
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(1)

      toast.dismiss(`not-${toastID}`)
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(1)
    })

    it("calls onClose when dismissing", async () => {
      const { toast } = await mountToastContainer()

      const onClose = jest.fn()
      const toastID = toast.info("I'm a toast", { onClose })
      await nextTick()

      expect(onClose).not.toHaveBeenCalled()

      toast.dismiss(toastID)
      await nextTick()

      expect(onClose).toHaveBeenCalled()
    })
  })
  describe("clear toasts", () => {
    it("clears all toasts", async () => {
      const { wrapper, toast } = await mountToastContainer()

      const message = "I'm a toast"
      toast.info(message)
      toast.info(message)
      toast.info(message)
      toast.info(message)
      toast.info(message)
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(5)

      toast.clear()
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(0)
    })
  })
  describe("update toast", () => {
    it("update an existing toast property", async () => {
      const { wrapper, toast } = await mountToastContainer()

      const className = "myclass"
      const otherClassName = "otherclass"
      const toastID = toast.info("I'm a toast", { bodyClassName: className })
      await nextTick()

      expect(wrapper.find(`.${className}`).exists()).toBe(true)
      expect(wrapper.find(`.${otherClassName}`).exists()).toBe(false)

      toast.update(toastID, { options: { bodyClassName: otherClassName } })
      await nextTick()

      expect(wrapper.find(`.${className}`).exists()).toBe(false)
      expect(wrapper.find(`.${otherClassName}`).exists()).toBe(true)
    })

    it("adds a new toast property", async () => {
      const { wrapper, toast } = await mountToastContainer()

      const className = "myclass"
      const toastID = toast.info("I'm a toast")
      await nextTick()

      expect(wrapper.find(`.${className}`).exists()).toBe(false)

      toast.update(toastID, { options: { bodyClassName: className } })
      await nextTick()

      expect(wrapper.find(`.${className}`).exists()).toBe(true)
    })

    it("updates the content", async () => {
      const { wrapper, toast } = await mountToastContainer()

      const oldContent = "foo"
      const newContent = "bar"
      const toastID = toast.info(oldContent)
      await nextTick()

      expect(wrapper.findComponent(VtToast).text()).toBe(
        defaultToastMessage(oldContent)
      )

      toast.update(toastID, { content: newContent })
      await nextTick()

      expect(wrapper.findComponent(VtToast).text()).toBe(
        defaultToastMessage(newContent)
      )
    })

    it("resets timeout", async () => {
      const { wrapper, toast } = await mountToastContainer()

      const timeout = 3000
      const toastID = toast.info("I'm a toast", { timeout })
      await nextTick()

      const getStyles = () =>
        (wrapper.findComponent(VtProgressBar).element as HTMLElement).style
      expect(getStyles().animationDuration).toBe(`${timeout}ms`)

      toast.update(toastID, { options: { timeout } })
      await nextTick()

      expect(getStyles().animationDuration).toBe(`${timeout + 1}ms`)
    })

    it("creates and updates with .update()", async () => {
      const { wrapper, toast } = await mountToastContainer()

      const toastID = "my-id"
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(0)

      const content = "my toast"
      toast.update(toastID, { content }, true)
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(1)
      expect(wrapper.findComponent(VtToast).text()).toEqual(
        defaultToastMessage(content)
      )

      const newContent = "another"
      toast.update(toastID, { content: newContent }, true)
      await nextTick()

      expect(wrapper.findAllComponents(VtToast).length).toBe(1)
      expect(wrapper.findComponent(VtToast).text()).toEqual(
        defaultToastMessage(newContent)
      )
    })
  })
  describe("update defaults", () => {
    it("update a default property", async () => {
      const className = "my-class"
      const newClassName = "my-other-class"
      const { wrapper, toast } = await mountToastContainer({
        toastClassName: className,
      })

      toast.info("I'm a toast")
      await nextTick()

      expect(wrapper.find(`.${className}`).exists()).toBe(true)
      expect(wrapper.find(`.${newClassName}`).exists()).toBe(false)

      toast.updateDefaults({ toastClassName: newClassName })
      await nextTick()

      toast.info("I'm another toast")
      await nextTick()

      expect(wrapper.find(`.${className}`).exists()).toBe(true)
      expect(wrapper.find(`.${newClassName}`).exists()).toBe(true)
    })

    it("updates container", async () => {
      const container = document.createElement("div")

      const { wrapper, toast } = await mountToastContainer()

      // Should be other container
      expect(wrapper.element.parentElement).not.toBe(container)

      // Should be new container
      toast.updateDefaults({ container })
      await nextTick()

      expect(wrapper.element.parentElement).toBe(container)
    })
  })
})
