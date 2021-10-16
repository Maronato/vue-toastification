import { TransitionGroup } from "vue"
import { mount } from "@vue/test-utils"
import VtTransition from "../../../src/components/VtTransition.vue"

describe("VtTransition", () => {
  it("snapshots default values", () => {
    const wrapper = mount(VtTransition)
    expect(wrapper.html()).toMatchSnapshot()
  })
  it("transition-group has default classes", () => {
    const wrapper = mount<typeof VtTransition, { transition: string }>(
      VtTransition,
      {
        global: {
          stubs: {
            "transition-group": false,
          },
        },
      }
    )
    const transition = wrapper.vm.$props.transition
    const componentProps = wrapper.findComponent(TransitionGroup).props()
    expect(componentProps.enterActiveClass).toBe(`${transition}-enter-active`)
    expect(componentProps.moveClass).toBe(`${transition}-move`)
    expect(componentProps.leaveActiveClass).toBe(`${transition}-leave-active`)
  })
  it("transition-group has custom classes", () => {
    const wrapper = mount<
      typeof VtTransition,
      { transition: { enter: string; move: string; leave: string } }
    >(VtTransition, {
      props: {
        transition: {
          enter: "enter-transition",
          move: "move-transition",
          leave: "leave-transition",
        },
      },
      global: {
        stubs: {
          "transition-group": false,
        },
      },
    })
    const componentProps = wrapper.findComponent(TransitionGroup).props()
    expect(componentProps.enterActiveClass).toBe("enter-transition")
    expect(componentProps.moveClass).toBe("move-transition")
    expect(componentProps.leaveActiveClass).toBe("leave-transition")
    expect(wrapper.element).toMatchSnapshot()
  })
  it("leave", () => {
    const wrapper = mount(VtTransition, {
      global: {
        stubs: {
          "transition-group": false,
        },
      },
    })
    const transition = wrapper.findComponent(TransitionGroup)

    const done = jest.fn()
    const el = document.createElement("div")

    transition.vm.$emit("leave", el, done)

    expect(el.style.left).toBe(el.offsetLeft + "px")
    expect(el.style.top).toBe(el.offsetTop + "px")
    expect(el.style.width).toBe(getComputedStyle(el).width)
    expect(el.style.position).toBe("absolute")

    const events = transition.emitted("leave")

    expect(events).toBeTruthy()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(events![0]).toEqual([el, done])
  })
  it("leave not HTMLElement", () => {
    const wrapper = mount(VtTransition, {
      global: {
        stubs: {
          "transition-group": false,
        },
      },
    })
    const transition = wrapper.findComponent(TransitionGroup)

    const done = jest.fn()
    const el = document.implementation.createDocument("xml", "element")

    transition.vm.$emit("leave", el, done)

    const events = transition.emitted("leave")

    expect(events).toBeTruthy()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(events![0]).toEqual([el, done])
  })
})
