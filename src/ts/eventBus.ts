import type { ToastID } from "../types/common"
import type {
  ToastOptionsAndContent,
  ToastContent,
  ToastOptions,
} from "../types/toast"
import type { ToastContainerOptions } from "../types/toastContainer"
import type { EVENTS } from "./constants"

import { hasProp, isFunction } from "./utils"

type EventData = {
  [EVENTS.ADD]: ToastOptionsAndContent & {
    id: ToastID
  }
  [EVENTS.CLEAR]: undefined
  [EVENTS.DISMISS]: ToastID
  [EVENTS.UPDATE]:
    | {
        id: ToastID
        options: Partial<ToastOptions> & { content?: ToastContent }
        create: false
      }
    | {
        id: ToastID
        options: Partial<ToastOptions> & { content: ToastContent }
        create: true
      }
  [EVENTS.UPDATE_DEFAULTS]: ToastContainerOptions
}

type Handler<E extends EVENTS> = (event: EventData[E]) => void

export interface EventBusInterface {
  on<E extends EVENTS>(eventType: E, handler: Handler<E>): void
  off<E extends EVENTS>(eventType: E, handler: Handler<E>): void
  emit<E extends EVENTS>(eventType: E, event: EventData[E]): void
}

type HandlerList<E extends EVENTS> = Handler<E>[]

type HandlerMap = {
  [E in EVENTS]?: HandlerList<E>
}

export class EventBus implements EventBusInterface {
  protected allHandlers: HandlerMap = {}

  protected getHandlers<E extends EVENTS>(eventType: E) {
    return (this.allHandlers[eventType] as HandlerList<E> | undefined) || []
  }

  public on<E extends EVENTS>(eventType: E, handler: Handler<E>) {
    const handlers = this.getHandlers(eventType)
    handlers.push(handler)
    this.allHandlers[eventType] = handlers as EventBus["allHandlers"][E]
  }
  public off<E extends EVENTS>(eventType: E, handler: Handler<E>) {
    const handlers = this.getHandlers(eventType)
    handlers.splice(handlers.indexOf(handler) >>> 0, 1)
  }
  public emit<E extends EVENTS>(eventType: E, event: EventData[E]) {
    const handlers = this.getHandlers(eventType)
    handlers.forEach(handler => handler(event))
  }
}

export const isEventBusInterface = (e: unknown): e is EventBusInterface =>
  ["on", "off", "emit"].every(f => hasProp(e, f) && isFunction(e[f]))

export const globalEventBus = new EventBus()
