import { mount } from "@vue/test-utils"
import { defineComponent, h } from "vue"
import { EventBus, PluginOptions, ToastInterface } from "../../../../src"
import * as useToast from "../../../../src/ts/composables/useToast"
import { VT_NAMESPACE } from "../../../../src/ts/constants"
import { globalEventBus } from "../../../../src/ts/eventBus"
import * as utils from "../../../../src/ts/utils"
import * as interfaceModule from "../../../../src/ts/interface"

const consumerInjected = jest.fn()

const Consumer = {
  setup() {
    const foo = useToast.useToast()
    consumerInjected(foo)
    return () => h("div", "hey")
  },
}

const createProvider = (options?: PluginOptions) =>
  defineComponent({
    setup() {
      useToast.provideToast(options)
      return () => h(Consumer)
    },
  })

const Provider = createProvider()

describe("useToast", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  describe("useToast", () => {
    it("returns existing toast interface if eventBus is provided", () => {
      const expected = {} as ToastInterface
      const createToastInstanceSpy = jest
        .spyOn(useToast, "createToastInstance")
        .mockImplementation(() => expected)

      expect(createToastInstanceSpy).not.toHaveBeenCalled()

      const eventBus = new EventBus()

      const actual = useToast.useToast(eventBus)

      expect(createToastInstanceSpy).toHaveBeenCalled()
      expect(actual).toBe(expected)
    })

    it("returns global toast interface if not called inside setup()", () => {
      const expected = {} as ToastInterface
      const createToastInstanceSpy = jest
        .spyOn(useToast, "createToastInstance")
        .mockImplementation(() => expected)

      expect(createToastInstanceSpy).not.toHaveBeenCalled()

      const actual = useToast.useToast()

      expect(createToastInstanceSpy).toHaveBeenCalledWith(globalEventBus)
      expect(actual).toBe(expected)
    })

    it("returns global toast interface if called in non-provided setup()", () => {
      const expected = {} as ToastInterface
      const createToastInstanceSpy = jest
        .spyOn(useToast, "createToastInstance")
        .mockImplementation(() => expected)

      expect(createToastInstanceSpy).not.toHaveBeenCalled()
      expect(consumerInjected).not.toHaveBeenCalled()

      mount(Consumer)

      expect(createToastInstanceSpy).toHaveBeenCalledWith(globalEventBus)
      expect(consumerInjected).toHaveBeenCalledWith(expected)
    })

    it("returns provided toast interface if called in provided setup()", () => {
      const expected = {} as ToastInterface
      const createToastInstanceSpy = jest
        .spyOn(useToast, "createToastInstance")
        .mockImplementation(() => expected)

      expect(createToastInstanceSpy).not.toHaveBeenCalled()
      expect(consumerInjected).not.toHaveBeenCalled()

      const options: PluginOptions = { timeout: 1000 }
      mount(createProvider(options))

      expect(createToastInstanceSpy).toHaveBeenCalledWith(options)
      expect(consumerInjected).toHaveBeenCalledWith(expected)
    })
  })

  describe("provideToast", () => {
    it("does nothing if not called inside setup()", () => {
      const createToastInstanceSpy = jest
        .spyOn(useToast, "createToastInstance")
        .mockImplementation()

      expect(createToastInstanceSpy).not.toHaveBeenCalled()
      useToast.provideToast()

      expect(createToastInstanceSpy).not.toHaveBeenCalled()
    })

    it("provides default if called inside setup()", () => {
      const expected = {} as ToastInterface
      const createToastInstanceSpy = jest
        .spyOn(useToast, "createToastInstance")
        .mockImplementation(() => expected)

      expect(createToastInstanceSpy).not.toHaveBeenCalled()
      expect(consumerInjected).not.toHaveBeenCalled()

      mount(Provider)

      expect(createToastInstanceSpy).toHaveBeenCalledWith(undefined)
      expect(consumerInjected).toHaveBeenCalledWith(expected)
    })

    it("provides with options if called inside setup()", () => {
      const expected = {} as ToastInterface
      const createToastInstanceSpy = jest
        .spyOn(useToast, "createToastInstance")
        .mockImplementation(() => expected)

      expect(createToastInstanceSpy).not.toHaveBeenCalled()
      expect(consumerInjected).not.toHaveBeenCalled()

      const options: PluginOptions = { timeout: 1000 }
      mount(createProvider(options))

      expect(createToastInstanceSpy).toHaveBeenCalledWith(options)
      expect(consumerInjected).toHaveBeenCalledWith(expected)
    })
  })

  describe("createToastInstance", () => {
    it("uses mock interface if not in browser", () => {
      const isBrowserSpy = jest.spyOn(utils, "isBrowser")
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation()
      isBrowserSpy.mockReturnValueOnce(false)

      const toast = useToast.createToastInstance()

      expect(consoleSpy).not.toHaveBeenCalled()
      toast("hey")
      toast.success("hey")
      expect(consoleSpy).toHaveBeenCalledTimes(2)
      expect(consoleSpy).toHaveBeenCalledWith(
        `[${VT_NAMESPACE}] This plugin does not support SSR!`
      )
    })

    it("builds interface using existing eventBus if provided", () => {
      const eventBus = new EventBus()
      const expected = {} as ToastInterface
      const buildInterfaceSpy = jest
        .spyOn(interfaceModule, "buildInterface")
        .mockImplementation(() => expected)

      expect(buildInterfaceSpy).not.toHaveBeenCalled()

      const actual = useToast.createToastInstance(eventBus)

      expect(buildInterfaceSpy).toHaveBeenCalledWith({ eventBus }, false)
      expect(actual).toBe(expected)
    })

    it("builds new interface using options if provided", () => {
      const expected = {} as ToastInterface
      const buildInterfaceSpy = jest
        .spyOn(interfaceModule, "buildInterface")
        .mockImplementation(() => expected)

      expect(buildInterfaceSpy).not.toHaveBeenCalled()

      const options: PluginOptions = { timeout: 1000 }
      const actual = useToast.createToastInstance(options)

      expect(buildInterfaceSpy).toHaveBeenCalledWith(options, true)
      expect(actual).toBe(expected)
    })

    it("builds default interface if no options are provided", () => {
      const expected = {} as ToastInterface
      const buildInterfaceSpy = jest
        .spyOn(interfaceModule, "buildInterface")
        .mockImplementation(() => expected)

      expect(buildInterfaceSpy).not.toHaveBeenCalled()

      const actual = useToast.createToastInstance()

      expect(buildInterfaceSpy).toHaveBeenCalledWith(undefined, true)
      expect(actual).toBe(expected)
    })
  })
})
