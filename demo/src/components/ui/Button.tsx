import { computed, defineComponent, toRef } from "vue"

export default defineComponent({
  name: "Button",
  props: {
    class: {
      type: String,
      default:
        "font-medium py-2 px-4 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors duration-200",
    },
  },
  setup(props, { slots }) {
    const classes = toRef(props, "class")
    const text = computed(() => (slots.default ? slots.default() : ""))

    return () => <button class={classes.value}>{text.value}</button>
  },
})
