import { ButtonProps } from "naive-ui"
import { CSSProperties, VNode } from "vue"

export type StepStatus = "NEXT" | "SKIP" | "FINISH"

export enum EArrowDirection {
  "RIGHT_TOP" = "RIGHT_TOP",
  "RIGHT_BOTTOM" = "RIGHT_BOTTOM",
  "LEFT_TOP" = "LEFT_TOP",
  "LEFT_BOTTOM" = "LEFT_BOTTOM",
  "TOP_RIGHT" = "TOP_RIGHT",
  "TOP_LEFT" = "TOP_LEFT",
  "BOTTOM_RIGHT" = "BOTTOM_RIGHT",
  "BOTTOM_LEFT" = "BOTTOM_LEFT"
}

export type ArrowDirection =
  | "RIGHT_TOP"
  | "RIGHT_BOTTOM"
  | "LEFT_TOP"
  | "LEFT_BOTTOM"
  | "TOP_RIGHT"
  | "TOP_LEFT"
  | "BOTTOM_RIGHT"
  | "BOTTOM_LEFT"

export interface IStep {
  target: string
  renderTarget?: () => VNode
  targetStyle?: CSSProperties
  targetInnerStyle?: CSSProperties
  header?: string | VNode
  content?: string | VNode

  confirmText?: string
  cancelText?: string
  confirmAction?: () => Promise<StepStatus>
  cancelAction?: () => Promise<StepStatus>

  footerStyle?: CSSProperties
  cancelButtonProps?: ButtonProps
  confirmButtonProps?: ButtonProps
  showConfirmBtn?: boolean
  showCancelBtn?: boolean

  arrowImageUrl?: string
  arrowImageStyle?: CSSProperties
  arrowDirection: ArrowDirection
  arrowExtraInfo?: {
    offsetX: number
    offsetY: number
  }
  dialogStyle?: CSSProperties
  beforeAction?: () => Promise<any>
  afterAction?: () => Promise<any>
}
