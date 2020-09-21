import {
  defineComponent,
  PropType,
  toRefs,
} from "vue"

import { Choice, useSelectable } from "../selectable"
import "./style.scss"

export default defineComponent({
  props: {
    choices: {
      type: Array as PropType<Choice[]>,
      required: true,
    },
    modelValue: {
      type: Object as PropType<Choice>,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { choices, modelValue, name } = toRefs(props)

    const { valueMap, onChange } = useSelectable(choices, emit)

    const isChecked = (choice: Choice) =>
      valueMap.value.get(choice) === valueMap.value.get(modelValue.value)

    return () => (
      <div>
        {choices.value.map((choice, idx) => (
          <div onClick={() => onChange(choice)}>
            <input
              id={`${name.value}-${idx}`}
              type="radio"
              name={name.value}
              class="hidden v-radio"
              value={valueMap.value.get(choice)}
              checked={isChecked(choice)}
            />
            <label
              for={`${name.value}-${idx}`}
              class="flex items-center cursor-pointer">
              <span class="w-4 h-4 inline-block mr-1 rounded-full border border-gray-400" />
              <div class="text-gray-700 font-medium">{choice.text}</div>
            </label>
          </div>
        ))}
      </div>
    )
  },
})
