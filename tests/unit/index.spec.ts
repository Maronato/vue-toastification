import { createLocalVue } from "@vue/test-utils";
import Toast from "@/index";

describe("Toast Plugin", () => {
  it("Loads plugin", () => {
    const localVue = createLocalVue();
    expect(localVue.$toast).toBeFalsy();
    localVue.use(Toast, { container: document.createElement("div") });
    expect(localVue.$toast).toBeTruthy();
  });
});
