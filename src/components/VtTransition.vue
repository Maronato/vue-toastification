<template>
  <transition-group
    tag="div"
    :enter-active-class="
      getProp(transition, 'enter', `${transition}-enter-active`)
    "
    :move-class="getProp(transition, 'move', `${transition}-move`)"
    :leave-active-class="
      getProp(transition, 'leave', `${transition}-leave-active`)
    "
    @leave="leave"
  >
    <slot></slot>
  </transition-group>
</template>
<script lang="ts">
// Transition methods taken from https://github.com/BinarCode/vue2-transitions
import { defineComponent } from "vue"
import { getProp } from "../ts/utils"
import PROPS from "../ts/propValidators"

export default defineComponent({
  name: "VtTransition",
  props: PROPS.TRANSITION,

  emits: ["leave"],

  setup() {
    const leave = (el: unknown) => {
      if (el instanceof HTMLElement) {
        el.style.left = el.offsetLeft + "px"
        el.style.top = el.offsetTop + "px"
        el.style.width = getComputedStyle(el).width
        el.style.position = "absolute"
      }
    }
    return {
      getProp,
      leave,
    }
  },
})
</script>
