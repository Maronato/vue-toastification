<template>
  <div>
    <div v-for="pos in positions" :key="pos">
      <BounceTransition
        tag="div"
        group
        :class="`${VT_NAMESPACE}__container ${pos}`"
      >
        <Toast
          v-for="toast in getPositionToasts(pos)"
          :key="toast.id"
          v-bind="toast"
        />
      </BounceTransition>
    </div>
  </div>
</template>

<script>
import Toast from "./Toast";
import events from "../js/events";
import { EVENTS, POSITION, VT_NAMESPACE } from "../js/constants";
import BounceTransition from "./transitions/BounceTransition";

export default {
  components: {
    Toast,
    BounceTransition
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
      default: Infinity
    },
    transition: {
      type: String,
      default: ""
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
    hideProgressBar: Boolean
  },
  data() {
    return {
      count: 0,
      positions: Object.values(POSITION),
      toasts: {},
      VT_NAMESPACE
    };
  },
  beforeMount() {
    this.setup();
  },
  mounted() {
    events.$on(EVENTS.ADD, this.addToast);
    events.$on(EVENTS.CLEAR, this.clearToasts);
    events.$on(EVENTS.DISMISS, this.dismissToast);
  },
  methods: {
    setup() {
      this.container.appendChild(this.$el);
    },
    addToast(params) {
      const props = Object.assign({}, this.$props, params);
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
        .slice(0, this.maxToasts);
      return this.newestOnTop ? toasts.reverse() : toasts;
    }
  }
};
</script>
