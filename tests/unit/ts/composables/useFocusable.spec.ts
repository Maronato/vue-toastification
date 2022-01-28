/* eslint-disable vue/one-component-per-file */

import { mount } from "@vue/test-utils"
import { computed, defineComponent, h, nextTick, reactive, ref } from "vue"
import { useFocusable } from "../../../../src/ts/composables/useFocusable"

const activeText = "things"
const inactiveText = "stuffs"

type Props = Parameters<typeof useFocusable>[1]

const TestComponent = defineComponent({
  props: {
    pauseOnFocusLoss: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const el = ref<HTMLElement>()
    const { focused } = useFocusable(el, props)
    const text = computed(() => (focused.value ? activeText : inactiveText))
    return () =>
      h("div", { ref: el, id: "outer" }, h("p", { id: "inner" }, text.value))
  },
})

describe("useFocusable", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it("Returns valid object", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation()

    const el = ref()
    const props = reactive<Props>({ pauseOnFocusLoss: false })
    const retuned = useFocusable(el, props)

    // not-used-in-setup warnings
    expect(consoleSpy).toBeCalledTimes(2)

    expect(retuned.focused.value).toBe(true)
  })

  it("adds and removes event listeners", () => {
    const props = reactive<Props>({ pauseOnFocusLoss: true })

    const addEventListenerSpy = jest.spyOn(window, "addEventListener")
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener")

    expect(addEventListenerSpy).not.toHaveBeenCalled()
    expect(removeEventListenerSpy).not.toHaveBeenCalled()

    const wrapper = mount(TestComponent, { props })

    expect(addEventListenerSpy).toHaveBeenCalledTimes(2)
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "blur",
      expect.any(Function)
    )
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "focus",
      expect.any(Function)
    )
    expect(removeEventListenerSpy).not.toHaveBeenCalled()

    wrapper.unmount()

    expect(addEventListenerSpy).toHaveBeenCalledTimes(2)
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2)
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "blur",
      expect.any(Function)
    )
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "focus",
      expect.any(Function)
    )
  })

  it("focus and blur if pauseOnFocusLoss", async () => {
    const props = reactive<Props>({ pauseOnFocusLoss: true })
    const wrapper = mount(TestComponent, { props })

    const inner = wrapper.find("#inner")

    expect(inner.text()).toEqual(activeText)

    window.dispatchEvent(new window.FocusEvent("blur"))
    await nextTick()

    expect(inner.text()).toEqual(inactiveText)

    window.dispatchEvent(new window.FocusEvent("focus"))
    await nextTick()

    expect(inner.text()).toEqual(activeText)
  })

  it("does not focus and blur if not pauseOnFocusLoss", async () => {
    const props = reactive<Props>({ pauseOnFocusLoss: false })
    const wrapper = mount(TestComponent, { props })

    const inner = wrapper.find("#inner")

    expect(inner.text()).toEqual(activeText)

    window.dispatchEvent(new window.FocusEvent("blur"))
    await nextTick()

    expect(inner.text()).not.toEqual(inactiveText)

    wrapper.unmount()
  })
})
