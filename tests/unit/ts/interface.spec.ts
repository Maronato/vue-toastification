/* eslint-disable vue/one-component-per-file */
import { isFunction } from "@vue/shared"
import * as vue from "vue"
import { App, nextTick } from "vue"
import { EventBus } from "../../../src/index"
import { EVENTS, TYPE } from "../../../src/ts/constants"
import * as inter from "../../../src/ts/interface"
import VtToastContainer from "../../../src/components/VtToastContainer.vue"
import { PluginOptions } from "../../../src/types"

describe("interface", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  describe("buildInterface", () => {
    let eventBus: EventBus
    let eventsEmmited: Record<EVENTS, typeof jest.fn>

    beforeEach(() => {
      eventBus = new EventBus()
      eventsEmmited = Object.values(EVENTS).reduce((agg, eventName) => {
        const handler = jest.fn()
        eventBus.on(eventName, handler)
        return { ...agg, [eventName]: handler }
      }, {} as { [eventName in EVENTS]: jest.Mock })
    })

    it("creates valid interface by default", async () => {
      const mockApp = { mount: jest.fn() } as unknown as App
      jest.spyOn(vue, "createApp").mockImplementation(() => mockApp)
      const toast = inter.buildInterface()
      await nextTick()

      expect(isFunction(toast)).toBe(true)
      expect(isFunction(toast.info)).toBe(true)
      expect(isFunction(toast.success)).toBe(true)
      expect(isFunction(toast.warning)).toBe(true)
      expect(isFunction(toast.error)).toBe(true)
      expect(isFunction(toast.dismiss)).toBe(true)
      expect(isFunction(toast.clear)).toBe(true)
      expect(isFunction(toast.update)).toBe(true)
      expect(isFunction(toast.updateDefaults)).toBe(true)
    })

    it("uses provided eventBus", async () => {
      const mockApp = { mount: jest.fn() } as unknown as App
      const createAppSpy = jest
        .spyOn(vue, "createApp")
        .mockImplementation(() => mockApp)
      const toast = inter.buildInterface({ eventBus })

      expect(eventsEmmited.add).not.toHaveBeenCalled()

      const content = "hello"
      toast.success(content)

      expect(eventsEmmited.add).toHaveBeenCalledWith({
        id: expect.any(Number),
        type: TYPE.SUCCESS,
        content,
      })

      await nextTick()

      expect(createAppSpy).toHaveBeenCalledWith(VtToastContainer, { eventBus })
    })

    it("mounts container by default", async () => {
      const mockApp = { mount: jest.fn() } as unknown as App
      const createAppSpy = jest
        .spyOn(vue, "createApp")
        .mockImplementation(() => mockApp)

      inter.buildInterface()

      expect(mockApp.mount).not.toHaveBeenCalled()
      expect(createAppSpy).not.toHaveBeenCalled()
      await nextTick()

      expect(createAppSpy).toHaveBeenCalledWith(VtToastContainer, {
        eventBus: expect.any(EventBus),
      })
      expect(mockApp.mount).toHaveBeenCalled()
    })

    it("passes props to mouted container", async () => {
      const mockApp = { mount: jest.fn() } as unknown as App
      const createAppSpy = jest
        .spyOn(vue, "createApp")
        .mockImplementation(() => mockApp)

      const options: PluginOptions = {
        timeout: 1000,
        bodyClassName: "myclass",
      }
      inter.buildInterface(options)
      await nextTick()

      expect(createAppSpy).toHaveBeenCalledWith(VtToastContainer, {
        eventBus: expect.any(EventBus),
        ...options,
      })
      expect(mockApp.mount).toHaveBeenCalled()
    })

    it("calls onMounted", async () => {
      const component = {}
      const mockApp = { mount: jest.fn(() => component) } as unknown as App
      jest.spyOn(vue, "createApp").mockImplementation(() => mockApp)

      const onMounted = jest.fn()
      inter.buildInterface({ onMounted })

      expect(onMounted).not.toHaveBeenCalled()
      await nextTick()

      expect(onMounted).toHaveBeenCalledWith(component, mockApp)
    })

    it("shares app context", async () => {
      const mockApp = {
        mount: jest.fn(),
        _context: {},
        config: {},
      } as unknown as App
      jest.spyOn(vue, "createApp").mockImplementation(() => mockApp)

      const userApp = {
        _context: {
          components: "components",
          directives: "directives",
          mixins: "mixins",
          provides: "provides",
        },
        config: {
          globalProperties: "globalProperties",
        },
      } as unknown as App
      inter.buildInterface({ shareAppContext: userApp })

      await nextTick()

      expect(mockApp._context.components).toBe(userApp._context.components)
      expect(mockApp._context.directives).toBe(userApp._context.directives)
      expect(mockApp._context.mixins).toBe(userApp._context.mixins)
      expect(mockApp._context.provides).toBe(userApp._context.provides)
      expect(mockApp.config.globalProperties).toBe(
        userApp.config.globalProperties
      )
    })
  })
})
