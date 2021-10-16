import { loadPlugin } from "../../utils/plugin"
import {
  PluginOptions,
  ToastID,
  ToastOptionsAndContent,
  ToastOptionsAndRequiredContent,
} from "../../../src/types"
import { POSITION, TYPE, VT_NAMESPACE } from "../../../src/ts/constants"
import { PluginOptionsType } from "../../../src/ts/propValidators"
import Simple from "../../utils/components/Simple.vue"
import { isProxy, reactive, toRaw } from "vue"

describe("VtToastContainer", () => {
  it("snapshots with default value", async () => {
    const { containerWrapper } = await loadPlugin()
    expect(containerWrapper.element).toMatchSnapshot()
  })
  it("snapshots with classes", async () => {
    const { containerWrapper } = await loadPlugin({
      containerClassName: "myclass",
    })
    expect(containerWrapper.element).toMatchSnapshot()
  })
  describe("setup", () => {
    it("removes element and reassigns", async () => {
      const { containerWrapper } = await loadPlugin()
      const container = document.createElement("div")
      const vm = containerWrapper.vm as unknown as {
        setup(container: HTMLElement): void
      }
      expect(containerWrapper.element.parentElement).not.toBe(container)
      vm.setup(container)
      expect(containerWrapper.element.parentElement).toBe(container)
    })
    it("accepts function container", async () => {
      const { containerWrapper } = await loadPlugin()
      const container = document.createElement("div")
      const vm = containerWrapper.vm as unknown as {
        setup(container: () => HTMLElement): void
      }
      expect(containerWrapper.element.parentElement).not.toBe(container)
      vm.setup(() => container)
      await containerWrapper.vm.$nextTick()
      expect(containerWrapper.element.parentElement).toBe(container)
    })
    it("accepts async container", async () => {
      const { containerWrapper } = await loadPlugin()
      const container = document.createElement("div")
      const vm = containerWrapper.vm as unknown as {
        setup(container: () => Promise<HTMLElement>): void
      }
      expect(containerWrapper.element.parentElement).not.toBe(container)
      vm.setup(() => new Promise(resolve => resolve(container)))
      await containerWrapper.vm.$nextTick()
      expect(containerWrapper.element.parentElement).toBe(container)
    })
  })
  describe("setToast", () => {
    it("sets toast with id", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        setToast(props: ToastOptionsAndRequiredContent): void
        toasts: { [toastID: string]: ToastOptionsAndRequiredContent }
      }
      expect(vm.toasts).toEqual({})
      const toast: ToastOptionsAndRequiredContent = {
        content: "abc",
        id: "id",
      }
      vm.setToast(toast)
      expect(vm.toasts).toEqual({ id: toast })
    })
    it("ignores toast without id", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        setToast(props: ToastOptionsAndRequiredContent): void
        toasts: { [toastID: string]: ToastOptionsAndRequiredContent }
      }
      expect(vm.toasts).toEqual({})
      const toast: ToastOptionsAndRequiredContent = { content: "abc" }
      vm.setToast(toast)
      expect(vm.toasts).toEqual({})
    })
  })
  describe("addToast", () => {
    it("uses default values if nothing was provided", async () => {
      const filterBeforeCreate = jest.fn(toast => toast)
      const { containerWrapper } = await loadPlugin({ filterBeforeCreate })
      const vm = containerWrapper.vm as unknown as {
        addToast(params: ToastOptionsAndRequiredContent): void
        defaults: PluginOptions
      }
      const toast: ToastOptionsAndRequiredContent = { content: "abc" }
      expect(filterBeforeCreate).not.toHaveBeenCalled()
      vm.addToast(toast)
      expect(filterBeforeCreate).toHaveBeenCalledWith(
        { ...vm.defaults, ...toast },
        []
      )
    })
    it("merges default with params", async () => {
      const filterBeforeCreate = jest.fn(toast => toast)
      const { containerWrapper } = await loadPlugin({ filterBeforeCreate })
      const vm = containerWrapper.vm as unknown as {
        addToast(params: ToastOptionsAndRequiredContent): void
        defaults: PluginOptions
      }
      const toast: ToastOptionsAndRequiredContent = {
        content: "abc",
        timeout: 1000,
        closeButton: false,
      }
      expect(filterBeforeCreate).not.toHaveBeenCalled()
      vm.addToast(toast)
      expect(filterBeforeCreate).toHaveBeenCalledWith(
        { ...vm.defaults, ...toast },
        []
      )
    })
    it("merges default for toast type with params", async () => {
      const filterBeforeCreate = jest.fn(toast => toast)
      const toastDefaults = {
        [TYPE.SUCCESS]: {
          timeout: 1000,
          closeButton: false as const,
        },
      }
      const { containerWrapper } = await loadPlugin({
        filterBeforeCreate,
        toastDefaults,
      })
      const vm = containerWrapper.vm as unknown as {
        addToast(params: ToastOptionsAndRequiredContent): void
        defaults: PluginOptions
      }
      const toast: ToastOptionsAndRequiredContent & {
        type: TYPE.SUCCESS
      } = {
        type: TYPE.SUCCESS,
        content: "abc",
      }
      expect(filterBeforeCreate).not.toHaveBeenCalled()
      vm.addToast(toast)
      expect(filterBeforeCreate).toHaveBeenCalledWith(
        { ...vm.defaults, ...toastDefaults[toast.type], ...toast },
        []
      )
    })
    it("uses default filterBeforeCreate if defined", async () => {
      const filterBeforeCreate = jest.fn(toast => toast)
      const toastDefaults = {
        [TYPE.SUCCESS]: {
          timeout: 1000,
          closeButton: false as const,
        },
      }
      const { containerWrapper } = await loadPlugin({
        filterBeforeCreate,
        toastDefaults,
      })
      const vm = containerWrapper.vm as unknown as {
        addToast(params: ToastOptionsAndRequiredContent): void
        defaults: PluginOptions
      }
      const toast: ToastOptionsAndRequiredContent & {
        type: TYPE.SUCCESS
      } = {
        type: TYPE.SUCCESS,
        content: "abc",
      }
      expect(filterBeforeCreate).not.toHaveBeenCalled()
      vm.addToast(toast)
      expect(filterBeforeCreate).toHaveBeenCalledWith(
        { ...vm.defaults, ...toastDefaults[toast.type], ...toast },
        []
      )
    })
    it("uses default filterBeforeCreate", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        addToast(params: ToastOptionsAndRequiredContent): void
        defaults: PluginOptionsType
      }

      const filterBeforeCreate = jest.spyOn(vm.defaults, "filterBeforeCreate")
      const toast: ToastOptionsAndRequiredContent = { content: "abc" }
      expect(filterBeforeCreate).not.toHaveBeenCalled()
      vm.addToast(toast)
      expect(filterBeforeCreate).toHaveBeenCalled()
    })
    it("uses custom filterBeforeCreate", async () => {
      const filterBeforeCreate = jest.fn(toast => toast)
      const { containerWrapper } = await loadPlugin({ filterBeforeCreate })
      const vm = containerWrapper.vm as unknown as {
        addToast(params: ToastOptionsAndRequiredContent): void
      }
      const toast: ToastOptionsAndRequiredContent = { content: "abc" }
      expect(filterBeforeCreate).not.toHaveBeenCalled()
      vm.addToast(toast)
      expect(filterBeforeCreate).toHaveBeenCalled()
    })
    it("set toast if passes filterBeforeCreate", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        setToast(params: ToastOptionsAndRequiredContent): void
        addToast(params: ToastOptionsAndRequiredContent): void
        defaults: PluginOptions
      }

      const spySetToast = (vm.setToast = jest.fn(vm.setToast))
      const toast: ToastOptionsAndRequiredContent = { content: "abc" }
      expect(spySetToast).not.toHaveBeenCalled()
      vm.addToast(toast)
      expect(spySetToast).toHaveBeenCalledWith({ ...vm.defaults, ...toast })
    })
    it("set toast is raw", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        setToast(params: ToastOptionsAndRequiredContent): void
        addToast(params: ToastOptionsAndRequiredContent): void
      }
      let normalizedToast: ToastOptionsAndRequiredContent = {
        content: "undefined",
      }
      const spySetToast = (vm.setToast = jest.fn(t => (normalizedToast = t)))
      const toast: ToastOptionsAndRequiredContent = {
        content: reactive(Simple),
      }
      expect(isProxy(toast.content)).toBe(true)
      expect(spySetToast).not.toHaveBeenCalled()
      expect(normalizedToast.content).not.toBe(toRaw(toast.content))
      vm.addToast(toast)
      expect(normalizedToast.content).toBe(toRaw(toast.content))
      expect(isProxy(normalizedToast.content)).toBe(false)
    })
    it("does not set toast if fails filterBeforeCreate", async () => {
      const filterBeforeCreate = jest.fn((): false => false)
      const { containerWrapper } = await loadPlugin({ filterBeforeCreate })
      const vm = containerWrapper.vm as unknown as {
        setToast(params: ToastOptionsAndRequiredContent): void
        addToast(params: ToastOptionsAndRequiredContent): void
      }
      const spySetToast = (vm.setToast = jest.fn(vm.setToast))
      const toast: ToastOptionsAndRequiredContent = { content: "abc" }
      expect(spySetToast).not.toHaveBeenCalled()
      vm.addToast(toast)
      expect(spySetToast).not.toHaveBeenCalled()
    })
  })
  describe("dismissToast", () => {
    it("dismisses toast", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        dismissToast(id: ToastID): void
        setToast(params: ToastOptionsAndRequiredContent): void
        toasts: { [toastId: string]: ToastOptionsAndRequiredContent }
      }
      expect(vm.toasts).toEqual({})
      const toastContent = { id: 10, content: "content" }
      vm.setToast(toastContent)
      expect(vm.toasts).toEqual({ "10": expect.objectContaining(toastContent) })
      vm.dismissToast(10)
      expect(vm.toasts).toEqual({})
    })
    it("calls onClose if set", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        dismissToast(id: ToastID): void
        setToast(params: ToastOptionsAndRequiredContent): void
        toasts: { [toastId: string]: ToastOptionsAndRequiredContent }
      }
      const onClose = jest.fn()
      const toastContent = { id: 10, content: "content", onClose }

      expect(vm.toasts).toEqual({})
      vm.setToast(toastContent)
      expect(vm.toasts).toEqual({ "10": expect.objectContaining(toastContent) })
      expect(onClose).not.toHaveBeenCalled()
      vm.dismissToast(10)
      expect(onClose).toHaveBeenCalled()
      expect(vm.toasts).toEqual({})
    })
  })
  describe("clearToasts", () => {
    it("clears toasts", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        dismissToast(id: ToastID): void
        clearToasts(): void
        setToast(params: ToastOptionsAndRequiredContent): void
        toasts: { [toastId: string]: ToastOptionsAndRequiredContent }
      }

      const getContent = (id: number) => ({ id, content: `content${id}` })

      vm.setToast(getContent(1))
      vm.setToast(getContent(2))
      vm.setToast(getContent(3))

      expect(vm.toasts).toEqual({
        "1": expect.objectContaining(getContent(1)),
        "2": expect.objectContaining(getContent(2)),
        "3": expect.objectContaining(getContent(3)),
      })

      vm.clearToasts()
      expect(vm.toasts).toEqual({})
    })
  })
  describe("getPositionToasts", () => {
    it("gets toast from position", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        getPositionToasts(position: POSITION): ToastOptionsAndRequiredContent[]
        setToast(params: ToastOptionsAndRequiredContent): void
      }
      vm.setToast({
        id: 1,
        content: "content1",
        position: POSITION.TOP_CENTER,
      })
      vm.setToast({ id: 2, content: "content1", position: POSITION.TOP_RIGHT })
      const topCenterIds = vm
        .getPositionToasts(POSITION.TOP_CENTER)
        .map(t => t.id)
      const topRightIds = vm
        .getPositionToasts(POSITION.TOP_RIGHT)
        .map(t => t.id)
      const topLeftIds = vm.getPositionToasts(POSITION.TOP_LEFT).map(t => t.id)
      expect(topCenterIds).toEqual([1])
      expect(topRightIds).toEqual([2])
      expect(topLeftIds).toEqual([])
    })
    it("regular ordering if newestOnTop is false", async () => {
      const { containerWrapper: containerWrapper1 } = await loadPlugin({
        newestOnTop: false,
      })
      const vm = containerWrapper1.vm as unknown as {
        getPositionToasts(position: POSITION): ToastOptionsAndRequiredContent[]
        setToast(params: ToastOptionsAndRequiredContent): void
      }
      vm.setToast({ id: 1, content: "content1", position: POSITION.TOP_RIGHT })
      vm.setToast({ id: 2, content: "content2", position: POSITION.TOP_RIGHT })
      vm.setToast({ id: 3, content: "content3", position: POSITION.TOP_RIGHT })
      const topRightIds = vm
        .getPositionToasts(POSITION.TOP_RIGHT)
        .map(t => t.id)
      expect(topRightIds).toEqual([1, 2, 3])
    })
    it("reverse ordering if newestOnTop is true", async () => {
      const { containerWrapper: containerWrapper1 } = await loadPlugin({
        newestOnTop: true,
      })
      const vm = containerWrapper1.vm as unknown as {
        getPositionToasts(position: POSITION): ToastOptionsAndRequiredContent[]
        setToast(params: ToastOptionsAndRequiredContent): void
      }
      vm.setToast({ id: 1, content: "content1", position: POSITION.TOP_RIGHT })
      vm.setToast({ id: 2, content: "content2", position: POSITION.TOP_RIGHT })
      vm.setToast({ id: 3, content: "content3", position: POSITION.TOP_RIGHT })
      const topRightIds = vm
        .getPositionToasts(POSITION.TOP_RIGHT)
        .map(t => t.id)
      expect(topRightIds).toEqual([3, 2, 1])
    })
  })
  describe("updateDefaults", () => {
    it("updates defaults", async () => {
      const { containerWrapper } = await loadPlugin({ timeout: 1000 })
      const vm = containerWrapper.vm as unknown as {
        updateDefaults(update: PluginOptions): void
        defaults: PluginOptions
      }
      expect(vm.defaults.timeout).toBe(1000)
      vm.updateDefaults({ timeout: 5000 })
      expect(vm.defaults.timeout).toBe(5000)
    })
    it("calls setup if container is present", async () => {
      const { containerWrapper } = await loadPlugin({ timeout: 1000 })
      const vm = containerWrapper.vm as unknown as {
        updateDefaults(update: PluginOptions): void
        defaults: PluginOptions
        setup(container: HTMLElement): void
      }
      const spySetup = (vm.setup = jest.fn(vm.setup))
      const container = document.createElement("div")
      expect(vm.defaults.container).not.toBe(container)
      expect(spySetup).not.toHaveBeenCalled()
      vm.updateDefaults({ container })
      expect(spySetup).toHaveBeenCalledWith(container)
      expect(vm.defaults.container).toBe(container)
    })
    it("applies new containerClassName", async () => {
      const { containerWrapper } = await loadPlugin({ timeout: 1000 })
      const vm = containerWrapper.vm as unknown as {
        updateDefaults(update: PluginOptions): void
        defaults: PluginOptions
      }
      expect(vm.defaults.containerClassName).toEqual([])
      expect(containerWrapper.find(".my-class").exists()).toBeFalsy()
      expect(containerWrapper.element).toMatchSnapshot()
      vm.updateDefaults({ containerClassName: "my-class" })
      await containerWrapper.vm.$nextTick()
      expect(vm.defaults.containerClassName).toBe("my-class")
      expect(containerWrapper.find(".my-class").exists()).toBeTruthy()
      expect(containerWrapper.element).toMatchSnapshot()
    })
  })
  describe("updateToast", () => {
    it("updates existing toast", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        updateToast({
          id,
          options,
          create,
        }: {
          id: ToastID
          options: ToastOptionsAndContent
          create: boolean
        }): void
        setToast(params: ToastOptionsAndRequiredContent): void
        toasts: { [toastID: string]: ToastOptionsAndRequiredContent }
      }
      const toast: ToastOptionsAndRequiredContent = {
        id: "id1",
        content: "content",
      }
      vm.setToast(toast)
      expect(vm.toasts["id1"].content).toBe("content")
      vm.updateToast({
        id: "id1",
        options: { content: "other" },
        create: false,
      })
      expect(vm.toasts["id1"].content).toBe("other")
    })
    it("increases timeout if it is the same", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        updateToast({
          id,
          options,
          create,
        }: {
          id: ToastID
          options: ToastOptionsAndContent
          create: boolean
        }): void
        setToast(params: ToastOptionsAndRequiredContent): void
        toasts: { [toastID: string]: ToastOptionsAndRequiredContent }
      }
      const toast: ToastOptionsAndRequiredContent = {
        id: "id1",
        content: "content",
        timeout: 1000,
      }
      vm.setToast(toast)
      expect(vm.toasts["id1"].timeout).toBe(1000)
      vm.updateToast({ id: "id1", options: { timeout: 1000 }, create: false })
      expect(vm.toasts["id1"].timeout).toBe(1001)
    })
    it("creates new toast if create is true", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        updateToast({
          id,
          options,
          create,
        }: {
          id: ToastID
          options: ToastOptionsAndContent
          create: boolean
        }): void
        addToast(params: ToastOptionsAndRequiredContent): void
        toasts: { [toastID: string]: ToastOptionsAndRequiredContent }
      }
      expect(vm.toasts["id1"]).toBe(undefined)
      vm.updateToast({
        id: "id1",
        options: { content: "content" },
        create: true,
      })
      expect(vm.toasts["id1"]).not.toBe(undefined)
      expect(vm.toasts["id1"].content).toBe("content")
    })
    it("ignores if missing toast and not create", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        updateToast({
          id,
          options,
          create,
        }: {
          id: ToastID
          options: ToastOptionsAndContent
          create: boolean
        }): void
        addToast(params: ToastOptionsAndRequiredContent): void
        toasts: { [toastID: string]: ToastOptionsAndRequiredContent }
      }
      expect(vm.toasts["id1"]).toBe(undefined)
      vm.updateToast({
        id: "id1",
        options: { content: "content" },
        create: false,
      })
      expect(vm.toasts["id1"]).toBe(undefined)
    })
  })
  describe("getClasses", () => {
    it("returns classes", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        getClasses(position: POSITION): string[]
      }
      const position = POSITION.BOTTOM_RIGHT
      expect(vm.getClasses(position)).toEqual([
        `${VT_NAMESPACE}__container`,
        position,
      ])
    })
  })
  describe("toastArray", () => {
    it("maps array", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        toastArray: ToastOptionsAndRequiredContent[]
        setToast(params: ToastOptionsAndRequiredContent): void
      }
      expect(vm.toastArray.map(t => t.id)).toEqual([])
      vm.setToast({ id: "1", content: "abc" })
      expect(vm.toastArray.map(t => t.id)).toEqual(["1"])
      vm.setToast({ id: "2", content: "def" })
      expect(vm.toastArray.map(t => t.id)).toEqual(["1", "2"])
    })
  })
  describe("filteredToasts", () => {
    it("filters toasts with default filterToasts", async () => {
      const { containerWrapper } = await loadPlugin()
      const vm = containerWrapper.vm as unknown as {
        filteredToasts: ToastOptionsAndRequiredContent[]
        setToast(params: ToastOptionsAndRequiredContent): void
      }
      vm.setToast({ id: "1", content: "abc" })
      vm.setToast({ id: "2", content: "def" })
      expect(vm.filteredToasts.map(t => t.id)).toEqual(["1", "2"])
    })
    it("filters toasts with provided filterToasts", async () => {
      const filterToasts = jest.fn(() => [])
      expect(filterToasts).not.toHaveBeenCalled()
      const { containerWrapper } = await loadPlugin({ filterToasts })
      const vm = containerWrapper.vm as unknown as {
        filteredToasts: ToastOptionsAndRequiredContent[]
        setToast(params: ToastOptionsAndRequiredContent): void
        toastArray: ToastOptionsAndRequiredContent[]
      }
      expect(filterToasts).toHaveBeenCalledTimes(1)
      expect(filterToasts).toHaveBeenCalledWith([])
      vm.setToast({ id: "1", content: "abc" })
      vm.setToast({ id: "2", content: "def" })
      expect(filterToasts).toHaveBeenCalledTimes(1)
      expect(vm.filteredToasts).toEqual([])
      expect(filterToasts).toHaveBeenCalledTimes(2)
      expect(filterToasts).toHaveBeenCalledWith(vm.toastArray)
    })
  })
})
