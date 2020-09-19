import { mount } from "@vue/test-utils"
import VtErrorIcon from "../../../../src/components/icons/VtErrorIcon.vue"

describe("VtErrorIcon", () => {
  it("matches snapshot", () => {
    const wrapper = mount(VtErrorIcon)
    expect(wrapper.element).toMatchSnapshot()
  })
})
