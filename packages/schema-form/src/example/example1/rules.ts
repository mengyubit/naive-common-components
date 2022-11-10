import { FormItemRule } from "naive-ui"

export const appNameRules = [
  {
    required: true,
    validator(_: FormItemRule, val: string) {
      if (!val) {
        return new Error("Please input app name")
      } else if (!/^[A-Za-z0-9]([-a-zA-Z0-9]*[a-zA-Z0-9])?$/.test(val)) {
        return new Error("Please enter characters, numbers and dashes")
      } else if (val.length < 3) {
        return new Error("Please enter less than 3 characters")
      }
      return true
    },
    trigger: ["input", "blur"]
  }
]