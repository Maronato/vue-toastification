import { createLocalVue } from "@vue/test-utils";
import Toast from "../../src/index";

describe("Toast Plugin", () => {
  it("Loads plugin", () => {
    const localVue = createLocalVue();
    expect(localVue.$toast).toBeFalsy();
    localVue.use(Toast, { container: document.createElement("div") });
    expect(localVue.$toast).toBeTruthy();
  });
});
