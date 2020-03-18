import { mount } from "@vue/test-utils";
import VtWarningIcon from "@/components/icons/VtWarningIcon.vue";

describe("VtWarningIcon", () => {
  it("matches snapshot", () => {
    const wrapper = mount(VtWarningIcon);
    expect(wrapper.element).toMatchSnapshot();
  });
});
