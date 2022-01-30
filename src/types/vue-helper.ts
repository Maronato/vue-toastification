/* eslint-disable @typescript-eslint/ban-types */
// Taken from vue's own implementation

type NotUndefined<T> = T extends undefined ? never : T

type InferDefault<T> = T extends
  | null
  | number
  | string
  | boolean
  | symbol
  | Function
  ? T
  : () => T

export type InferDefaults<T> = {
  [K in keyof T]?: InferDefault<NotUndefined<T[K]>>
}
