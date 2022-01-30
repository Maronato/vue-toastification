/* eslint-disable @typescript-eslint/ban-types */
// Taken from vue's own implementation

type NotUndefined<T> = T extends undefined ? never : T

export type InferDefaults<T> = {
  [K in keyof T]?: NotUndefined<T[K]> extends
    | number
    | string
    | boolean
    | symbol
    | Function
    ? NotUndefined<T[K]>
    : () => NotUndefined<T[K]>
}
