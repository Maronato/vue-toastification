import { defineComponent, toRefs } from "vue"

export default defineComponent({
  name: "Input",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    ariaLabel: {
      type: String,
      default: "",
    },
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const { modelValue, ariaLabel, placeholder } = toRefs(props)

    const change = (event: Event) =>
      emit("update:modelValue", (event.target as HTMLInputElement).value)

    return () => (
      <div class="flex items-center border-b border-teal-500 py-2">
        <input
          class="appearance-none bg-transparent border-none w-full text-gray-700 font-medium mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder={placeholder.value}
          aria-label={ariaLabel.value}
          value={modelValue.value}
          onInput={change}
        />
      </div>
    )
  },
})
