import { CSSProperties, defineComponent, renderSlot } from "vue"
import {
  useField,
  useFieldSchema,
  useFormContext
} from "../../hooks/useFormContext"
import FormItem from "../FormItem"
import "./style.scss"
import { NSwitch, NGrid } from "naive-ui"
import BasicHelp from "../basic-help/BasicHelp.vue"
import { isFunction } from "../../utils"
import { ArrayBase } from "../array-base/ArrayBase"
import { VNode } from "vue"
import { FormSchema, RenderCallbackFn } from "../../types/form"

import { get } from "lodash-es"
const ObjectItems = defineComponent({
  name: "FArrayItems",
  props: {
    field: {
      type: String
    },
    fieldValue: {
      type: Object as PropType<() => Record<string, unknown>>,
      default: () => null
    },
    index: {
      type: Number,
      default: 0
    },
    array: {
      type: Boolean,
      default: false
    },
    expend: {
      type: Boolean,
      default: true
    },
    collapseType: {
      type: String as PropType<"switch" | "expend" | "subSwitch">,
      default: "expend"
    },
    useCollapse: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    itemStyle: {
      type: Object as PropType<CSSProperties>
    }
  },
  setup(props, { slots }) {
    const field = computed(() => props.field ?? useField())
    const schemaRef = useFieldSchema()
    const { setFormModel, formModel, getBindValues } = useFormContext()

    const prefixCls = "object-items"

    const objModal = computed(() => {
      return get(formModel, unref(field))
    })

    const expendRef = ref(props.expend)
    // 处理 collapseType === 'switch' || 'subSwitch' 时，如果有数据，会默认展开。
    watchEffect(() => {
      if (
        props.collapseType === "switch" ||
        props.collapseType === "subSwitch"
      ) {
        // 排除初始化
        if (objModal.value && !objModal.value._init) {
          if (Object.keys(toRaw(objModal.value)).length !== 0)
            expendRef.value = true
        }
      }
    })

    const renderContent = () => {
      if (!unref(schemaRef)) throw new Error("can not found schema object")
      const dataSource = Array.isArray(unref(schemaRef).items)
        ? !props.array
          ? unref(schemaRef).items
          : unref(schemaRef).items?.[props.index] ?? []
        : []
      return (
        <div
          class={`${prefixCls}-content`}
          style={unref(schemaRef).itemStyle?.contentStyle}
        >
          <NGrid {...schemaRef.value.rowProps}>
            {(unref(dataSource) as FormSchema[])?.map((item) => {
              return (
                <FormItem
                  key={item.field}
                  schema={item}
                  span={item.span}
                  {...(item.colProps || {})}
                  path={`${field.value}.${item.field}`}
                ></FormItem>
              )
            })}
            {renderSlot(slots, "contentExtra", { path: props.field })}
          </NGrid>
        </div>
      )
    }
    const switchHandle = () => {
      expendRef.value = !expendRef.value
      setFormModel(`${unref(field)}._expend`, expendRef.value)
    }

    function renderLabelHelpMessage() {
      const { helpMessage, helpComponentProps } = unref(schemaRef)
      if (!helpMessage) return null

      const getHelpMessage = isFunction(helpMessage)
        ? helpMessage(unref({ field: field.value, schemaRef }))
        : helpMessage
      return (
        <span style="display: flex; position: relative; width:16px">
          <BasicHelp
            placement="top"
            text={getHelpMessage!}
            {...helpComponentProps}
          />
        </span>
      )
    }

    const getLabelWidth = () => {
      const placement =
        unref(schemaRef)?.itemProps?.labelPlacement ??
        unref(unref(getBindValues).getProps)?.labelPlacement ??
        "top"

      if (placement === "top") {
        return "100%"
      }
      const labelWidth =
        unref(schemaRef)?.itemProps?.labelWidth ??
        unref(unref(getBindValues).getProps)?.labelWidth ??
        80
      return parseInt(String(labelWidth), 10) + "px"
    }

    const renderHeader = () => {
      const labelWidth = getLabelWidth()
      return (
        <div class={`${prefixCls}-header`}>
          <div style={{ width: `${labelWidth}` }} class="flex items-center">
            {isFunction(unref(schemaRef)?.label)
              ? (unref(schemaRef).label as RenderCallbackFn<VNode>)({
                  schema: unref(schemaRef)
                })
              : unref(schemaRef).label}
            {renderLabelHelpMessage()}
          </div>
          {props?.useCollapse && props?.collapseType === "switch" ? (
            <NSwitch
              value={expendRef.value}
              onUpdateValue={switchHandle}
            ></NSwitch>
          ) : null}
        </div>
      )
    }

    const expendSlots = {
      default: () => renderContent(),
      header: props.showHeader
        ? () => (slots.title ? slots.title(props.field) : renderHeader())
        : null
    }
    return () => (
      <ArrayBase.Expend
        expend={expendRef.value}
        {...unref(schemaRef).colProps}
        collapse={props.useCollapse && props?.collapseType === "expend"}
        headerStyle={unref(schemaRef).itemStyle?.headerStyle}
        v-slots={expendSlots}
      ></ArrayBase.Expend>
    )
  }
})

export default ObjectItems
