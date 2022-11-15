import { VNode, CSSProperties, StyleValue, Ref, VNodeChild } from "vue"
import {
  FormRules,
  FormItemRule,
  FormValidationError,
  GlobalThemeOverrides,
  GridProps,
  GridItemProps
} from "naive-ui"
import { FormItemProps, PopoverProps, ColProps } from "naive-ui"
import { ComponentMapKeyType, ComponentMapType } from "./component"

export type Rule = {
  trigger?: "blur" | "change" | ["change", "blur"]
}

type formatType = "string" | "number" | "boolean" | "date"

export interface RenderCallbackParams {
  schema?: FormSchema
  values?: Recordable
  model?: Recordable
  field?: string
  path?: string
  bindVal?: Ref<any>
}

export interface ButtonProps {
  color?: string | undefined
  loading?: boolean | undefined
  disabled?: boolean | undefined
  preIcon?: string | undefined
  postIcon?: string | undefined
  iconSize?: number | undefined
  onClick?: ((...args: any[]) => any) | undefined
  text?: string
}

export type RenderCallbackFn<T> = (
  renderCallbackParams: RenderCallbackParams
) => T

export interface FormActionType {
  getFormModal: () => Recordable
  initDefault: () => void
  submit: <T>() => Promise<T | Recordable>
  setFieldsValue: <T>(values: T) => Promise<void>
  resetFields: (formModalValue?: Recordable) => Promise<void>
  getFieldsValue: () => Recordable
  restoreValidation: () => void
  updateFieldsValue: <T>(values: T) => Promise<void>
  updateSchemaByPath: (
    data:
      | (Partial<FormSchema> & { path: string })
      | Array<Partial<FormSchema> & { path: string }>
  ) => Promise<void>
  resetSchema: (
    data: Partial<FormSchema> | Partial<FormSchema>[]
  ) => Promise<void>
  setProps: (formProps: Partial<FormProps>) => Promise<void>
  removeSchemaByPath: (field: string | string[]) => Promise<void>
  replaceSchemaByField: (
    schema: FormSchema | FormSchema[],
    predField?: string,
    nextField?: string
  ) => Promise<void>
  appendSchemaByPath: (
    schema: FormSchema | FormSchema[],
    prefixField: string,
    first?: boolean | undefined
  ) => Promise<void>
  validateFields: (
    field: string[],
    options: { trigger?: string; callback?: FormValidateCallback },
    shouldRuleBeApplied?: ApplyRule
  ) => Promise<any>
  validate: (
    validateCallback?: FormValidateCallback,
    shouldRuleBeApplied?: ApplyRule
  ) => Promise<any>
  clearValidate: () => Promise<void>
  setLoading: (loading: boolean) => void
}

export type ApplyRule = (rule: FormItemRule) => boolean
export type FormValidateCallback = (
  errors?: Array<FormValidationError>,
  errorArr?: Array<FormValidationError>
) => void

export type RegisterFn = (formInstance: FormActionType) => void

export type UseFormReturnType = [RegisterFn, FormActionType]

export interface FormProps {
  fieldMapToTime: any
  // Whether to disable
  disabled?: boolean
  isEditMode?: boolean
  inline: boolean
  // The width of all items in the entire form
  labelWidth?: number | string
  //alignment
  labelAlign?: "left" | "right"
  labelPlacement?: "left" | "top"
  labelExtraRender?: (content: {
    info?: string
    style?: CSSProperties
  }) => VNode
  // Form value
  model?: Recordable
  rules?: FormRules
  showFeedback?: boolean
  showLabel?: boolean
  showRequireMark?: boolean
  requireMarkPlacement?: "left" | "right"
  // Internal component size of the form
  size?: "default" | "small" | "large"
  onSubmit?: () => (e: Event) => void
  itemStyle?: { [key: string]: string | number }
  //Row configuration for the entire form
  rowProps?: GridProps & { style?: CSSProperties }

  baseColProps?: Partial<ColProps>

  // General row style
  baseRowStyle?: CSSProperties

  // Form configuration rules
  schemas?: FormSchema[]

  // Submit form on reset
  submitOnReset?: boolean

  // Auto submit on press enter on input
  autoSubmitOnEnter?: boolean

  // Whether to show collapse and expand buttons
  showAdvancedButton?: boolean
  autoFocusFirstItem?: boolean
  autoSetPlaceHolder?: boolean
  rulesMessageJoinLabel?: boolean
  // loading status
  loading?: boolean
  resetFunc?: () => Promise<void>
  submitFunc?: () => Promise<void>
  transformDateFunc?: (date: any) => string
  themeOverrides?: GlobalThemeOverrides
  formSubmitRequestFn?: (values?: Recordable) => Promise<any>
}

export interface FormSchema {
  effect?: (...args: Nullable<Recordable>[]) => void

  apiConfig?: ApiConfig
  labelExtra?: { info?: string; style?: CSSProperties }
  // value name
  valuePropsName?: string
  // Field name
  field?: string
  // Event name triggered by internal value change, default change
  changeEvent?: string
  // Variable name bound to v-model Default value
  valueField?: string
  // Label name
  label?:
    | string
    | ((
        renderCallbackParams: RenderCallbackParams,
        formActionType: Partial<FormActionType>,
        renderMessageOrigin?: () => VNodeChild
      ) => VNodeChild)
  // Label width, if it is passed,  configured by itemProps will be invalid
  labelWidth?: string | number
  // render component
  component?: ComponentMapKeyType | "div"
  // Component parameters
  componentProps?:
    | ((opt: {
        schema: FormSchema
        tableAction: any
        formActionType: FormActionType
        formModel: Recordable
        bindVal: Ref<any>
        path: string
      }) => ComponentMapType[ComponentMapKeyType])
    | ComponentMapType[ComponentMapKeyType]

  // Required
  required?: boolean | RenderCallbackFn<boolean>
  suffix?: string | number | RenderCallbackFn<string | number>

  // Validation rules
  rules?: FormRules | FormItemRule[] | ((...args) => FormRules | FormItemRule[])
  // Check whether the information is added to the label
  rulesMessageJoinLabel?: boolean

  //
  useDefaultRules?: boolean

  // Reference formModelItem
  itemProps?: Partial<FormItemProps> | Recordable

  itemStyle?: Partial<{
    contentStyle: CSSProperties | undefined
    headerStyle: CSSProperties | undefined
    [key: string]: string | number | StyleValue | undefined
  }>

  // col configuration outside formModelItem
  // blank表示右侧空白的span
  colProps?: Partial<GridItemProps> & { blankSpan?: number } & {
    style?: CSSProperties
  }

  // 默认值
  defaultValue?: any
  isAdvanced?: boolean

  // Matching details components
  span?: any

  ifShow?: boolean | RenderCallbackFn<boolean>

  show?: boolean | RenderCallbackFn<boolean>

  // Render the content in the form-item tag
  render?: RenderCallbackFn<VNode | VNode[] | string>

  // Rendering col content requires outer wrapper form-item
  renderColContent?: RenderCallbackFn<VNode | VNode[] | string>
  // rendering component slot
  renderComponentContent?:
    | ((renderCallbackParams: RenderCallbackParams, onBlur?: Fn) => VNodeChild)
    | VNode
    | VNode[]
    | string

  // Custom slot, in from-item
  slot?: string

  // Custom slot, similar to renderColContent
  colSlot?: string

  helpComponentProps?: Partial<HelpComponentProps>

  subLabel?: string
  helpMessage?: string | string[] | RenderCallbackFn<string | string[]>

  dynamicDisabled?: boolean | RenderCallbackFn<boolean>

  dynamicRules?: (params: Recordable) => FormItemRule[] | FormItemRule

  type?: "string" | "array" | "object" | "void"

  rowProps?: GridProps & { style?: CSSProperties }
  items?: FormSchema[] | FormSchema[][]
  format?: formatType | ((val: formatType) => any)

  // Whether to trigger validate when the value changes
  isValidateTrigger?: boolean

  helpComponentSlot?: () => {
    content?: () => VNodeChild
  }
}

type PickProps<T, P> = P extends keyof T ? T[P] : never

export interface HelpComponentProps {
  maxWidth?: number
  showIndex?: boolean
  color?: string
  backgroundColor?: string
  fontSize?: string
  placement?: PickProps<Pick<PopoverProps, "placement">, "placement">
  text: string[] | string
  x?: number | string
  y?: number | string
  transform?: string
  right?: string
  left?: string
}

export interface ApiConfig {
  api: (...arg: Recordable[]) => Promise<Recordable | any>
  params?: Recordable
  handleDataFn?: (arg: Recordable) => Recordable
  optionsKey?: string
  resultField?: string
  labelField?: string
  valueField?: string
  loadingFiled?: string
  numberToString?: boolean
}

export type OptionsItem = { label: string; value: string; disabled?: boolean }

export interface FormSymbol {
  formModal: Recordable
  setFormModel: (arg: Recordable) => void
}
