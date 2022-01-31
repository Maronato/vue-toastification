import {
  toRefs,
  ref,
  Ref,
  onMounted,
  onBeforeUnmount,
  computed,
  watch,
} from "vue"

import { isDOMRect, getX, getY } from "../utils"

import type { Draggable } from "../../types/common"

export const useDraggable = (
  el: Ref<HTMLElement | undefined>,
  props: Required<Draggable>
) => {
  // Extract used props
  const { draggablePercent, draggable } = toRefs(props)

  // Define state
  const dragRect = computed(() =>
    el.value ? el.value.getBoundingClientRect() : undefined
  )
  const dragStarted = ref(false)
  const beingDragged = ref(false)
  const dragPos = ref({ x: 0, y: 0 })
  const dragStart = ref(0)
  const dragDelta = computed(() =>
    beingDragged.value ? dragPos.value.x - dragStart.value : 0
  )
  const dragComplete = ref(false)

  // Computed state
  const removalDistance = computed(() =>
    isDOMRect(dragRect.value)
      ? (dragRect.value.right - dragRect.value.left) * draggablePercent.value
      : 0
  )

  // Update style to match drag
  watch(
    [el, dragStart, dragPos, dragDelta, removalDistance, beingDragged],
    () => {
      /* istanbul ignore else  */
      if (el.value) {
        el.value.style.transform = "translateX(0px)"
        el.value.style.opacity = "1"
        if (dragStart.value === dragPos.value.x) {
          el.value.style.transition = ""
        } else if (beingDragged.value) {
          el.value.style.transform = `translateX(${dragDelta.value}px)`
          el.value.style.opacity = `${
            1 - Math.abs(dragDelta.value / removalDistance.value)
          }`
        } else {
          el.value.style.transition = "transform 0.2s, opacity 0.2s"
        }
      }
    }
  )

  // Define handlers
  const onDragStart = (event: TouchEvent | MouseEvent) => {
    dragStarted.value = true
    dragPos.value = { x: getX(event), y: getY(event) }
    dragStart.value = dragPos.value.x
  }
  const onDragMove = (event: TouchEvent | MouseEvent) => {
    if (dragStarted.value) {
      beingDragged.value = true
      event.preventDefault()
      dragPos.value = { x: getX(event), y: getY(event) }
    }
  }
  const onDragEnd = () => {
    dragStarted.value = false
    if (beingDragged.value) {
      if (Math.abs(dragDelta.value) >= removalDistance.value) {
        dragComplete.value = true
      } else {
        setTimeout(() => {
          beingDragged.value = false
        })
      }
    }
  }

  onMounted(() => {
    if (draggable.value && el.value) {
      el.value.addEventListener("touchstart", onDragStart, {
        passive: true,
      })
      el.value.addEventListener("mousedown", onDragStart)
      addEventListener("touchmove", onDragMove, { passive: false })
      addEventListener("mousemove", onDragMove)
      addEventListener("touchend", onDragEnd)
      addEventListener("mouseup", onDragEnd)
    }
  })
  onBeforeUnmount(() => {
    /* istanbul ignore else  */
    if (draggable.value && el.value) {
      el.value.removeEventListener("touchstart", onDragStart)
      el.value.removeEventListener("mousedown", onDragStart)
      removeEventListener("touchmove", onDragMove)
      removeEventListener("mousemove", onDragMove)
      removeEventListener("touchend", onDragEnd)
      removeEventListener("mouseup", onDragEnd)
    }
  })

  return { dragComplete, beingDragged }
}
