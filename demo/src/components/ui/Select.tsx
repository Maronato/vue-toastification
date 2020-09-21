import { defineComponent, PropType, toRefs, computed } from "vue"
import { Choice, useSelectable } from "./selectable"

export default defineComponent({
  name: "Select",
  props: {
    modelValue: {
      type: Object as PropType<Choice>,
      required: true,
    },
    choices: {
      type: Array as PropType<Choice[]>,
      required: true,
    },
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const { modelValue, choices } = toRefs(props)

    const { onChange, valueMap } = useSelectable(choices, emit)

    return () => (
      <div class="inline-block relative w-full">
        <select
          class="block appearance-none text-gray-700 font-medium w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          value={valueMap.value.get(modelValue.value)}
          onChange={onChange}>
          {choices.value.map(choice => (
            <option value={valueMap.value.get(choice)}>{choice.text}</option>
          ))}
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg class="fill-current h-4 w-4" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    )
  },
})
