/* eslint-disable */
import { VNode } from "vue"

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
