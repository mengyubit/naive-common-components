import { FormSchema, IIconConfig } from "./types/form"
import { CSSProperties, PropType } from "vue"
import { Recordable } from "./types"
import { GridProps } from "./components/Grid/index"

export const basicProps = {
  inline: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  index: {
    type: Number as PropType<number>,
    default: null
  },
  // 标签宽度  固定宽度
  labelWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 0
  },
  compact: {
    type: Boolean as PropType<boolean>
  },
  // 表单配置规则
  schemas: {
    type: [Array] as PropType<FormSchema[]>,
    default: () => []
  },
  itemStyle: {
    type: Object as PropType<{ [key: string]: string | number }>
  },
  mergeDynamicData: {
    type: Object as PropType<Recordable>,
    default: null
  },
  baseRowStyle: {
    type: Object as PropType<CSSProperties>
  },
  autoSetPlaceHolder: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  // 在INPUT组件上单击回车时，是否自动提交
  autoSubmitOnEnter: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  submitOnReset: {
    type: Boolean as PropType<boolean>
  },
  size: {
    type: String as PropType<"small" | "medium" | "large">,
    default: "medium"
  },
  // 禁用表单
  disabled: {
    type: Boolean as PropType<boolean>
  },
  emptySpan: {
    type: [Number, Object] as PropType<number>,
    default: 0
  },

  // 转化时间
  transformDateFunc: {
    type: Function as PropType<Fn>,
    default: (date: any) => {
      return date._isAMomentObject ? date?.format("YYYY-MM-DD HH:mm:ss") : date
    }
  },
  rulesMessageJoinLabel: {
    type: Boolean as PropType<boolean>,
    default: true
  },

  // 是否显示操作按钮
  showActionButtonGroup: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  // 显示重置按钮
  showResetButton: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  // 是否聚焦第一个输入框，只在第一个表单项为input的时候作用
  autoFocusFirstItem: {
    type: Boolean as PropType<boolean>,
    default: true
  },

  // 自定义重置函数
  resetFunc: Function as PropType<() => Promise<void>>,
  submitFunc: Function as PropType<() => Promise<void>>,

  // 以下为默认props
  hideRequiredMark: {
    type: Boolean as PropType<boolean>
  },

  layout: {
    type: String as PropType<"horizontal" | "vertical" | "inline">,
    default: "horizontal"
  },

  labelAlign: {
    type: String as PropType<string>
  },

  rowProps: Object as PropType<GridProps>,

  iconStyleConfig: {
     type: [Array] as PropType<IIconConfig[]>,
     default: () => []
  }
}
