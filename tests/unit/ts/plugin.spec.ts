import { App } from "vue"

import { isFunction } from "@vue/shared"

import { PluginOptions, ToastInterface, EventBus } from "../../../src"
import * as useToast from "../../../src/ts/composables/useToast"
import { globalEventBus } from "../../../src/ts/eventBus"
import * as plugin from "../../../src/ts/plugin"

// eslint-disable-next-line @typescript-eslint/ban-types
type AsFunction<T> = T extends Function ? T : never

const pluginFunction = plugin.VueToastificationPlugin as AsFunction<
  typeof plugin.VueToastificationPlugin
>

describe("plugin", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  describe("VueToastificationPlugin", () => {
    it("plugin is a function", () => {
      expect(isFunction(plugin.VueToastificationPlugin)).toBe(true)
    })
    it("provides default if no options", () => {
      const toast = {} as ToastInterface
      const createToastInstanceSpy = jest
        .spyOn(useToast, "createToastInstance")
        .mockImplementation(() => toast)

      const mockApp = { provide: jest.fn() } as unknown as App

      expect(createToastInstanceSpy).not.toHaveBeenCalled()

      pluginFunction(mockApp)

      expect(createToastInstanceSpy).toHaveBeenCalledWith({
        eventBus: globalEventBus,
      })
      expect(mockApp.provide).toHaveBeenCalledWith(
        useToast.toastInjectionKey,
        toast
      )
    })

    it("provides with options", () => {
      const toast = {} as ToastInterface
      const createToastInstanceSpy = jest
        .spyOn(useToast, "createToastInstance")
        .mockImplementation(() => toast)

      const mockApp = { provide: jest.fn() } as unknown as App

      expect(createToastInstanceSpy).not.toHaveBeenCalled()

      const options: PluginOptions = { timeout: 1000 }
      pluginFunction(mockApp, options)

      expect(createToastInstanceSpy).toHaveBeenCalledWith({
        eventBus: globalEventBus,
        timeout: 1000,
      })
      expect(mockApp.provide).toHaveBeenCalledWith(
        useToast.toastInjectionKey,
        toast
      )
    })

    it("provides custom eventBus if provided", () => {
      const toast = {} as ToastInterface
      const createToastInstanceSpy = jest
        .spyOn(useToast, "createToastInstance")
        .mockImplementation(() => toast)

      const mockApp = { provide: jest.fn() } as unknown as App

      expect(createToastInstanceSpy).not.toHaveBeenCalled()

      const eventBus = new EventBus()
      const options: PluginOptions = { eventBus }
      pluginFunction(mockApp, options)

      expect(createToastInstanceSpy).toHaveBeenCalledWith({
        eventBus,
      })
      expect(mockApp.provide).toHaveBeenCalledWith(
        useToast.toastInjectionKey,
        toast
      )
    })

    it("does not share app context by default", () => {
      const createToastInstanceSpy = jest
        .spyOn(useToast, "createToastInstance")
        .mockImplementation()

      const mockApp = { provide: jest.fn() } as unknown as App

      expect(createToastInstanceSpy).not.toHaveBeenCalled()

      pluginFunction(mockApp)

      expect(createToastInstanceSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({ shareAppContext: mockApp })
      )
    })

    it("shares app context if required", () => {
      const createToastInstanceSpy = jest
        .spyOn(useToast, "createToastInstance")
        .mockImplementation()

      const mockApp = { provide: jest.fn() } as unknown as App

      expect(createToastInstanceSpy).not.toHaveBeenCalled()

      pluginFunction(mockApp, { shareAppContext: true })

      expect(createToastInstanceSpy).toHaveBeenCalledWith(
        expect.objectContaining({ shareAppContext: mockApp })
      )
    })
  })
})
