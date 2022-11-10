import {
  NInput,
  NSelect,
  NInputGroup,
  NInputNumber,
  NSwitch,
  NCheckbox,
  NRadio,
  NDatePicker,
  NTreeSelect
} from "naive-ui"
import ArrayItem from "../components/array-item/ArrayItem"
import ObjectItem from "../components/object-item/ObjectItem"
import Collapse from "../components/collapse/Collapse.vue"
import VoidItem from "../components/void-item/VoidItem"
import InputNumber from "../InputNumber/src/InputNumber.vue"
import { KebabCase } from "type-fest"


type ComponentArrInterface = {
  NInput: typeof NInput
  NSelect: typeof NSelect
  NTreeSelect: typeof NTreeSelect
  NInputGroup: typeof NInputGroup
  NSwitch: typeof NSwitch
  NCheckbox: typeof NCheckbox
  NRadio: typeof NRadio
  NDatePicker: typeof NDatePicker
  ArrayItem: typeof ArrayItem
  ObjectItem: typeof ObjectItem
  Collapse: typeof Collapse
  VoidItem: typeof VoidItem
  InputNumber: typeof InputNumber
  NInputNumber: typeof NInputNumber   
}

export type ComponentMapType = {  
  [key in keyof ComponentArrInterface as KebabCase<key>]: InstanceType<
    ComponentArrInterface[key]
  >["$props"]
}


export enum ComponentType {
  ArrayItem = "array-item",
  Collapse = "collapse",
  VoidItem = "void-item",
  InputNumber = "input-number",
  ObjectItem = "object-item"
}

export type ComponentMapKeyType =  keyof ComponentMapType
