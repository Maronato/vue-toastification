import type ToastInterface from "../../src/ts/interface";

declare let useToast: () => ReturnType<typeof ToastInterface>;

export { useToast };
