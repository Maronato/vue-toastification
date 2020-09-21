import { computed, Ref } from "vue"
import { hasProp } from "../../vue-toastification/ts/utils"

export type Choice = { text: string; value: unknown }

const isChoice = (obj: unknown): obj is Choice =>
  hasProp(obj, "text") && hasProp(obj, "value")

export function useSelectable(
  choices: Ref<Choice[]>,
  emit: (event: "update:modelValue", choice: Choice | undefined) => void
) {
  const choiceMap = computed(() => {
    return new Map(choices.value.map((choice, idx) => [idx.toString(), choice]))
  })

  const valueMap = computed(() => {
    return new WeakMap(
      choices.value.map((choice, idx) => [choice, idx.toString()])
    )
  })

  const onChange = (eventOrChoice: Event | Choice) => {
    let choice: Choice | undefined

    if (isChoice(eventOrChoice)) {
      choice = eventOrChoice
    } else {
      choice = choiceMap.value.get(
        (eventOrChoice.target as HTMLSelectElement).value
      )
    }
    emit("update:modelValue", choice)
  }

  return { choiceMap, valueMap, onChange }
}
