<template>
  <VtToast
    v-slot="slotProps"
    class="w-full max-w-sm mb-4 ml-auto overflow-hidden bg-green-600 rounded-lg shadow-md pointer-events-auto group ring-1 ring-black ring-opacity-5"
    class-extension="_tw"
    progress-bar-class="relative w-full h-1 origin-left bg-white bg-opacity-25 b-0 l-0"
  >
    <div class="p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <VtIcon
            v-if="slotProps.icon"
            class="w-6 h-6"
            :custom-icon="slotProps.icon"
            :type="slotProps.type"
            class-extension="_tw"
          />
        </div>
        <div class="ml-4 w-0 flex-1 pt-0.5">
          <p class="text-sm font-medium text-white">{{ slotProps.content }}</p>
        </div>
        <div class="flex flex-shrink-0 ml-4">
          <button
            v-if="!!slotProps.closeButton"
            class="inline-flex text-gray-300 transition-opacity rounded-md hover:text-gray-100"
            :class="{
              'opacity-0 group-hover:opacity-50 hover:opacity-100':
                slotProps.showOnHover,
            }"
            @click.stop="slotProps.closeToast"
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
  </VtToast>
</template>

<script lang="ts">
import { defineComponent } from "vue"

import { VtToast, VtIcon } from "../vue-toastification"

export default defineComponent({
  name: "TwVtToast",
  components: { VtToast, VtIcon },
})
</script>
