import { defineComponent, computed } from "vue"
import "./style.scss"

export default defineComponent({
  name: "Switch",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit, slots }) {
    const defaultSlot = computed(() =>
      slots.default ? slots.default() : "Default"
    )
    return () => (
      <label for="toogleA" class="flex items-center cursor-pointer v-switch">
        <div class="relative">
          <input
            id="toogleA"
            type="checkbox"
            class="hidden"
            checked={props.modelValue}
            onChange={() => emit("update:modelValue", !props.modelValue)}
          />
          <div class="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
          <div class="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0"></div>
        </div>
        <div class="ml-3 text-gray-700 font-medium">{defaultSlot.value}</div>
      </label>
    )
  },
})
