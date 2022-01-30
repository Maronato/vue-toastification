<template>
  <div ref="el" :style="style" :class="cpClass" />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from "vue"

import { VT_NAMESPACE } from "../ts/constants"
import PROPS from "../ts/propValidators"

export default defineComponent({
  name: "VtProgressBar",

  props: PROPS.PROGRESS_BAR,

  emits: ["close-toast"],

  setup(props, { emit }) {
    const el = ref<HTMLElement>()
    const hasClass = ref(true)

    const style = computed(() => {
      return {
        animationDuration: `${props.timeout}ms`,
        animationPlayState: props.isRunning ? "running" : "paused",
        opacity: props.hideProgressBar ? 0 : 1,
      }
    })

    const cpClass = computed(() =>
      hasClass.value ? `${VT_NAMESPACE}__progress-bar` : ""
    )

    watch(
      () => props.timeout,
      () => {
        hasClass.value = false
        nextTick(() => (hasClass.value = true))
      }
    )

    const animationEnded = () => emit("close-toast")

    onMounted(() => {
      /* istanbul ignore else  */
      if (el.value) {
        el.value.addEventListener("animationend", animationEnded)
      }
    })
    onBeforeUnmount(() => {
      /* istanbul ignore else  */
      if (el.value) {
        el.value.removeEventListener("animationend", animationEnded)
      }
    })

    return {
      el,
      style,
      cpClass,
    }
  },
})
</script>
