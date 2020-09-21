import { onMounted, Ref, ref } from "vue"
import Prism from "prismjs"

// Configure prism
import "prismjs/plugins/autoloader/prism-autoloader.min.js"
import "prismjs/plugins/normalize-whitespace/prism-normalize-whitespace.min.js"
import "prismjs/plugins/toolbar/prism-toolbar.min.js"
import "prismjs/plugins/show-language/prism-show-language.min.js"

import "../assets/css/prismjs/plugins/toolbar.css"
import "../assets/css/prismjs/themes/material-dark.css"

Prism.plugins.autoloader.languages_path =
  "https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/components/"
Prism.languages.vue = Prism.languages.html

export const usePrism = (element: Ref<Element | null>) => {
  // Highlight code
  const isHighlighted = ref(false)
  onMounted(() => {
    if (!isHighlighted.value && element.value) {
      Prism.highlightElement(element.value)
      isHighlighted.value = true
    }
  })
}
