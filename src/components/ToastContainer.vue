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

<script>
import Toast from "./Toast";
import events from "../js/events";
import { EVENTS, POSITION, VT_NAMESPACE } from "../js/constants";
import PROPS from "../js/propValidators";
import Transition from "./Transition";

export default {
  components: {
    Toast,
    Transition
  },
  props: PROPS.CONTAINER,
  data() {
    return {
      count: 0,
      positions: Object.values(POSITION),
      toasts: {},
      VT_NAMESPACE,
      defaults: {}
    };
  },
  computed: {
    toastArray() {
      return Object.values(this.toasts);
    },
    filteredToasts() {
      return this.defaults.filterToasts(this.toastArray);
    }
  },
  beforeMount() {
    this.setup();
    events.$on(EVENTS.ADD, this.addToast);
    events.$on(EVENTS.CLEAR, this.clearToasts);
    events.$on(EVENTS.DISMISS, this.dismissToast);
    events.$on(EVENTS.UPDATE, this.updateToast);
    events.$on(EVENTS.UPDATE_DEFAULTS, this.updateDefaults);
    this.defaults = this.$props;
  },
  methods: {
    setup() {
      this.container.appendChild(this.$el);
    },
    setToast(props) {
      this.$set(this.toasts, props.id, props);
    },
    addToast(params) {
      const props = Object.assign({}, this.defaults, params);
      const toast = this.defaults.filterBeforeCreate(props, this.toastArray);
      toast && this.setToast(toast);
    },
    dismissToast(id) {
      if (this.toasts[id].onClose) {
        this.toasts[id].onClose();
      }
      this.$delete(this.toasts, id);
    },
    clearToasts() {
      Object.keys(this.toasts).forEach(id => this.dismissToast(id));
    },
    getPositionToasts(position) {
      const toasts = this.filteredToasts
        .filter(toast => toast.position === position)
        .slice(0, this.defaults.maxToasts);
      return this.defaults.newestOnTop ? toasts.reverse() : toasts;
    },
    updateDefaults(update) {
      this.defaults = Object.assign({}, this.defaults, update);
    },
    updateToast({ id, options, create }) {
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
};
</script>
