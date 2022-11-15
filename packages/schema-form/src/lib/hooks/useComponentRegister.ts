
import { tryOnUnmounted } from "@vueuse/core"
import { add, del } from "../componentMap"
import { Component } from "vue"
import { ComponentType } from "../types/component"

export function useComponentRegister(compName: ComponentType, comp: Component) {
  add(compName, comp)
  tryOnUnmounted(() => {
    del(compName)
  })
}
