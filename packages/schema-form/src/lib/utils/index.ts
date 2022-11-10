import { Slots, InjectionKey } from "vue"
import { isArray, isFunction } from "./is"
export * from "./uuid"
export * from "./is"
export * from "./field"
export * from "./deep"

export function getSlot(slots: Slots, slot = "default", data?: any) {
  if (!slots || !Reflect.has(slots, slot)) {
    return null
  }
  if (!isFunction(slots[slot])) {
    return null
  }
  const slotFn = slots[slot]
  if (!slotFn) return null
  return slotFn(data)
}

export type MaybeArray<T> = T | T[]

export function createInjectionKey<T>(key: string): InjectionKey<T> {
  return key as any
}

export function composeExport<T0 extends {}, T1 extends {}>(
  s0: T0,
  s1: T1
): T0 & T1 {
  return Object.assign(s0, s1)
}

export function toArr<T = any>(number: T): T[] {
  if (isArray(number)) return number
  else return [number]
}
