import { inject, InjectionKey, Plugin } from "vue"
import { EventBus, EventBusInterface } from "../eventBus"
import { VT_NAMESPACE } from "../constants"

const eventBusKey: InjectionKey<EventBusInterface> = Symbol("Event Bus")

export const globalEventBus = new EventBus()

export const eventBusPlugin: Plugin = (app, eventBus?: EventBusInterface) =>
  app.provide(eventBusKey, eventBus || new EventBus())

export const useEventBus = () => {
  const eventBus = inject(eventBusKey)
  if (!eventBus) {
    throw new Error(`[${VT_NAMESPACE}] useEventBus must be called from setup()`)
  }
  return eventBus
}
