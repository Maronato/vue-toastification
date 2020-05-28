<template>
  <div>
    <div v-for="pos in positions" :key="pos">
      <VtTransition
        :transition="defaults.transition"
        :transition-duration="defaults.transitionDuration"
        :class="getClasses(pos)"
      >
        <Toast
          v-for="toast in getPositionToasts(pos)"
          :key="toast.id"
          v-bind="toast"
        />
      </VtTransition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { EVENTS, POSITION, VT_NAMESPACE } from "../ts/constants";
import PROPS, { PluginOptionsType } from "../ts/propValidators";
import {
  PluginOptions,
  ToastID,
  ToastOptionsAndContent,
  ToastOptionsAndRequiredContent,
} from "../types";
import { removeElement, isUndefined, isFunction } from "../ts/utils";

import Toast from "./VtToast.vue";
import VtTransition from "./VtTransition.vue";

export default Vue.extend({
  components: { Toast, VtTransition },

  props: Object.assign({}, PROPS.CORE_TOAST, PROPS.CONTAINER, PROPS.TRANSITION),

  data() {
    const data: {
      count: number;
      positions: POSITION[];
      toasts: {
        [toastId: number]: ToastOptionsAndRequiredContent;
        [toastId: string]: ToastOptionsAndRequiredContent;
      };
      defaults: PluginOptionsType;
    } = {
      count: 0,
      positions: Object.values(POSITION),
      toasts: {},
      defaults: {} as PluginOptionsType,
    };
    return data;
  },

  computed: {
    toastArray(): ToastOptionsAndRequiredContent[] {
      return Object.values(this.toasts);
    },
    filteredToasts(): ToastOptionsAndRequiredContent[] {
      return this.defaults.filterToasts(this.toastArray);
    },
  },

  beforeMount() {
    this.setup(this.container);
    const events = this.eventBus;
    events.$on(EVENTS.ADD, this.addToast);
    events.$on(EVENTS.CLEAR, this.clearToasts);
    events.$on(EVENTS.DISMISS, this.dismissToast);
    events.$on(EVENTS.UPDATE, this.updateToast);
    events.$on(EVENTS.UPDATE_DEFAULTS, this.updateDefaults);
    this.defaults = this.$props as PluginOptionsType;
  },

  methods: {
    async setup(container: PluginOptionsType["container"]) {
      if (isFunction(container)) {
        container = await container();
      }
      removeElement(this.$el);
      container.appendChild(this.$el);
    },
    setToast(props: ToastOptionsAndRequiredContent) {
      if (!isUndefined(props.id)) {
        this.$set(this.toasts, props.id, props);
      }
    },
    addToast(params: ToastOptionsAndRequiredContent) {
      const props = Object.assign(
        {},
        this.defaults,
        params.type &&
          this.defaults.toastDefaults &&
          this.defaults.toastDefaults[params.type],
        params
      );
      const toast = this.defaults.filterBeforeCreate(props, this.toastArray);
      toast && this.setToast(toast);
    },
    dismissToast(id: ToastID) {
      const toast = this.toasts[id];
      if (!isUndefined(toast) && !isUndefined(toast.onClose)) {
        toast.onClose();
      }
      this.$delete(this.toasts, id);
    },
    clearToasts() {
      Object.keys(this.toasts).forEach((id: ToastID) => {
        this.dismissToast(id);
      });
    },
    getPositionToasts(position: POSITION) {
      const toasts = this.filteredToasts
        .filter((toast) => toast.position === position)
        .slice(0, this.defaults.maxToasts);
      return this.defaults.newestOnTop ? toasts.reverse() : toasts;
    },
    updateDefaults(update: PluginOptions) {
      // Update container if changed
      if (!isUndefined(update.container)) {
        this.setup(update.container);
      }
      this.defaults = Object.assign({}, this.defaults, update);
    },
    updateToast({
      id,
      options,
      create,
    }: {
      id: ToastID;
      options: ToastOptionsAndContent;
      create: boolean;
    }) {
      if (this.toasts[id]) {
        // If a timeout is defined, and is equal to the one before, change it
        // a little so the progressBar is reset
        if (options.timeout && options.timeout === this.toasts[id].timeout) {
          options.timeout++;
        }
        this.setToast(Object.assign({}, this.toasts[id], options));
      } else if (create) {
        this.addToast(
          Object.assign({}, { id }, options as ToastOptionsAndRequiredContent)
        );
      }
    },
    getClasses(position: POSITION) {
      const classes = [`${VT_NAMESPACE}__container`, position];
      return classes.concat(this.defaults.containerClassName);
    },
  },
});
</script>
