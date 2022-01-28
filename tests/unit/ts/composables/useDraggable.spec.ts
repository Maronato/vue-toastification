/* eslint-disable vue/one-component-per-file */

import { mount } from "@vue/test-utils"
import {
  computed,
  defineComponent,
  h,
  nextTick,
  reactive,
  ref,
  onMounted,
  Ref,
} from "vue"
import { useDraggable } from "../../../../src/ts/composables/useDraggable"

const activeText = "dragging"
const inactiveText = "stopped"
const completeText = "complete"

type Props = Parameters<typeof useDraggable>[1]

const TestComponent = (getEl?: (el: Ref<HTMLElement | undefined>) => void) =>
  defineComponent({
    props: {
      draggablePercent: {
        type: Number,
        required: true,
      },
      draggable: {
        type: Boolean,
        required: true,
      },
    },
    setup(props) {
      const el = ref<HTMLElement>()
      onMounted(() => getEl && getEl(el))
      const { beingDragged, dragComplete } = useDraggable(el, props)
      const text = computed(() => {
        if (dragComplete.value) {
          return completeText
        }
        return beingDragged.value ? activeText : inactiveText
      })
      return () =>
        h("div", { ref: el, id: "outer" }, h("p", { id: "inner" }, text.value))
    },
  })

describe("useDraggable", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  const startPos: Pick<MouseEvent, "clientX" | "clientY"> = {
    clientX: 0,
    clientY: 0,
  }
  const clientRect: Omit<DOMRect, "toJSON"> = {
    x: startPos.clientX,
    y: startPos.clientY,
    right: 10,
    left: 0,
    bottom: 0,
    height: 0,
    width: 0,
    top: 0,
  }

  const getEl = (el: Ref<HTMLElement | undefined>) => {
    if (el.value) {
      jest
        .spyOn(el.value, "getBoundingClientRect")
        .mockImplementation(() => clientRect as DOMRect)
    }
  }

  const getDragDistance = (draggablePercent: number) =>
    (clientRect.right - clientRect.left) * draggablePercent

  it("Returns valid object", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation()

    const el = ref()
    const props = reactive<Props>({ draggable: true, draggablePercent: 0.6 })
    const retuned = useDraggable(el, props)

    // not-used-in-setup warnings
    expect(consoleSpy).toBeCalledTimes(2)

    expect(retuned.beingDragged.value).toBe(false)
    expect(retuned.dragComplete.value).toBe(false)
  })

  it("Mounts and unmounts", async () => {
    const props = reactive<Props>({ draggable: true, draggablePercent: 0.6 })
    const wrapper = mount(TestComponent(getEl), { props })

    const inner = wrapper.find("#inner")

    expect(inner.text()).toEqual(inactiveText)

    wrapper.unmount()
  })

  it("Does not drag if not draggable", async () => {
    const props = reactive<Props>({ draggable: false, draggablePercent: 0.6 })
    const wrapper = mount(TestComponent(getEl), { props })

    const outer = wrapper.find("#outer")
    const inner = wrapper.find("#inner")

    expect(inner.text()).toEqual(inactiveText)

    outer.element.dispatchEvent(
      new window.MouseEvent("mousedown", { ...startPos })
    )
    await nextTick()

    expect(inner.text()).toEqual(inactiveText)

    window.dispatchEvent(
      new window.MouseEvent("mousemove", {
        clientX: startPos.clientX + getDragDistance(0.6),
        clientY: startPos.clientY,
      })
    )
    await nextTick()
    expect(inner.text()).toEqual(inactiveText)
  })

  it("beingDragged not enough with mouse", async () => {
    const props = reactive<Props>({ draggable: true, draggablePercent: 0.6 })
    const wrapper = mount(TestComponent(getEl), { props })

    const outer = wrapper.find("#outer")
    const inner = wrapper.find("#inner")

    expect(inner.text()).toEqual(inactiveText)

    outer.element.dispatchEvent(
      new window.MouseEvent("mousedown", { ...startPos })
    )
    await nextTick()

    expect(inner.text()).toEqual(inactiveText)

    // Get current position and calculate a move that is not enough to complete the drag
    const dragDistance = getDragDistance(0.6) * 0.9
    window.dispatchEvent(
      new window.MouseEvent("mousemove", {
        clientX: startPos.clientX + dragDistance,
        clientY: startPos.clientY,
      })
    )
    await nextTick()
    expect(inner.text()).toEqual(activeText)

    // End the drag
    window.dispatchEvent(new window.MouseEvent("mouseup"))
    await nextTick()
    await new Promise(r => setTimeout(r))
    expect(inner.text()).toEqual(inactiveText)
  })

  it("beingDragged not enough with touch", async () => {
    const props = reactive<Props>({ draggable: true, draggablePercent: 0.6 })
    const wrapper = mount(TestComponent(getEl), { props })

    const outer = wrapper.find("#outer")
    const inner = wrapper.find("#inner")

    expect(inner.text()).toEqual(inactiveText)

    outer.element.dispatchEvent(
      new window.MouseEvent("touchstart", { ...startPos })
    )
    await nextTick()

    expect(inner.text()).toEqual(inactiveText)

    // Get current position and calculate a move that is not enough to complete the drag
    const dragDistance = getDragDistance(0.6) * 0.9
    window.dispatchEvent(
      new window.MouseEvent("touchmove", {
        clientX: startPos.clientX + dragDistance,
        clientY: startPos.clientY,
      })
    )
    await nextTick()
    expect(inner.text()).toEqual(activeText)

    // End the drag
    window.dispatchEvent(new window.MouseEvent("touchend"))
    await nextTick()
    await new Promise(r => setTimeout(r))
    expect(inner.text()).toEqual(inactiveText)
  })

  it("beingDragged and then dragComplete", async () => {
    const props = reactive<Props>({ draggable: true, draggablePercent: 0.6 })
    const wrapper = mount(TestComponent(getEl), { props })

    const outer = wrapper.find("#outer")
    const inner = wrapper.find("#inner")

    expect(inner.text()).toEqual(inactiveText)

    outer.element.dispatchEvent(
      new window.MouseEvent("mousedown", { ...startPos })
    )
    await nextTick()

    expect(inner.text()).toEqual(inactiveText)

    // Get current position and calculate a move that is enough to complete the drag
    const dragDistance = getDragDistance(0.6) * 1.1
    window.dispatchEvent(
      new window.MouseEvent("mousemove", {
        clientX: startPos.clientX + dragDistance,
        clientY: startPos.clientY,
      })
    )
    await nextTick()
    expect(inner.text()).toEqual(activeText)

    // End the drag
    window.dispatchEvent(new window.MouseEvent("mouseup"))
    await nextTick()
    await new Promise(r => setTimeout(r))
    expect(inner.text()).toEqual(completeText)
  })

  it("styles are applied", async () => {
    const props = reactive<Props>({ draggable: true, draggablePercent: 0.6 })
    let _el: HTMLElement | undefined = undefined

    const wrapper = mount(
      TestComponent(e => {
        getEl(e)
        if (e.value) {
          _el = e.value
        }
      }),
      { props }
    )

    const outer = wrapper.find("#outer")

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(_el).toBeDefined()
    if (!_el) {
      return
    }
    const el = _el as HTMLElement

    await nextTick()

    // Before dragging, some styles should be set
    expect(el.style.transform).toEqual("translateX(0px)")
    expect(el.style.opacity).toEqual("1")
    expect(el.style.transition).toEqual("")

    // Drag starts
    outer.element.dispatchEvent(
      new window.MouseEvent("mousedown", { ...startPos })
    )
    await nextTick()

    // Same styles are kept
    expect(el.style.transform).toEqual("translateX(0px)")
    expect(el.style.opacity).toEqual("1")
    expect(el.style.transition).toEqual("")

    // Drag a little bit
    const removalDistance = getDragDistance(0.6)
    const dragDistance = Math.floor(removalDistance * 0.8)
    window.dispatchEvent(
      new window.MouseEvent("mousemove", {
        clientX: startPos.clientX + dragDistance,
        clientY: startPos.clientY,
      })
    )
    await nextTick()

    // Styles reflect dragging
    expect(el.style.transform).toEqual(`translateX(${dragDistance}px)`)
    expect(el.style.opacity).toEqual(
      `${1 - Math.abs(dragDistance / removalDistance)}`
    )
    expect(el.style.transition).toEqual("")

    // End the drag
    window.dispatchEvent(new window.MouseEvent("mouseup"))
    await nextTick()
    await new Promise(r => setTimeout(r))

    // Return to initial styles with a transition
    expect(el.style.transform).toEqual(`translateX(0px)`)
    expect(el.style.opacity).toEqual("1")
    expect(el.style.transition).toEqual("transform 0.2s, opacity 0.2s")

    // Start again, move and end
    outer.element.dispatchEvent(
      new window.MouseEvent("mousedown", { ...startPos })
    )
    await nextTick()
    window.dispatchEvent(
      new window.MouseEvent("mousemove", {
        clientX: startPos.clientX + removalDistance,
        clientY: startPos.clientY,
      })
    )
    await nextTick()
    window.dispatchEvent(new window.MouseEvent("mouseup"))
    await nextTick()
    await new Promise(r => setTimeout(r))

    // Styles are final
    expect(el.style.transform).toEqual(`translateX(${removalDistance}px)`)
    expect(el.style.opacity).toEqual("0")
    expect(el.style.transition).toEqual("")
  })
})
