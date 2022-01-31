/* eslint-disable vue/one-component-per-file */

import { computed, defineComponent, h, reactive, ref } from "vue"

import { mount } from "@vue/test-utils"

import { useHoverable } from "../../../../src/ts/composables/useHoverable"

const activeText = "things"
const inactiveText = "stuffs"

type Props = Parameters<typeof useHoverable>[1]

const TestComponent = defineComponent({
  props: {
    pauseOnHover: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const el = ref<HTMLElement>()
    const { hovering } = useHoverable(el, props)
    const text = computed(() => (hovering.value ? activeText : inactiveText))
    return () =>
      h("div", { ref: el, id: "outer" }, h("p", { id: "inner" }, text.value))
  },
})

describe("useHoverable", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  it("Returns valid object", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation()

    const el = ref()
    const props = reactive<Props>({ pauseOnHover: false })
    const retuned = useHoverable(el, props)

    // not-used-in-setup warnings
    expect(consoleSpy).toBeCalledTimes(2)

    expect(retuned.hovering.value).toBe(false)
  })

  it("pause/resume if pauseOnHover", async () => {
    const props = reactive<Props>({ pauseOnHover: true })
    const wrapper = mount(TestComponent, { props })

    const outer = wrapper.find("#outer")
    const inner = wrapper.find("#inner")

    expect(inner.text()).toEqual(inactiveText)

    await outer.trigger("mouseenter")

    expect(inner.text()).toEqual(activeText)

    await outer.trigger("mouseleave")

    expect(inner.text()).toEqual(inactiveText)
  })

  it("does not pause/resume if not pauseOnHover", async () => {
    const props = reactive<Props>({ pauseOnHover: false })
    const wrapper = mount(TestComponent, { props })

    const outer = wrapper.find("#outer")
    const inner = wrapper.find("#inner")

    expect(inner.text()).toEqual(inactiveText)

    await outer.trigger("mouseenter")

    expect(inner.text()).not.toEqual(activeText)

    wrapper.unmount()
  })
})
