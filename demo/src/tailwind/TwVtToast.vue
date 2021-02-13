<template>
  <div
    ref="root"
    class="w-full max-w-sm mb-4 ml-auto overflow-hidden bg-green-500 rounded-lg shadow-md pointer-events-auto group ring-1 ring-black ring-opacity-5"
    :class="classes"
    :style="draggableStyle"
    @click="clickHandler"
    @mouseenter="hoverPause"
    @mouseleave="hoverPlay"
  >
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <VtIcon
            v-if="icon"
            class="w-6 h-6"
            :custom-icon="icon"
            :type="type"
            :class-name-extension="classNameExtension"
          />
        </div>
        <div class="ml-4 w-0 flex-1 pt-0.5">
          <p class="text-sm font-medium text-white">{{ content }}</p>
        </div>
        <div class="flex flex-shrink-0 ml-4">
          <button
            v-if="!!closeButton"
            :aria-label="accessibility.closeButtonLabel"
            class="inline-flex text-gray-300 transition-opacity rounded-md hover:text-gray-100"
            :class="{
              'opacity-0 group-hover:opacity-50 hover:opacity-100': showCloseButtonOnHover,
            }"
            @click.stop="closeToast"
          >
            <span class="sr-only">Close</span>
            <!-- Heroicon name: solid/x -->
            <svg
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <VtProgressBar
      v-if="timeout"
      class="relative w-full h-1 origin-left bg-white bg-opacity-25 b-0 l-0"
      :is-running="isRunning"
      :hide-progress-bar="hideProgressBar"
      :timeout="timeout"
      :class-name-extension="classNameExtension"
      @closeToast="timeoutHandler"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { VtToast, VtProgressBar, VtIcon } from "../vue-toastification"

export default defineComponent({
  name: "TwVtToast",
  components: { VtProgressBar, VtIcon },
  extends: VtToast,
})
</script>

<style lang="scss">
.Vue-Toastification_tw__progress-bar {
  //  z-index: (1000);
  animation: scale-x-frames linear 1 forwards;
  .Vue-Toastification_tw__toast--rtl & {
    right: 0;
    left: unset;
    transform-origin: right;
  }
}
</style>
