import { FormItemProps } from "naive-ui"
import { FormValidateCallback, ApplyRule } from "./form"

export interface FormItemCustom {
  validate?: {
    options: { trigger?: string; callback?: FormValidateCallback }
    shouldRuleBeApplied?: ApplyRule
  }
  getValues?: { [key: string]: any }
  disabled?: boolean
}

export type FormItem = FormItemProps & FormItemCustom
