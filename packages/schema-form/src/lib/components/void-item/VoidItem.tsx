import { defineComponent } from "vue"
import "./style.scss"
import { useField, useFieldSchema } from "../../hooks/useFormContext"
import FormItem from "../FormItem"
import { isFunction } from "../../utils"
import { ArrayBase } from "../array-base/ArrayBase"
import { NSwitch } from "naive-ui"
import { RenderCallbackFn } from "../../types/form"
import { VNode } from "vue"
import Grid from "../Grid/index"

const VoidItem = defineComponent({
  name: "Collapse",
  inheritAttrs: false,
  props: {
    fieldValue: {
      type: [Object, Array, String, Number],
      default: null
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
    }
  },
  setup(props, { slots }) {
    const schemaRef = useFieldSchema()
    const field = useField()
    const prefixCls  = "void-item"
    const expendRef = ref(props.expend)

    const switchHandle = () => {
      expendRef.value = !expendRef.value
    }

    const getField = (field: any) => {
      const fieldArr = field.split(".")
      fieldArr.pop()
      return fieldArr.join(".")
    }
    const renderHeader = () => {
      return (
        <div class={`${prefixCls}-header`}>
          <span>
            {isFunction(unref(schemaRef).label)
              ? (unref(schemaRef).label as RenderCallbackFn<VNode>)?.({
                  schema: unref(schemaRef),
                  field: getField(field)
                })
              : unref(schemaRef).label}
          </span>
          {props?.useCollapse && props?.collapseType === "switch" ? (
            <NSwitch
              style="margin-left: 16px"
              value={expendRef.value}
              onUpdateValue={switchHandle}
            ></NSwitch>
          ) : null}
        </div>
      )
    }
    const renderContent = () => {
      const schema = unref(schemaRef)
      const dataSource = Array.isArray(unref(schemaRef).items)
        ? unref(schemaRef).items?.slice()
        : []
      if (!schema) throw new Error("can not found schema object")

      return (
        <div
          style={unref(schemaRef).itemStyle?.contentStyle}
          class={`${prefixCls}-content`}
        >
          <Grid {...schema.rowProps}>
            {dataSource?.map((item) => {
              return (
                <FormItem
                  schema={item}
                  span={item.span}
                  {...(item.colProps || {})}
                  path={
                    getField(field)
                      ? `${getField(field)}.${item.field}`
                      : `${item.field}`
                  }
                  fieldValue={props.fieldValue}
                ></FormItem>
              )
            })}
          </Grid>
        </div>
      )
    }
    const expendSlots = {
      default: () => renderContent(),
      header: () => (slots.title ? slots.title() : renderHeader())
    }
    return () => (
      <ArrayBase.Expend
        expend={expendRef.value}
        collapse={props.useCollapse && props?.collapseType === "expend"}
        {...unref(schemaRef).colProps}
        headerStyle={unref(schemaRef).itemStyle?.headerStyle}
        v-slots={expendSlots}
      ></ArrayBase.Expend>
    )
  }
})

export default VoidItem
