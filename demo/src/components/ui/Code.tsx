import { defineComponent, computed, ref } from "vue"
import { usePrism } from "../../hooks/prism"

export default defineComponent({
  name: "Code",

  emits: ["update:modelValue"],

  props: {
    lang: {
      type: String,
      required: true,
    },
  },

  setup(props, { slots }) {
    const code = computed(() => (slots.default ? slots.default() : ""))

    const codeRef = ref<Element | null>(null)

    usePrism(codeRef)

    return () => (
      <pre class="rounded-md shadow-xl">
        <code class={`lang-${props.lang}`} ref={codeRef}>
          {code.value}
        </code>
      </pre>
    )
  },
})
