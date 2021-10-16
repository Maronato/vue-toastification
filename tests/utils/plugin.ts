import { App, ComponentPublicInstance, nextTick } from "vue"
import { DOMWrapper, VueWrapper } from "@vue/test-utils"
import { POSITION, createToastInterface } from "../../src/index"
import { PluginOptions } from "../../src/types"

type WithGetToasts<T extends DOMWrapper<Element>> = T & {
  getToasts(): DOMWrapper<Element>[]
}

const withGetToasts = <T extends DOMWrapper<Element>>(wrapper: T) => {
  ;(wrapper as WithGetToasts<T>).getToasts = () =>
    wrapper.findAll(".Vue-Toastification__toast")
  return wrapper as WithGetToasts<T>
}

const loadPlugin = async (options?: PluginOptions) => {
  // Isolate vue and container
  const container = document.createElement("div")
  let containerApp: App<Element> = {} as App<Element>
  let containerComp: ComponentPublicInstance = {} as ComponentPublicInstance
  const toastInterface = createToastInterface({
    container,
    onMounted: (component, app) => {
      containerApp = app
      containerComp = component
    },
    ...options,
  })
  await nextTick()
  const containerWrapper = new VueWrapper(containerApp, containerComp)

  const positionContainers = {
    topLeft: withGetToasts(containerWrapper.find(`.${POSITION.TOP_LEFT}`)),
    topCenter: withGetToasts(containerWrapper.find(`.${POSITION.TOP_CENTER}`)),
    topRight: withGetToasts(containerWrapper.find(`.${POSITION.TOP_RIGHT}`)),
    bottomLeft: withGetToasts(
      containerWrapper.find(`.${POSITION.BOTTOM_LEFT}`)
    ),
    bottomCenter: withGetToasts(
      containerWrapper.find(`.${POSITION.BOTTOM_CENTER}`)
    ),
    bottomRight: withGetToasts(
      containerWrapper.find(`.${POSITION.BOTTOM_RIGHT}`)
    ),
  }

  return { toastInterface, containerWrapper, ...positionContainers }
}

export { loadPlugin }
