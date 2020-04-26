import { createLocalVue } from "@vue/test-utils";
import Toast, { createToastInterface } from "../../src/index";

describe("Toast Plugin", () => {
  it("Loads plugin", () => {
    const localVue = createLocalVue();
    expect(localVue.$toast).toBeFalsy();
    localVue.use(Toast, { container: document.createElement("div") });
    expect(localVue.$toast).toBeTruthy();
  });
});

describe("createToastInterface", () => {
  it("registers interface", () => {
    const toast = createToastInterface();
    expect(typeof toast.success).toBe("function");
  });
  it("uses custom vue instance", () => {
    const localVue = createLocalVue();
    const extendSpy = jest.spyOn(localVue, "extend");
    expect(extendSpy).not.toHaveBeenCalled();
    createToastInterface(undefined, localVue);
    expect(extendSpy).toHaveBeenCalled();
  });
  it("loads plugin options", () => {
    const onMounted = jest.fn();
    const localVue = createLocalVue();
    expect(onMounted).not.toHaveBeenCalled();
    createToastInterface({ onMounted }, localVue);
    expect(onMounted).toHaveBeenCalled();
  });
});
