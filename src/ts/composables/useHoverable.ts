import { toRefs, ref, Ref, onMounted, onBeforeUnmount } from "vue"

import type { Hoverable } from "../../types/common"

export const useHoverable = (
  el: Ref<HTMLElement | undefined>,
  props: Required<Hoverable>
) => {
  const { pauseOnHover } = toRefs(props)
  const hovering = ref(false)

  const onEnter = () => (hovering.value = true)
  const onLeave = () => (hovering.value = false)
  onMounted(() => {
    if (el.value && pauseOnHover.value) {
      el.value.addEventListener("mouseenter", onEnter)
      el.value.addEventListener("mouseleave", onLeave)
    }
  })
  onBeforeUnmount(() => {
    if (el.value && pauseOnHover.value) {
      el.value.removeEventListener("mouseenter", onEnter)
      el.value.removeEventListener("mouseleave", onLeave)
    }
  })

  return { hovering }
}
