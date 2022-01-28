import { toRefs, ref, Ref, onMounted, onBeforeUnmount } from "vue"
import { ToastOptions } from "../../types"

export const useFocusable = (
  el: Ref<HTMLElement | undefined>,
  props: Required<Pick<ToastOptions, "pauseOnFocusLoss">>
) => {
  const { pauseOnFocusLoss } = toRefs(props)
  const focused = ref(true)
  const onFocus = () => (focused.value = true)
  const onBlur = () => (focused.value = false)
  onMounted(() => {
    if (el.value && pauseOnFocusLoss.value) {
      addEventListener("blur", onBlur)
      addEventListener("focus", onFocus)
    }
  })
  onBeforeUnmount(() => {
    if (el.value && pauseOnFocusLoss.value) {
      removeEventListener("blur", onBlur)
      removeEventListener("focus", onFocus)
    }
  })

  return { focused }
}
