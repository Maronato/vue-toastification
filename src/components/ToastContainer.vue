<template>
  <div>
    <div v-for="pos in positions" :key="pos">
      <Transition
        :transition="defaults.transition"
        :transition-duration="defaults.transitionDuration"
        :class="`${VT_NAMESPACE}__container ${pos}`"
      >
        <Toast
          v-for="toast in getPositionToasts(pos)"
          :key="toast.id"
          v-bind="toast"
        />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component, { mixins } from "vue-class-component";

import Toast from "./Toast.vue";
import Transition from "./Transition.vue";
import events from "../ts/events";
import { EVENTS, POSITION, VT_NAMESPACE } from "../ts/constants";
import PROPS from "../ts/propValidators";
import { PluginOptions, ToastOptions, ToastID } from "../types";

const CoreToastProps = Vue.extend({
  props: PROPS.CORE_TOAST
});
const ContainerProps = Vue.extend({
  props: PROPS.CONTAINER
});

@Component({
  components: { Toast, Transition }
})
export default class ToastContainer extends mixins(
  CoreToastProps,
  ContainerProps
) {
  count = 0;
  positions = Object.values(POSITION);
  toasts: {
    [toastId: number]: ToastOptions;
    [toastId: string]: ToastOptions;
  } = {};
  defaults: PluginOptions = {};
  VT_NAMESPACE = VT_NAMESPACE;

  get toastArray() {
    return Object.values(this.toasts);
  }
  get filteredToasts() {
    if (typeof this.defaults.filterToasts !== "undefined") {
      return this.defaults.filterToasts(this.toastArray);
    }
    return this.toastArray;
  }

  beforeMount() {
    this.setup();
    events.$on(EVENTS.ADD, this.addToast);
    events.$on(EVENTS.CLEAR, this.clearToasts);
    events.$on(EVENTS.DISMISS, this.dismissToast);
    events.$on(EVENTS.UPDATE, this.updateToast);
    events.$on(EVENTS.UPDATE_DEFAULTS, this.updateDefaults);
    this.defaults = this.$props;
  }

  setup() {
    this.container.appendChild(this.$el);
  }
  setToast(props: ToastOptions) {
    if (typeof props.id !== "undefined") {
      this.$set(this.toasts, props.id, props);
    }
  }
  addToast(params: ToastOptions) {
    const props = Object.assign({}, this.defaults, params);
    const filterBeforeCreate =
      typeof this.defaults.filterBeforeCreate === "undefined"
        ? (toast: ToastOptions) => toast
        : this.defaults.filterBeforeCreate;
    const toast = filterBeforeCreate(props, this.toastArray);
    toast && this.setToast(toast);
  }
  dismissToast(id: ToastID) {
    const toast = this.toasts[id];
    if (typeof toast !== "undefined" && typeof toast.onClose !== "undefined") {
      toast.onClose();
    }
    this.$delete(this.toasts, id);
  }
  clearToasts() {
    Object.keys(this.toasts).forEach((id: ToastID) => this.dismissToast(id));
  }
  getPositionToasts(position: POSITION) {
    const toasts = this.filteredToasts
      .filter(toast => toast.position === position)
      .slice(0, this.defaults.maxToasts);
    return this.defaults.newestOnTop ? toasts.reverse() : toasts;
  }
  updateDefaults(update: PluginOptions) {
    this.defaults = Object.assign({}, this.defaults, update);
  }
  updateToast({
    id,
    options,
    create
  }: {
    id: ToastID;
    options: ToastOptions;
    create: boolean;
  }) {
    if (this.toasts[id]) {
      // If a timeout is defined, and is equal to the one before, change it
      // a little so the progressBar is reset
      if (options.timeout && options.timeout === this.toasts[id].timeout) {
        options.timeout++;
      }
      this.setToast(Object.assign({}, this.toasts[id], options));
    } else if (create) this.addToast(Object.assign({}, { id }, options));
  }
}
</script>
