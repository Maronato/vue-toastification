<template>
  <div
    ref="root"
    class="w-full max-w-sm mb-3 ml-auto overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto group ring-1 ring-black ring-opacity-5"
    :class="classes"
    :style="draggableStyle"
    @click="clickHandler"
    @mouseenter="hoverPause"
    @mouseleave="hoverPlay"
  >
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <IconTw
            v-if="icon"
            class="w-6 h-6 text-green-600"
            :custom-icon="icon"
            :type="type"
          />
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
          <p class="text-sm font-medium text-gray-900">{{ content }}</p>
          <p class="mt-1 text-sm text-gray-500">
            Need to add a property for this line
          </p>
        </div>
        <div class="flex flex-shrink-0 ml-4">
          <CloseButtonTw
            v-if="!!closeButton"
            :component="closeButton"
            :class-names="closeButtonClassName"
            :show-on-hover="showCloseButtonOnHover"
            :aria-label="accessibility.closeButtonLabel"
            @click.stop="closeToast"
          />
        </div>
      </div>
    </div>
    <ProgressBarTw
      v-if="timeout"
      class="relative bg-black bg-opacity-25"
      :is-running="isRunning"
      :hide-progress-bar="hideProgressBar"
      :timeout="timeout"
      @closeToast="timeoutHandler"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import CloseButtonTw from "./TwVtCloseButton.vue"
import ProgressBarTw from "./TwVtProgressBar.vue"
import IconTw from "./TwVtIcon.vue"
import { VtToast } from "../vue-toastification"

export default defineComponent({
  name: "TwVtToast",
  components: { CloseButtonTw, ProgressBarTw, IconTw },
  extends: VtToast,
  created() {
    this.nsExtension = "_tw"
  },
})
</script>
