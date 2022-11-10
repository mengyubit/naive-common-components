import moment from "moment"
import { FormItemRule, GlobalThemeOverrides } from "naive-ui"
import { isNumber, isObject, isString } from "./utils/is"
import { ComponentMapKeyType } from "./types/component"

const DATE_TYPE = [
  "n-date-picker",
  "n-month-picker",
  "n-week-picker",
  "n-time-picker"
]

function genType() {
  return [...DATE_TYPE, "n-range-picker"]
}

export function processDateValue(attr: Recordable, component: string) {
  const { valueFormat, value } = attr
  if (valueFormat) {
    attr.value = isObject(value) ? moment(value).format(valueFormat) : value
  } else if (DATE_TYPE.includes(component) && value) {
    attr.value = moment(attr.value)
  }
}

// to string
export function handleInputNumberValue(component?: string, val?: any) {
  if (!component || !isString(component)) return val
  if (["n-input"].includes(component)) {
    return val && isNumber(val) ? `${val}` : val
  }
  return val
}

export const dateItemType = genType()

export function createPlaceholderMessage(
  component: ComponentMapKeyType | "div"
) {
  if (!isString(component)) return "Please"
  component = component.toLocaleLowerCase() as ComponentMapKeyType
  if (isString(component)) {
    if (component.includes("input")) {
      return 'Please enter'
    }
    if (component.includes("picker")) {
      return 'Please select'
    }
    if (
      component.includes("select") ||
      component.includes("cascader") ||
      component.includes("checkbox") ||
      component.includes("radio") ||
      component.includes("switch")
    ) {
      // return `请选择${label}`;
      return 'Please select'
    }
    return ""
  } else {
    return ""
  }
}

export function setComponentRuleType(
  rule: FormItemRule,
  component: ComponentMapKeyType | "div",
  valueFormat: string
) {
  if (!isString(component)) return
  if (["n-date-picker", "n-time-picker"].includes(component)) {
    rule.type = valueFormat ? "string" : "object"
  } else if (
    [
      "n-range-picker",
      "n-upload",
      "n-checkbox-group",
      "n-time-picker"
    ].includes(component)
  ) {
    rule.type = "array"
  } else if (["n-input-number"].includes(component)) {
    rule.type = "number"
  }
}

export function createTrigger(component: ComponentMapKeyType | "div") {
  if (!isString(component)) return "change"
  component = component.toLocaleLowerCase() as ComponentMapKeyType

  if (component.includes("select") || component.includes("picker")) {
    // return `请选择${label}`;
    return ["blur", "change"]
  }
  if (component.includes("input")) {
    return ["input", "blur"]
  }
  if (
    component.includes("cascader") ||
    component.includes("checkbox") ||
    component.includes("radio") ||
    component.includes("switch") ||
    component.includes("transfer")
  ) {
    return "change"
  }
  return ""
}

export function createThemeOverrides(
  theme: GlobalThemeOverrides,
  component: ComponentMapKeyType | "div"
) {
  if (!isString(component)) return
  component = component.toLocaleLowerCase() as ComponentMapKeyType

  const themeName = component.replace(/-([a-z])/g, function(keb, item) {
    return item.toUpperCase()
  })

  return {
    ...theme[`${themeName.substring(1, themeName.length)}`]
  }
}
