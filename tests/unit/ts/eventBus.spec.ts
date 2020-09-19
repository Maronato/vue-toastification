import { EVENTS } from "../../../src/ts/constants"
import {
  EventBus,
  isEventBusInterface,
  EventBusInterface,
} from "../../../src/ts/eventBus"

describe("EventBus", () => {
  it("creates eventbus", () => {
    expect(() => new EventBus()).not.toThrow()
    expect(new EventBus()).toEqual(expect.any(EventBus))
  })
  it("subscribes to events", () => {
    const eventBus = new EventBus()
    const handler = jest.fn()
    const eventName = EVENTS.DISMISS

    expect(eventBus["allHandlers"]).toEqual({})

    eventBus.on(eventName, handler)

    expect(eventBus["allHandlers"]).toEqual(
      expect.objectContaining({
        [EVENTS.DISMISS]: expect.arrayContaining([handler]),
      })
    )
  })

  it("unsubscribes from events", () => {
    const eventBus = new EventBus()
    const handler = jest.fn()
    const eventName = EVENTS.DISMISS

    eventBus.on(eventName, handler)
    eventBus.off(eventName, handler)

    expect(eventBus["allHandlers"]).toEqual(
      expect.objectContaining({ [EVENTS.DISMISS]: [] })
    )
  })

  it("emits events", () => {
    const eventBus = new EventBus()
    const handler1 = jest.fn()
    const handler2 = jest.fn()
    const eventName = EVENTS.DISMISS

    expect(eventBus["allHandlers"]).toEqual({})

    eventBus.on(eventName, handler1)
    eventBus.on(eventName, handler2)

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).not.toHaveBeenCalled()

    eventBus.emit(eventName, 1)

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
    expect(handler1).toBeCalledWith(1)
    expect(handler2).toBeCalledWith(1)
  })
})

describe("isEventBusInterface", () => {
  it("detects EventBus", () => {
    expect(isEventBusInterface(new EventBus())).toBe(true)
  })

  it("detects invalid interface", () => {
    expect(isEventBusInterface("foo")).toBe(false)
  })

  it("detects generic interface", () => {
    class GenericEventBus implements EventBusInterface {
      on() {
        return
      }
      off() {
        return
      }
      emit() {
        return
      }
    }
    expect(isEventBusInterface(new GenericEventBus())).toBe(true)
  })
})
