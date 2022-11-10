import { Component } from "vue"
import { ComponentType } from "./types/component"

import ArrayItem from "./components/array-item/ArrayItem"
import ObjectItem from "./components/object-item/ObjectItem"
import Collapse from "./components/collapse/Collapse.vue"
import VoidItem from "./components/void-item/VoidItem"
import InputNumber from "@components/InputNumber/src/InputNumber.vue"

const componentMap = new Map<ComponentType, Component>()
const editModelCompMap = ["input", "select"]

componentMap.set(ComponentType.ArrayItem, ArrayItem)
componentMap.set(ComponentType.ObjectItem, ObjectItem)
componentMap.set(ComponentType.Collapse, Collapse)
componentMap.set(ComponentType.VoidItem, VoidItem)
componentMap.set(ComponentType.InputNumber, InputNumber)

export function getComponentTypeList() {
  const ComponentTypeArr: string[] = []
  for (const n in ComponentType) {
    if (typeof ComponentType[n] === "string") {
      ComponentTypeArr.push(n)
    }
  }
}

export function get(compName: ComponentType) {
  return componentMap.get(compName)
}

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component)
}

export function del(compName: ComponentType) {
  componentMap.delete(compName)
}

export { componentMap, editModelCompMap }
