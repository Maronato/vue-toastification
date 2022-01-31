<template>
  <div ref="el" :style="style" :class="cpClass" />
</template>

<script lang="ts" setup>
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue"

import { VT_NAMESPACE } from "../ts/constants"
import { TOAST_DEFAULTS } from "../ts/propValidators"

import type { BaseToastOptions } from "../types/toast"

interface ProgressBarProps {
  timeout?: BaseToastOptions["timeout"]
  hideProgressBar?: BaseToastOptions["hideProgressBar"]
  isRunning?: boolean
}

const emit = defineEmits(["close-toast"])
const props = withDefaults(defineProps<ProgressBarProps>(), {
  hideProgressBar: TOAST_DEFAULTS.hideProgressBar,
  isRunning: false,
  timeout: TOAST_DEFAULTS.timeout,
})

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
</script>
