import { toRefs, ref, Ref, onMounted, onBeforeUnmount } from "vue"
import { ToastOptions } from "../../types"

export const useHoverable = (
  el: Ref<HTMLElement | null>,
  props: Required<Pick<ToastOptions, "pauseOnHover">>
) => {
  const { pauseOnHover } = toRefs(props)
  const hovering = ref(false)

  const onEnter = () => (hovering.value = true)
  const onLeave = () => (hovering.value = false)
  onMounted(() => {
    if (el.value && pauseOnHover?.value) {
      el.value.addEventListener("mouseenter", onEnter)
      el.value.addEventListener("mouseleave", onLeave)
    }
  })
  onBeforeUnmount(() => {
    if (el.value && pauseOnHover?.value) {
      el.value.removeEventListener("mouseenter", onEnter)
      el.value.removeEventListener("mouseleave", onLeave)
    }
  })

  return { hovering }
}
