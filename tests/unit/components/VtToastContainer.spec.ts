import { loadPlugin } from "../../utils/plugin";
import {
  ToastOptionsAndRequiredContent,
  PluginOptions,
  ToastID,
  ToastOptionsAndContent
} from "@/types";
import { POSITION, VT_NAMESPACE } from "@/ts/constants";

describe("VtToastContainer", () => {
  it("snapshots with default value", () => {
    const { containerWrapper } = loadPlugin();
    expect(containerWrapper.element).toMatchSnapshot();
  });
  it("snapshots with classes", () => {
    const { containerWrapper } = loadPlugin({ containerClassName: "myclass" });
    expect(containerWrapper.element).toMatchSnapshot();
  });
  describe("setup", () => {
    it("removes element and reassigns", () => {
      const { containerWrapper } = loadPlugin();
      const container = document.createElement("div");
      const vm = (containerWrapper.vm as unknown) as {
        setup(container: HTMLElement): void;
      };
      expect(containerWrapper.element.parentElement).not.toBe(container);
      vm.setup(container);
      expect(containerWrapper.element.parentElement).toBe(container);
    });
  });
  describe("setToast", () => {
    it("sets toast with id", () => {
      const { containerWrapper } = loadPlugin();
      const vm = (containerWrapper.vm as unknown) as {
        setToast(props: ToastOptionsAndRequiredContent): void;
        toasts: { [toastID: string]: ToastOptionsAndRequiredContent };
      };
      expect(vm.toasts).toEqual({});
      const toast: ToastOptionsAndRequiredContent = {
        content: "abc",
        id: "id"
      };
      vm.setToast(toast);
      expect(vm.toasts).toEqual({ id: toast });
    });
    it("ignores toast without id", () => {
      const { containerWrapper } = loadPlugin();
      const vm = (containerWrapper.vm as unknown) as {
        setToast(props: ToastOptionsAndRequiredContent): void;
        toasts: { [toastID: string]: ToastOptionsAndRequiredContent };
      };
      expect(vm.toasts).toEqual({});
      const toast: ToastOptionsAndRequiredContent = { content: "abc" };
      vm.setToast(toast);
      expect(vm.toasts).toEqual({});
    });
  });
  describe("addToast", () => {
    it("uses default values if nothing was provided", () => {
      const filterBeforeCreate = jest.fn(toast => toast);
      const { containerWrapper } = loadPlugin({ filterBeforeCreate });
      const vm = (containerWrapper.vm as unknown) as {
        addToast(params: ToastOptionsAndRequiredContent): void;
        defaults: PluginOptions;
      };
      const toast: ToastOptionsAndRequiredContent = { content: "abc" };
      expect(filterBeforeCreate).not.toHaveBeenCalled();
      vm.addToast(toast);
      expect(filterBeforeCreate).toHaveBeenCalledWith(
        { ...vm.defaults, ...toast },
        []
      );
    });
    it("merges default with params", () => {
      const filterBeforeCreate = jest.fn(toast => toast);
      const { containerWrapper } = loadPlugin({ filterBeforeCreate });
      const vm = (containerWrapper.vm as unknown) as {
        addToast(params: ToastOptionsAndRequiredContent): void;
        defaults: PluginOptions;
      };
      const toast: ToastOptionsAndRequiredContent = {
        content: "abc",
        timeout: 1000,
        closeButton: false
      };
      expect(filterBeforeCreate).not.toHaveBeenCalled();
      vm.addToast(toast);
      expect(filterBeforeCreate).toHaveBeenCalledWith(
        { ...vm.defaults, ...toast },
        []
      );
    });
    it("uses default filterBeforeCreate if defined", () => {
      const filterBeforeCreate = jest.fn(toast => toast);
      const { containerWrapper } = loadPlugin({ filterBeforeCreate });
      const vm = (containerWrapper.vm as unknown) as {
        addToast(params: ToastOptionsAndRequiredContent): void;
      };
      const toast: ToastOptionsAndRequiredContent = { content: "abc" };
      expect(filterBeforeCreate).not.toHaveBeenCalled();
      vm.addToast(toast);
      expect(filterBeforeCreate).toHaveBeenCalled();
    });
    it("uses fallback filterBeforeCreate if not defined", () => {
      const filterBeforeCreate = jest.fn((): false => false);
      const { containerWrapper, localVue } = loadPlugin({ filterBeforeCreate });
      localVue.$toast.updateDefaults({ filterBeforeCreate: undefined });
      const vm = (containerWrapper.vm as unknown) as {
        setToast(params: ToastOptionsAndRequiredContent): void;
        addToast(params: ToastOptionsAndRequiredContent): void;
        defaults: PluginOptions;
      };
      const spySetToast = jest.spyOn(vm, "setToast");
      const toast: ToastOptionsAndRequiredContent = { content: "abc" };
      expect(filterBeforeCreate).not.toHaveBeenCalled();
      expect(spySetToast).not.toHaveBeenCalled();
      vm.addToast(toast);
      expect(filterBeforeCreate).not.toHaveBeenCalled();
      expect(spySetToast).toHaveBeenCalledWith({ ...vm.defaults, ...toast });
    });
    it("set toast if passes filterBeforeCreate", () => {
      const { containerWrapper } = loadPlugin();
      const vm = (containerWrapper.vm as unknown) as {
        setToast(params: ToastOptionsAndRequiredContent): void;
        addToast(params: ToastOptionsAndRequiredContent): void;
        defaults: PluginOptions;
      };
      const spySetToast = jest.spyOn(vm, "setToast");
      const toast: ToastOptionsAndRequiredContent = { content: "abc" };
      expect(spySetToast).not.toHaveBeenCalled();
      vm.addToast(toast);
      expect(spySetToast).toHaveBeenCalledWith({ ...vm.defaults, ...toast });
    });
    it("does not set toast if fails filterBeforeCreate", () => {
      const filterBeforeCreate = jest.fn((): false => false);
      const { containerWrapper } = loadPlugin({ filterBeforeCreate });
      const vm = (containerWrapper.vm as unknown) as {
        setToast(params: ToastOptionsAndRequiredContent): void;
        addToast(params: ToastOptionsAndRequiredContent): void;
      };
      const spySetToast = jest.spyOn(vm, "setToast");
      const toast: ToastOptionsAndRequiredContent = { content: "abc" };
      expect(spySetToast).not.toHaveBeenCalled();
      vm.addToast(toast);
      expect(spySetToast).not.toHaveBeenCalled();
    });
  });
  describe("dismissToast", () => {
    it("dismisses toast", () => {
      const { containerWrapper } = loadPlugin();
      const vm = (containerWrapper.vm as unknown) as {
        dismissToast(id: ToastID): void;
        setToast(params: ToastOptionsAndRequiredContent): void;
      };
      const spyOnDelete = jest.spyOn(containerWrapper.vm, "$delete");
      vm.setToast({ id: 10, content: "content" });
      expect(spyOnDelete).not.toHaveBeenCalled();
      vm.dismissToast(10);
      expect(spyOnDelete).toHaveBeenCalledWith(expect.anything(), 10);
    });
    it("calls onClose if set", () => {
      const { containerWrapper } = loadPlugin();
      const vm = (containerWrapper.vm as unknown) as {
        dismissToast(id: ToastID): void;
        setToast(params: ToastOptionsAndRequiredContent): void;
      };
      const spyOnDelete = jest.spyOn(containerWrapper.vm, "$delete");
      const onClose = jest.fn();
      vm.setToast({ id: 10, content: "content", onClose });
      expect(spyOnDelete).not.toHaveBeenCalled();
      expect(onClose).not.toHaveBeenCalled();
      vm.dismissToast(10);
      expect(onClose).toHaveBeenCalled();
      expect(spyOnDelete).toHaveBeenCalledWith(expect.anything(), 10);
    });
  });
  describe("clearToasts", () => {
    it("clears toasts", () => {
      const { containerWrapper } = loadPlugin();
      const vm = (containerWrapper.vm as unknown) as {
        dismissToast(id: ToastID): void;
        clearToasts(): void;
        setToast(params: ToastOptionsAndRequiredContent): void;
      };
      const spyOnDismiss = jest.spyOn(containerWrapper.vm, "$delete");
      vm.setToast({ id: 1, content: "content1" });
      vm.setToast({ id: 2, content: "content2" });
      vm.setToast({ id: 3, content: "content3" });
      expect(spyOnDismiss).not.toHaveBeenCalled();
      vm.clearToasts();
      expect(spyOnDismiss).toHaveBeenCalledTimes(3);
      expect(spyOnDismiss).toHaveBeenCalledWith(expect.anything(), "1");
      expect(spyOnDismiss).toHaveBeenCalledWith(expect.anything(), "2");
      expect(spyOnDismiss).toHaveBeenCalledWith(expect.anything(), "3");
    });
  });
  describe("getPositionToasts", () => {
    it("gets toast from position", () => {
      const { containerWrapper } = loadPlugin();
      const vm = (containerWrapper.vm as unknown) as {
        getPositionToasts(position: POSITION): ToastOptionsAndRequiredContent[];
        setToast(params: ToastOptionsAndRequiredContent): void;
      };
      vm.setToast({
        id: 1,
        content: "content1",
        position: POSITION.TOP_CENTER
      });
      vm.setToast({ id: 2, content: "content1", position: POSITION.TOP_RIGHT });
      const topCenterIds = vm
        .getPositionToasts(POSITION.TOP_CENTER)
        .map(t => t.id);
      const topRightIds = vm
        .getPositionToasts(POSITION.TOP_RIGHT)
        .map(t => t.id);
      const topLeftIds = vm.getPositionToasts(POSITION.TOP_LEFT).map(t => t.id);
      expect(topCenterIds).toEqual([1]);
      expect(topRightIds).toEqual([2]);
      expect(topLeftIds).toEqual([]);
    });
    it("regular ordering if newestOnTop is false", () => {
      const { containerWrapper: containerWrapper1 } = loadPlugin({
        newestOnTop: false
      });
      const vm = (containerWrapper1.vm as unknown) as {
        getPositionToasts(position: POSITION): ToastOptionsAndRequiredContent[];
        setToast(params: ToastOptionsAndRequiredContent): void;
      };
      vm.setToast({ id: 1, content: "content1", position: POSITION.TOP_RIGHT });
      vm.setToast({ id: 2, content: "content2", position: POSITION.TOP_RIGHT });
      vm.setToast({ id: 3, content: "content3", position: POSITION.TOP_RIGHT });
      const topRightIds = vm
        .getPositionToasts(POSITION.TOP_RIGHT)
        .map(t => t.id);
      expect(topRightIds).toEqual([1, 2, 3]);
    });
    it("reverse ordering if newestOnTop is true", () => {
      const { containerWrapper: containerWrapper1 } = loadPlugin({
        newestOnTop: true
      });
      const vm = (containerWrapper1.vm as unknown) as {
        getPositionToasts(position: POSITION): ToastOptionsAndRequiredContent[];
        setToast(params: ToastOptionsAndRequiredContent): void;
      };
      vm.setToast({ id: 1, content: "content1", position: POSITION.TOP_RIGHT });
      vm.setToast({ id: 2, content: "content2", position: POSITION.TOP_RIGHT });
      vm.setToast({ id: 3, content: "content3", position: POSITION.TOP_RIGHT });
      const topRightIds = vm
        .getPositionToasts(POSITION.TOP_RIGHT)
        .map(t => t.id);
      expect(topRightIds).toEqual([3, 2, 1]);
    });
  });
  describe("updateDefaults", () => {
    it("updates defaults", () => {
      const { containerWrapper } = loadPlugin({ timeout: 1000 });
      const vm = (containerWrapper.vm as unknown) as {
        updateDefaults(update: PluginOptions): void;
        defaults: PluginOptions;
      };
      expect(vm.defaults.timeout).toBe(1000);
      vm.updateDefaults({ timeout: 5000 });
      expect(vm.defaults.timeout).toBe(5000);
    });
    it("calls setup if container is present", () => {
      const { containerWrapper } = loadPlugin({ timeout: 1000 });
      const vm = (containerWrapper.vm as unknown) as {
        updateDefaults(update: PluginOptions): void;
        defaults: PluginOptions;
        setup(container: HTMLElement): void;
      };
      const spySetup = jest.spyOn(vm, "setup");
      const container = document.createElement("div");
      expect(vm.defaults.container).not.toBe(container);
      expect(spySetup).not.toHaveBeenCalled();
      vm.updateDefaults({ container });
      expect(spySetup).toHaveBeenCalledWith(container);
      expect(vm.defaults.container).toBe(container);
    });
  });
  describe("updateToast", () => {
    it("updates existing toast", () => {
      const { containerWrapper } = loadPlugin();
      const vm = (containerWrapper.vm as unknown) as {
        updateToast({
          id,
          options,
          create
        }: {
          id: ToastID;
          options: ToastOptionsAndContent;
          create: boolean;
        }): void;
        setToast(params: ToastOptionsAndRequiredContent): void;
        toasts: { [toastID: string]: ToastOptionsAndRequiredContent };
      };
      const toast: ToastOptionsAndRequiredContent = {
        id: "id1",
        content: "content"
      };
      vm.setToast(toast);
      expect(vm.toasts["id1"].content).toBe("content");
      vm.updateToast({
        id: "id1",
        options: { content: "other" },
        create: false
      });
      expect(vm.toasts["id1"].content).toBe("other");
    });
    it("increases timeout if it is the same", () => {
      const { containerWrapper } = loadPlugin();
      const vm = (containerWrapper.vm as unknown) as {
        updateToast({
          id,
          options,
          create
        }: {
          id: ToastID;
          options: ToastOptionsAndContent;
          create: boolean;
        }): void;
        setToast(params: ToastOptionsAndRequiredContent): void;
        toasts: { [toastID: string]: ToastOptionsAndRequiredContent };
      };
      const toast: ToastOptionsAndRequiredContent = {
        id: "id1",
        content: "content",
        timeout: 1000
      };
      vm.setToast(toast);
      expect(vm.toasts["id1"].timeout).toBe(1000);
      vm.updateToast({ id: "id1", options: { timeout: 1000 }, create: false });
      expect(vm.toasts["id1"].timeout).toBe(1001);
    });
    it("creates new toast if create is true", () => {
      const { containerWrapper } = loadPlugin();
      const vm = (containerWrapper.vm as unknown) as {
        updateToast({
          id,
          options,
          create
        }: {
          id: ToastID;
          options: ToastOptionsAndContent;
          create: boolean;
        }): void;
        addToast(params: ToastOptionsAndRequiredContent): void;
        toasts: { [toastID: string]: ToastOptionsAndRequiredContent };
      };
      expect(vm.toasts["id1"]).toBe(undefined);
      vm.updateToast({
        id: "id1",
        options: { content: "content" },
        create: true
      });
      expect(vm.toasts["id1"]).not.toBe(undefined);
      expect(vm.toasts["id1"].content).toBe("content");
    });
    it("ignores if missing toast and not create", () => {
      const { containerWrapper } = loadPlugin();
      const vm = (containerWrapper.vm as unknown) as {
        updateToast({
          id,
          options,
          create
        }: {
          id: ToastID;
          options: ToastOptionsAndContent;
          create: boolean;
        }): void;
        addToast(params: ToastOptionsAndRequiredContent): void;
        toasts: { [toastID: string]: ToastOptionsAndRequiredContent };
      };
      expect(vm.toasts["id1"]).toBe(undefined);
      vm.updateToast({
        id: "id1",
        options: { content: "content" },
        create: false
      });
      expect(vm.toasts["id1"]).toBe(undefined);
    });
  });
  describe("getClasses", () => {
    it("returns classes", () => {
      const { containerWrapper } = loadPlugin();
      const vm = (containerWrapper.vm as unknown) as {
        getClasses(position: POSITION): string[];
      };
      const position = POSITION.BOTTOM_RIGHT;
      expect(vm.getClasses(position)).toEqual([
        `${VT_NAMESPACE}__container`,
        position
      ]);
    });
  });
  describe("toastArray", () => {
    const { containerWrapper } = loadPlugin();
    const vm = (containerWrapper.vm as unknown) as {
      toastArray: ToastOptionsAndRequiredContent[];
      setToast(params: ToastOptionsAndRequiredContent): void;
    };
    expect(vm.toastArray.map(t => t.id)).toEqual([]);
    vm.setToast({ id: "1", content: "abc" });
    expect(vm.toastArray.map(t => t.id)).toEqual(["1"]);
    vm.setToast({ id: "2", content: "def" });
    expect(vm.toastArray.map(t => t.id)).toEqual(["1", "2"]);
  });
  describe("filteredToasts", () => {
    it("filters toasts with default filterToasts", () => {
      const { containerWrapper } = loadPlugin();
      const vm = (containerWrapper.vm as unknown) as {
        filteredToasts: ToastOptionsAndRequiredContent[];
        setToast(params: ToastOptionsAndRequiredContent): void;
      };
      vm.setToast({ id: "1", content: "abc" });
      vm.setToast({ id: "2", content: "def" });
      expect(vm.filteredToasts.map(t => t.id)).toEqual(["1", "2"]);
    });
    it("filters toasts with provided filterToasts", () => {
      const filterToasts = jest.fn(() => []);
      expect(filterToasts).not.toHaveBeenCalled();
      const { containerWrapper } = loadPlugin({ filterToasts });
      const vm = (containerWrapper.vm as unknown) as {
        filteredToasts: ToastOptionsAndRequiredContent[];
        setToast(params: ToastOptionsAndRequiredContent): void;
        toastArray: ToastOptionsAndRequiredContent[];
      };
      expect(filterToasts).toHaveBeenCalledTimes(1);
      expect(filterToasts).toHaveBeenCalledWith([]);
      vm.setToast({ id: "1", content: "abc" });
      vm.setToast({ id: "2", content: "def" });
      expect(filterToasts).toHaveBeenCalledTimes(1);
      expect(vm.filteredToasts).toEqual([]);
      expect(filterToasts).toHaveBeenCalledTimes(2);
      expect(filterToasts).toHaveBeenCalledWith(vm.toastArray);
    });
    it("returns all toasts if filterToasts is undefined", () => {
      const filterToasts = jest.fn(() => []);
      expect(filterToasts).not.toHaveBeenCalled();
      const { containerWrapper } = loadPlugin({ filterToasts });
      const vm = (containerWrapper.vm as unknown) as {
        filteredToasts: ToastOptionsAndRequiredContent[];
        setToast(params: ToastOptionsAndRequiredContent): void;
        toastArray: ToastOptionsAndRequiredContent[];
      };
      expect(filterToasts).toHaveBeenCalledTimes(1);
      expect(filterToasts).toHaveBeenCalledWith([]);
      containerWrapper.vm.$toast.updateDefaults({ filterToasts: undefined });
      vm.setToast({ id: "1", content: "abc" });
      vm.setToast({ id: "2", content: "def" });
      expect(filterToasts).toHaveBeenCalledTimes(1);
      expect(vm.filteredToasts).toEqual(vm.toastArray);
      expect(filterToasts).toHaveBeenCalledTimes(1);
    });
  });
});
