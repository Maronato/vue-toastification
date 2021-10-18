import * as vue from "vue"
import { mount } from "@vue/test-utils"
import * as index from "../../src/index"
import * as ToastInterfaceModule from "../../src/ts/interface"
import * as utils from "../../src/ts/utils"
import { defineComponent, nextTick } from "vue"
import { VT_NAMESPACE } from "../../src/ts/constants"

const consumerInjected = jest.fn()

const Consumer = {
  setup() {
    const foo = index.useToast()
    consumerInjected(foo)
    return () => vue.h("div", "hey")
  },
}

const createProvider = (options?: index.PluginOptions) =>
  defineComponent({
    setup() {
      index.provideToast(options)
      return () => vue.h(Consumer)
    },
  })

const Provider = createProvider()

const Middle = {
  render: () => vue.h(Consumer),
}

const Parent = {
  setup() {
    return () => vue.h(Middle)
  },
}

const toastInterfaceLike = expect.objectContaining({
  info: expect.any(Function),
  success: expect.any(Function),
  error: expect.any(Function),
  warning: expect.any(Function),
})

describe("exports", () => {
  it("exports constants", () => {
    expect(typeof index.TYPE).toEqual("object")
    expect(typeof index.POSITION).toEqual("object")
    expect(typeof index.toastInjectionKey).toEqual("symbol")
  })
  it("exports classes", () => {
    expect(typeof index.EventBus).toEqual("function")
  })
  it("exports functions", () => {
    expect(typeof index.createToastInterface).toEqual("function")
    expect(typeof index.provideToast).toEqual("function")
    expect(typeof index.useToast).toEqual("function")
  })
  it("exports default", () => {
    expect(typeof index.default).toEqual("function")
  })
})

describe("Toast Plugin", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("Loads plugin", () => {
    const app = vue.createApp(Parent)
    const provideSpy = jest.spyOn(app, "provide")

    expect(provideSpy).toHaveBeenCalledTimes(0)

    app.use(index.default)

    expect(provideSpy).toHaveBeenCalledTimes(1)
    expect(provideSpy).toHaveBeenCalledWith(
      index.toastInjectionKey,
      toastInterfaceLike
    )

    expect(consumerInjected).toHaveBeenCalledTimes(0)
    app.mount(document.createElement("div"))

    expect(consumerInjected).toHaveBeenCalledTimes(1)
    expect(consumerInjected).toHaveBeenCalledWith(toastInterfaceLike)
  })
  it("Sends `app` to interface if shareAppContext", () => {
    const app = vue.createApp(Parent)
    const interfaceSpy = jest.spyOn(index, "createToastInterface")

    expect(interfaceSpy).toHaveBeenCalledTimes(0)

    app.use(index.default, { shareAppContext: true })

    expect(interfaceSpy).toHaveBeenCalledTimes(1)
    expect(interfaceSpy).toHaveBeenCalledWith(
      expect.objectContaining({ shareAppContext: app })
    )
  })
})

describe("createToastInterface", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it("registers interface", () => {
    const toast = index.createToastInterface()
    expect(toast).toEqual(toastInterfaceLike)
  })
  it("loads plugin options", async () => {
    const onMounted = jest.fn()
    const buildInterfaceSpy = jest.spyOn(ToastInterfaceModule, "buildInterface")

    expect(onMounted).not.toHaveBeenCalled()
    expect(buildInterfaceSpy).not.toHaveBeenCalled()

    index.createToastInterface({ onMounted })

    await nextTick()

    expect(onMounted).toHaveBeenCalled()
    expect(buildInterfaceSpy).toHaveBeenCalledWith(
      expect.objectContaining({ onMounted }),
      true
    )
  })
  it("accepts a single eventBus argument", () => {
    const eventBus = new index.EventBus()
    const buildInterfaceSpy = jest.spyOn(ToastInterfaceModule, "buildInterface")
    expect(buildInterfaceSpy).not.toHaveBeenCalled()
    const toast = index.createToastInterface(eventBus)
    expect(toast).toEqual(toastInterfaceLike)
    expect(buildInterfaceSpy).toHaveBeenCalledWith(
      expect.objectContaining({ eventBus }),
      false
    )
  })
  it("uses mock if not in browser", () => {
    const isBrowserSpy = jest.spyOn(utils, "isBrowser")
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation()
    isBrowserSpy.mockReturnValueOnce(false)

    const toast = index.createToastInterface()

    expect(consoleSpy).not.toHaveBeenCalled()
    toast("hey")
    toast.success("hey")
    expect(consoleSpy).toHaveBeenCalledTimes(2)
    expect(consoleSpy).toHaveBeenCalledWith(
      `[${VT_NAMESPACE}] This plugin does not support SSR!`
    )
  })
})

describe("provideToast", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it("provides default", () => {
    const provideSpy = jest.spyOn(vue, "provide")
    const createToastInterfaceSpy = jest.spyOn(index, "createToastInterface")

    expect(provideSpy).not.toHaveBeenCalled()
    expect(createToastInterfaceSpy).not.toHaveBeenCalled()

    mount(Provider)

    expect(provideSpy).toHaveBeenCalledTimes(1)
    expect(provideSpy).toHaveBeenCalledWith(
      index.toastInjectionKey,
      expect.anything()
    )
    expect(createToastInterfaceSpy).toHaveBeenCalledTimes(1)
    expect(createToastInterfaceSpy).toHaveBeenCalledWith(undefined)
  })

  it("provides with options", () => {
    const provideSpy = jest.spyOn(vue, "provide")
    const createToastInterfaceSpy = jest.spyOn(index, "createToastInterface")

    expect(provideSpy).not.toHaveBeenCalled()
    expect(createToastInterfaceSpy).not.toHaveBeenCalled()

    mount(createProvider({ maxToasts: 10, timeout: 100 }))

    expect(provideSpy).toHaveBeenCalledTimes(1)
    expect(provideSpy).toHaveBeenCalledWith(
      index.toastInjectionKey,
      expect.anything()
    )
    expect(createToastInterfaceSpy).toHaveBeenCalledTimes(1)
    expect(createToastInterfaceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        maxToasts: 10,
        timeout: 100,
      })
    )
  })

  it("does not provide if not in setup", () => {
    const provideSpy = jest.spyOn(vue, "provide")
    const createToastInterfaceSpy = jest.spyOn(index, "createToastInterface")

    expect(provideSpy).not.toHaveBeenCalled()
    expect(createToastInterfaceSpy).not.toHaveBeenCalled()

    index.provideToast()

    expect(provideSpy).toHaveBeenCalledTimes(0)
    expect(createToastInterfaceSpy).toHaveBeenCalledTimes(1)
    expect(createToastInterfaceSpy).toHaveBeenCalledWith(undefined)
  })
})

describe("useToast", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it("uses provided interface", async () => {
    const useToastSpy = jest.spyOn(index, "useToast")
    const injectSpy = jest.spyOn(vue, "inject")
    const createToastInterfaceSpy = jest.spyOn(index, "createToastInterface")

    expect(useToastSpy).not.toHaveBeenCalled()
    expect(injectSpy).not.toHaveBeenCalled()
    expect(createToastInterfaceSpy).not.toHaveBeenCalled()

    mount(Provider)

    await nextTick()

    expect(useToastSpy).toHaveBeenCalledTimes(1)
    expect(injectSpy).toHaveBeenCalledTimes(1)
    expect(injectSpy).toHaveReturnedWith(expect.anything())

    expect(createToastInterfaceSpy).toHaveBeenCalledTimes(1)
  })

  it("Works outside of components", async () => {
    const useToastSpy = jest.spyOn(index, "useToast")
    const injectSpy = jest.spyOn(vue, "inject")
    const createToastInterfaceSpy = jest.spyOn(index, "createToastInterface")
    const getCurrentInstanceSpy = jest.spyOn(vue, "getCurrentInstance")

    expect(useToastSpy).not.toHaveBeenCalled()
    expect(injectSpy).not.toHaveBeenCalled()
    expect(createToastInterfaceSpy).not.toHaveBeenCalled()
    expect(getCurrentInstanceSpy).not.toHaveBeenCalled()

    index.useToast()

    expect(useToastSpy).toHaveBeenCalledTimes(1)
    expect(getCurrentInstanceSpy).toHaveBeenCalledTimes(1)
    expect(getCurrentInstanceSpy).toHaveReturnedWith(null)
    expect(injectSpy).not.toHaveBeenCalled()
    expect(createToastInterfaceSpy).toHaveBeenCalledTimes(1)
    expect(createToastInterfaceSpy).toHaveBeenCalledWith(index.globalEventBus)
  })

  it("creates from eventBus", () => {
    const useToastSpy = jest.spyOn(index, "useToast")
    const injectSpy = jest.spyOn(vue, "inject")
    const createToastInterfaceSpy = jest.spyOn(index, "createToastInterface")

    expect(useToastSpy).not.toHaveBeenCalled()
    expect(injectSpy).not.toHaveBeenCalled()
    expect(createToastInterfaceSpy).not.toHaveBeenCalled()

    index.useToast(new index.EventBus())

    expect(useToastSpy).toHaveBeenCalledTimes(1)
    expect(injectSpy).toHaveBeenCalledTimes(0)
    expect(createToastInterfaceSpy).toHaveBeenCalledTimes(1)
    expect(createToastInterfaceSpy).toHaveBeenCalledWith(
      expect.any(index.EventBus)
    )
  })

  it("creates new interface if not provided", () => {
    const useToastSpy = jest.spyOn(index, "useToast")
    const injectSpy = jest.spyOn(vue, "inject")
    const createToastInterfaceSpy = jest.spyOn(index, "createToastInterface")

    expect(useToastSpy).not.toHaveBeenCalled()
    expect(injectSpy).not.toHaveBeenCalled()
    expect(createToastInterfaceSpy).not.toHaveBeenCalled()

    mount(Consumer)

    expect(useToastSpy).toHaveBeenCalledTimes(1)
    expect(injectSpy).toHaveBeenCalledTimes(1)
    expect(createToastInterfaceSpy).toHaveBeenCalledTimes(1)
    expect(createToastInterfaceSpy).toHaveBeenCalledWith(
      expect.any(index.EventBus)
    )
  })
})
