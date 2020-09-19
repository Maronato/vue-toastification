import { mount } from "@vue/test-utils"
import VtSuccessIcon from "../../../../src/components/icons/VtSuccessIcon.vue"

describe("VtSuccessIcon", () => {
  it("matches snapshot", () => {
    const wrapper = mount(VtSuccessIcon)
    expect(wrapper.element).toMatchSnapshot()
  })
})
