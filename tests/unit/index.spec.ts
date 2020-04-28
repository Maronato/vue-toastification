import Vue from "vue";
import { createLocalVue } from "@vue/test-utils";
import Toast, { createToastInterface } from "../../src/index";
import * as ToastInterfaceModule from "../../src/ts/interface";

describe("Toast Plugin", () => {
  it("Loads plugin", () => {
    const localVue = createLocalVue();
    expect(localVue.$toast).toBeFalsy();
    localVue.use(Toast, { container: document.createElement("div") });
    expect(localVue.$toast).toBeTruthy();
  });
});

describe("createToastInterface", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
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
    const ToastInterfaceSpy = jest.spyOn(ToastInterfaceModule, "default");
    const localVue = createLocalVue();
    expect(onMounted).not.toHaveBeenCalled();
    expect(ToastInterfaceSpy).not.toHaveBeenCalled();
    createToastInterface({ onMounted }, localVue);
    expect(onMounted).toHaveBeenCalled();
    expect(ToastInterfaceSpy).toHaveBeenCalledWith(
      localVue,
      expect.objectContaining({ onMounted }),
      true
    );
  });
  it("accepts a single eventBus argument", () => {
    const ToastInterfaceSpy = jest.spyOn(ToastInterfaceModule, "default");
    const localVue = createLocalVue();
    const eventBus = new localVue();
    expect(ToastInterfaceSpy).not.toHaveBeenCalled();
    createToastInterface(eventBus);
    expect(ToastInterfaceSpy).toHaveBeenCalledWith(
      Vue,
      expect.objectContaining({ eventBus }),
      false
    );
  });
});
