import { InjectionKey } from "vue"
import { IProjectSettings } from "../types/project-setting"
import { createContext, useContext } from "./tools/useContext"

const key: InjectionKey<IProjectSettings> = Symbol('projectSettings')
export function createProjectSettingsContext(context: IProjectSettings) {
  return createContext<IProjectSettings>(context, key)
}

export function useProjectSettingsContext() {
  return useContext<IProjectSettings>(key)
}
