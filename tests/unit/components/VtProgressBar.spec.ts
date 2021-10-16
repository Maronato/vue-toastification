import { mount } from "@vue/test-utils"
import { nextTick } from "vue"
import VtProgressBar from "../../../src/components/VtProgressBar.vue"
import { VT_NAMESPACE } from "../../../src/ts/constants"

describe("VtProgressBar", () => {
  it("matches snapshot", () => {
    const wrapper = mount(VtProgressBar)
    expect(wrapper.element).toMatchSnapshot()
  })
  it("has default class", () => {
    const wrapper = mount(VtProgressBar)
    expect(wrapper.classes()).toContain(`${VT_NAMESPACE}__progress-bar`)
  })
  it("has default style values", () => {
    const wrapper = mount(VtProgressBar)
    const vm = wrapper.vm as unknown as { [index: string]: unknown }
    const style = vm.style as {
      animationDuration: string
      animationPlayState: string
      opacity: 0 | 1
    }
    expect(style).toEqual({
      animationDuration: "5000ms",
      animationPlayState: "paused",
      opacity: 1,
    })
  })
  it("sets style duration from timeout", () => {
    const wrapper = mount(VtProgressBar, {
      props: {
        timeout: 1000,
      },
    })
    const vm = wrapper.vm as unknown as { [index: string]: unknown }
    const style = vm.style as {
      animationDuration: string
      animationPlayState: string
      opacity: 0 | 1
    }
    expect(style).toEqual({
      animationDuration: "1000ms",
      animationPlayState: "paused",
      opacity: 1,
    })
    expect(wrapper.element).toMatchSnapshot()
  })
  it("sets playstate from isRunning", () => {
    const wrapper = mount(VtProgressBar, {
      props: {
        isRunning: true,
      },
    })
    const vm = wrapper.vm as unknown as { [index: string]: unknown }
    const style = vm.style as {
      animationDuration: string
      animationPlayState: string
      opacity: 0 | 1
    }
    expect(style).toEqual({
      animationDuration: "5000ms",
      animationPlayState: "running",
      opacity: 1,
    })
    expect(wrapper.element).toMatchSnapshot()
  })
  it("sets opacity to 0 from from hideProgressBar", () => {
    const wrapper = mount(VtProgressBar, {
      props: {
        hideProgressBar: true,
      },
    })
    const vm = wrapper.vm as unknown as { [index: string]: unknown }
    const style = vm.style as {
      animationDuration: string
      animationPlayState: string
      opacity: 0 | 1
    }
    expect(style).toEqual({
      animationDuration: "5000ms",
      animationPlayState: "paused",
      opacity: 0,
    })
    expect(wrapper.element).toMatchSnapshot()
  })
  it("triggers class reset on timeout change", async () => {
    const wrapper = mount(VtProgressBar)
    expect(wrapper.classes()).toContain(`${VT_NAMESPACE}__progress-bar`)
    wrapper.setProps({ timeout: 1000 })
    await nextTick()
    expect(wrapper.classes()).not.toContain(`${VT_NAMESPACE}__progress-bar`)
    expect(wrapper.element).toMatchSnapshot()
    await nextTick()
    await nextTick()
    expect(wrapper.classes()).toContain(`${VT_NAMESPACE}__progress-bar`)
    expect(wrapper.element).toMatchSnapshot()
  })
  it("emits close-toast on animationend", async () => {
    const wrapper = mount(VtProgressBar)
    expect(wrapper.emitted("close-toast")).toBeFalsy()
    wrapper.trigger("animationend")
    expect(wrapper.emitted("close-toast")).toBeTruthy()
  })
  it("removes listener on beforeDestroy", async () => {
    const wrapper = mount(VtProgressBar)
    const spyRemoveEventListener = jest.spyOn(
      wrapper.vm.$el,
      "removeEventListener"
    )
    expect(spyRemoveEventListener).not.toHaveBeenCalled()
    wrapper.unmount()
    expect(spyRemoveEventListener).toHaveBeenCalled()
  })
})
