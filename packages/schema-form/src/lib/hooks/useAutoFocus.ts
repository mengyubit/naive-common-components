import { ComputedRef, Ref } from "vue"
import { FormSchema, FormActionType, FormProps } from "../types/form"
import { unref, nextTick, watchEffect } from "vue"

interface UseAutoFocusContext {
  getSchema: ComputedRef<FormSchema[]>
  getProps: ComputedRef<FormProps>
  isInitedDefault: Ref<boolean>
  formElRef: Ref<FormActionType>
}
export async function useAutoFocus({
  getSchema,
  getProps,
  formElRef,
  isInitedDefault
}: UseAutoFocusContext) {
  watchEffect(async () => {
    if (unref(isInitedDefault) || !unref(getProps).autoFocusFirstItem) {
      return
    }
    await nextTick()
    const schemas = unref(getSchema)
    const formEl = unref(formElRef)
    const el = (formEl as any)?.$el as HTMLElement
    if (!formEl || !el || !schemas || schemas.length === 0) {
      return
    }
    // 看看
    // const firstItem = schemas[0]
    // if (!(firstItem.component as string[])?.includes("Input")) {
    //   return
    // }

    const inputEl = el.querySelector(".n-input") as Nullable<HTMLInputElement>
    if (!inputEl) return
    inputEl?.focus()
  })
}
