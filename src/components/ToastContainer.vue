<template>
  <div>
    <div v-for="pos in positions" :key="pos">
      <Transition
        :name="defaults.transition"
        :duration="defaults.transitionDuration"
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
import { isPositiveInt, isNonEmptyString } from "../js/utils";
import Transition from "./Transition";

export default {
  components: {
    Toast,
    Transition
  },
  props: {
    position: {
      type: String,
      default: POSITION.TOP_RIGHT
    },
    newestOnTop: {
      type: Boolean,
      default: true
    },
    maxToasts: {
      type: Number,
      default: 20,
      validator: value => isPositiveInt(value)
    },
    transition: {
      type: [Object, String],
      default: "bounce",
      validator: value =>
        isNonEmptyString(value) ||
        ["enter", "leave", "move"].every(k => isNonEmptyString(value[k]))
    },
    transitionDuration: {
      type: [Number, Object],
      default: 750,
      validator: value =>
        isPositiveInt(value) ||
        (isPositiveInt(value.enter) && isPositiveInt(value.leave))
    },
    draggable: {
      type: Boolean,
      default: true
    },
    draggablePercent: {
      type: Number,
      default: 0.6
    },
    pauseOnFocusLoss: {
      type: Boolean,
      default: true
    },
    pauseOnHover: {
      type: Boolean,
      default: true
    },
    closeOnClick: {
      type: Boolean,
      default: false
    },
    timeout: {
      type: [Number, Boolean],
      default: 5000
    },
    container: {
      type: Element,
      default: () => document.body
    },
    toastClassName: {
      type: [Array, String],
      default: () => []
    },
    bodyClassName: {
      type: [Array, String],
      default: () => []
    },
    hideProgressBar: Boolean,
    hideCloseButton: Boolean,
    icon: {
      type: [String, Boolean],
      default: true
    }
  },
  data() {
    return {
      count: 0,
      positions: Object.values(POSITION),
      toasts: {},
      VT_NAMESPACE,
      defaults: {}
    };
  },
  beforeMount() {
    this.setup();
    events.$on(EVENTS.ADD, this.addToast);
    events.$on(EVENTS.CLEAR, this.clearToasts);
    events.$on(EVENTS.DISMISS, this.dismissToast);
    events.$on(EVENTS.UPDATE_DEFAULTS, this.updateDefaults);
    this.defaults = this.$props;
  },
  methods: {
    setup() {
      this.container.appendChild(this.$el);
    },
    addToast(params) {
      const props = Object.assign({}, this.defaults, params);
      this.$set(this.toasts, props.id, props);
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
      const toasts = Object.values(this.toasts)
        .filter(toast => toast.position === position)
        .slice(0, this.defaults.maxToasts);
      return this.defaults.newestOnTop ? toasts.reverse() : toasts;
    },
    updateDefaults(update) {
      this.defaults = Object.assign({}, this.defaults, update);
    }
  }
};
</script>
