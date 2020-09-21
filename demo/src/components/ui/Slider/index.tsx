import {
  onMounted,
  ref,
  defineComponent,
  PropType,
  onUnmounted,
  watch,
  toRefs,
  computed,
} from "vue"
import nouislider from "nouislider"
import "./style.scss"

export default defineComponent({
  name: "Slider",
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    range: {
      type: Object as PropType<[number, number]>,
      required: true,
    },
    step: {
      type: Number,
      default: 0.1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const { modelValue, range, disabled, step } = toRefs(props)

    const sliderRef = ref<HTMLElement | null>(null)
    const slider = ref<nouislider.noUiSlider | null>(null)

    const sliderValue = () => {
      if (slider.value) {
        return parseFloat(slider.value.get() as string)
      } else {
        return modelValue.value
      }
    }

    watch(modelValue, () => {
      if (slider.value && sliderValue() !== modelValue.value) {
        slider.value.set(modelValue.value)
      }
    })

    onMounted(() => {
      if (sliderRef.value) {
        slider.value = nouislider.create(sliderRef.value, {
          start: modelValue.value,
          connect: "lower",
          tooltips: true,
          step: step.value,
          range: {
            min: range.value[0],
            max: range.value[1],
          },
        })

        slider.value.on("update", async () => {
          if (slider.value) {
            emit("update:modelValue", sliderValue())
          }
        })
      }
    })

    onUnmounted(() => {
      if (slider.value) {
        slider.value.destroy()
      }
    })

    return () => (
      <div {...(disabled.value ? { disabled: true } : {})} ref={sliderRef} />
    )
  },
})
