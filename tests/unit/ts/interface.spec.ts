import { createLocalVue } from "@vue/test-utils";
import ToastInterface from "../../../src/ts/interface";
import { EVENTS, TYPE } from "../../../src/ts/constants";
import { loadPlugin } from "../../utils/plugin";
import { ToastOptions } from "../../../src/types";

describe("ToastInterface", () => {
  let localVue: ReturnType<typeof loadPlugin>["localVue"],
    wrappers: ReturnType<typeof loadPlugin>,
    toast: ReturnType<typeof ToastInterface>;

  const eventBus = new (createLocalVue())();

  const eventsEmmited = Object.values(EVENTS).reduce((agg, eventName) => {
    const handler = jest.fn();
    eventBus.$on(eventName, handler);
    return { ...agg, [eventName]: handler };
  }, {} as { [eventName in EVENTS]: jest.Mock });

  beforeEach(() => {
    wrappers = loadPlugin({ eventBus });
    localVue = wrappers.localVue;
    toast = localVue.$toast;
    jest.clearAllMocks();
  });

  it("calls onMounted", () => {
    const localVue = createLocalVue();
    const onMounted = jest.fn();
    expect(onMounted).not.toHaveBeenCalled();
    toast = ToastInterface(localVue, { onMounted });
    expect(onMounted).toHaveBeenCalledWith(expect.any(localVue));
  });

  it("does not call onMounted", () => {
    const localVue = createLocalVue();
    const onMounted = jest.fn();
    toast = ToastInterface(localVue);
    expect(onMounted).not.toHaveBeenCalled();
  });

  it("mounts if mountContainer is true", () => {
    const localVue = createLocalVue();
    const extendSpy = jest.spyOn(localVue, "extend");
    expect(extendSpy).not.toHaveBeenCalled();
    toast = ToastInterface(localVue, undefined, true);
    expect(extendSpy).toHaveBeenCalled();
  });

  it("does not mount if mountContainer is false", () => {
    const localVue = createLocalVue();
    const extendSpy = jest.spyOn(localVue, "extend");
    expect(extendSpy).not.toHaveBeenCalled();
    toast = ToastInterface(localVue, undefined, false);
    expect(extendSpy).not.toHaveBeenCalled();
  });

  it("calls regular toast function with defaults", () => {
    expect(eventsEmmited.add).not.toHaveBeenCalled();
    const content = "content";
    const id = toast(content);
    expect(eventsEmmited.add).toHaveBeenCalledTimes(1);
    expect(eventsEmmited.add).toBeCalledWith({
      id: expect.any(Number),
      type: TYPE.DEFAULT,
      content,
    });
    expect(typeof id).toBe("number");
  });
  it("calls regular toast function with extra values", () => {
    expect(eventsEmmited.add).not.toHaveBeenCalled();
    const content = "content";
    const options: ToastOptions = { timeout: 1000 };
    const id = toast(content, options);
    expect(eventsEmmited.add).toHaveBeenCalledTimes(1);
    expect(eventsEmmited.add).toBeCalledWith({
      id: expect.any(Number),
      type: TYPE.DEFAULT,
      content,
      ...options,
    });
    expect(typeof id).toBe("number");
  });
  it("calls clear", () => {
    expect(eventsEmmited.clear).not.toHaveBeenCalled();
    toast.clear();
    expect(eventsEmmited.clear).toHaveBeenCalledTimes(1);
  });
  it("calls updateDefaults", () => {
    expect(eventsEmmited.update_defaults).not.toHaveBeenCalled();
    toast.updateDefaults({ timeout: 1000 });
    expect(eventsEmmited.update_defaults).toHaveBeenCalledTimes(1);
    expect(eventsEmmited.update_defaults).toBeCalledWith({ timeout: 1000 });
  });
  it("calls dismiss", () => {
    expect(eventsEmmited.dismiss).not.toHaveBeenCalled();
    toast.dismiss(10);
    expect(eventsEmmited.dismiss).toHaveBeenCalledTimes(1);
    expect(eventsEmmited.dismiss).toBeCalledWith(10);
  });
  it("calls update with content", () => {
    expect(eventsEmmited.update).not.toHaveBeenCalled();
    const id = 10;
    const content = "content";
    toast.update(id, { content });
    expect(eventsEmmited.update).toHaveBeenCalledTimes(1);
    expect(eventsEmmited.update).toBeCalledWith({
      id,
      options: { content },
      create: false,
    });
  });
  it("calls update with options", () => {
    expect(eventsEmmited.update).not.toHaveBeenCalled();
    const id = 10;
    const options: ToastOptions = { timeout: 1000 };
    toast.update(id, { options });
    expect(eventsEmmited.update).toHaveBeenCalledTimes(1);
    expect(eventsEmmited.update).toBeCalledWith({
      id,
      options: { ...options, content: undefined },
      create: false,
    });
  });
  it("calls update with create", () => {
    expect(eventsEmmited.update).not.toHaveBeenCalled();
    const id = 10;
    const content = "abc";
    toast.update(id, { content }, true);
    expect(eventsEmmited.update).toHaveBeenCalledTimes(1);
    expect(eventsEmmited.update).toBeCalledWith({
      id,
      options: { content },
      create: true,
    });
  });
  it("calls success", () => {
    expect(eventsEmmited.add).not.toHaveBeenCalled();
    const content = "abc";
    toast.success(content);
    expect(eventsEmmited.add).toHaveBeenCalledTimes(1);
    expect(eventsEmmited.add).toBeCalledWith({
      id: expect.any(Number),
      type: TYPE.SUCCESS,
      content,
    });
  });
  it("calls info", () => {
    expect(eventsEmmited.add).not.toHaveBeenCalled();
    const content = "abc";
    toast.info(content);
    expect(eventsEmmited.add).toHaveBeenCalledTimes(1);
    expect(eventsEmmited.add).toBeCalledWith({
      id: expect.any(Number),
      type: TYPE.INFO,
      content,
    });
  });
  it("calls error", () => {
    expect(eventsEmmited.add).not.toHaveBeenCalled();
    const content = "abc";
    toast.error(content);
    expect(eventsEmmited.add).toHaveBeenCalledTimes(1);
    expect(eventsEmmited.add).toBeCalledWith({
      id: expect.any(Number),
      type: TYPE.ERROR,
      content,
    });
  });
  it("calls warning", () => {
    expect(eventsEmmited.add).not.toHaveBeenCalled();
    const content = "abc";
    toast.warning(content);
    expect(eventsEmmited.add).toHaveBeenCalledTimes(1);
    expect(eventsEmmited.add).toBeCalledWith({
      id: expect.any(Number),
      type: TYPE.WARNING,
      content,
    });
  });
});
