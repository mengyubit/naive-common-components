import * as Vue from "vue"
import { Component } from "vue"
export type Field = string

export type ArrayField = Array<Field> | Field
export type GeneralField = Array<Field> | Field

class Helper<Props> {
  Return = Vue.defineComponent({} as { props: Record<keyof Props, any> })
}

export type DefineComponent<Props> = Helper<Props>["Return"]

export type FormPathPattern =
  | string
  | number
  | Array<string | number>
  | RegExp
  | (((address: Array<string | number>) => boolean) & {
      path: any
    })

export type IArrayFieldProps = IFieldProps
export type IObjectFieldProps = IFieldProps
export type VueComponent = Component

export type JSXComponent = any

export interface IFieldProps<
  Decorator extends JSXComponent = any,
  Component extends JSXComponent = any,
  TextType = any,
  ValueType = any
> {
  name: FormPathPattern
  basePath?: FormPathPattern
  title?: TextType
  description?: TextType
  value?: ValueType
  initialValue?: ValueType
  required?: boolean
  hidden?: boolean
  visible?: boolean
  editable?: boolean
  disabled?: boolean
  readOnly?: boolean
  readPretty?: boolean
  dataSource?: FieldDataSource
  validateFirst?: boolean
  data?: any
}

export type FieldDataSource = {
  label?: any
  value?: any
  title?: any
  key?: any
  text?: any
  children?: FieldDataSource
  [key: string]: any
}[]
