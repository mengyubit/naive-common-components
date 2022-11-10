import {
  ApplyRule,
  FormActionType,
  FormProps,
  FormValidateCallback
} from "../types/form"

import { createContext, useContext } from "./tools/useContext"
import { ComputedRef, InjectionKey, Ref } from "vue"
import { Field } from "../types/field"
import { FormSchema } from "../types/form"

export const FieldKey: InjectionKey<Ref<Field>> = Symbol("field")
export const FieldSchemaKey: InjectionKey<Ref<FormSchema>> = Symbol(
  "fieldSchema"
)

export interface FormContextProps {
  setFormModel: (key: string, value: any, modal?: Recordable) => void
  appendArraySchemaItems: (
    items: FormSchema[] | FormSchema,
    path: string,
    index?: number
  ) => void
  removeArraySchemaItems: (path: string, index?: number) => void
  getSchemaByPath: (
    path: string
  ) => {
    schemaListVal: FormSchema[]
    pathIndex: number
  }
  validate: (
    validateCallback?: FormValidateCallback,
    shouldRuleBeApplied?: ApplyRule
  ) => void
  formModel: Recordable
  formActionType: Partial<FormActionType>
  getBindValues: ComputedRef<Recordable>
}
export interface FieldParentParent {
  parentModel: Recordable
}

type ArrayItemModalType =
  | "push"
  | "unshift"
  | "splice"
  | "pop"
  | "shift"
  | "remove"

export interface ArrayItemModal {
  setArrayFormModel: (
    type: ArrayItemModalType,
    index?: number,
    value?: Nullable<Recordable>
  ) => void
  getArrayFormModel: (index?: number) => Recordable
}
const key: InjectionKey<FormContextProps> = Symbol()

const FieldParentParentKey: InjectionKey<FieldParentParent> = Symbol()

const FieldModalKey: InjectionKey<Recordable> = Symbol()

export function createFormContext(context: FormContextProps) {
  return createContext<FormContextProps>(context, key)
}

export function useFormContext() {
  return useContext<FormContextProps>(key)
}

export function createField(context: Field) {
  return createContext<Field>(context, FieldKey)
}

export function useField() {
  return useContext<Field>(FieldKey)
}

export function createFieldSchema(context: Ref<FormSchema>) {
  return createContext<Ref<FormSchema>>(context, FieldSchemaKey)
}

export function useFieldSchema() {
  return useContext<Ref<FormSchema>>(FieldSchemaKey)
}

export function createFieldParent(context: FieldParentParent) {
  return createContext<FieldParentParent>(context, FieldParentParentKey)
}

export function useFieldParent() {
  return useContext<FieldParentParent>(FieldParentParentKey)
}

export function createFieldModal(context: ArrayItemModal) {
  return createContext<ArrayItemModal>(context, FieldModalKey)
}

export function useFieldModal() {
  return useContext<ArrayItemModal>(FieldModalKey)
}
