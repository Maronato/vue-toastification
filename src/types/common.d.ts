import type { Component } from "vue"
import type { EventBusInterface } from "../ts/eventBus"

export type ToastID = string | number

export type ClassNames = string | string[]

export interface EventBusable {
  /**
   * EventBus instance used to pass events across the interface
   *
   * Created by default, but you can use your own if you want
   */
  eventBus?: EventBusInterface
}

export interface Draggable {
  /**
   *  Position of the toast on the screen.
   *
   *  Can be any of top-right, top-center, top-left, bottom-right, bottom-center, bottom-left.
   */
  draggable?: boolean
  /**
   *  By how much of the toast width in percent (0 to 1) it must be dragged before being dismissed.
   */
  draggablePercent?: number
}

export interface Hoverable {
  /**
   *  Whether or not the toast is paused when it is hovered by the mouse.
   */
  pauseOnHover?: boolean
}

export interface Focusable {
  /**
   *  Whether or not the toast is paused when the window loses focus.
   */
  pauseOnFocusLoss?: boolean
}

export type Icon =
  | boolean
  | string
  | {
      iconTag?: keyof HTMLElementTagNameMap
      iconChildren?: string
      iconClass?: string
    }
  | Component
  | JSX.Element

export type Button =
  | false
  | keyof HTMLElementTagNameMap
  | Component
  | JSX.Element
