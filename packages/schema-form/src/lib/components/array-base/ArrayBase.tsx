import {
  defineComponent,
  provide,
  InjectionKey,
  inject,
  toRefs,
  ref,
  onBeforeUnmount,
  PropType,
  h,
  withDirectives,
  resolveDirective,
  renderSlot
} from "vue"
import { ButtonProps as NButtonProps, useThemeVars } from "naive-ui"
import { NIcon } from "naive-ui"
import { MoveSharp as ArrowMove } from "@vicons/ionicons5"
import Collapse from "../collapse/Collapse.vue"
import { FormSchema } from "../../types/form"
import { buildUUID } from "../../utils"
import { useFieldModal, useFieldSchema } from "../../hooks/useFormContext"
import { composeExport } from "../../utils"
import Expend from "../Expend/index.vue"
import "./style.scss"
import { Ref } from "vue"
import ArrayItem from "../array-item/ArrayItem"
import SvgIcon from "../Icon/SvgIcon.vue"
import { useProjectSettingsContext } from "../../hooks/useProjectSettings"

export interface IArrayBaseAdditionProps extends NButtonProps {
  title?: string
  method?: "push" | "unshift"
  defaultValue?: any
}

export type ArrayBaseMixins = {
  Addition?: typeof ArrayBaseAddition
  Remove?: typeof ArrayBaseRemove
  SortHandle?: typeof ArrayBaseSortHandle
  Index?: typeof ArrayBaseIndex
  useArray?: typeof useArray
  useIndex?: typeof useIndex
  useRecord?: typeof useRecord
}

export interface IArrayBaseProps {
  disabled?: boolean
  keyMap?: WeakMap<Record<string, unknown>, string> | string[] | null
}

export interface IArrayBaseItemProps {
  index: number
  record: any
}

export interface IArrayBaseContext {
  field: Recordable
  schema: Ref<FormSchema>
  props: IArrayBaseProps
  attrs: {
    [key in string]?: any
  }
  keyMap?: WeakMap<Record<string, unknown>, string> | string[] | null
}

const ArrayBaseSymbol: InjectionKey<IArrayBaseContext> = Symbol(
  "ArrayBaseContext"
)
const ItemSymbol: InjectionKey<IArrayBaseItemProps> = Symbol("ItemContext")

const useArray = () => {
  return inject(ArrayBaseSymbol, null)
}

const useIndex = (index?: number) => {
  const { index: indexRef } = toRefs(inject(ItemSymbol) as IArrayBaseItemProps)
  return indexRef ?? ref(index)
}

const useRecord = (record?: number) => {
  const { record: recordRef } = toRefs(
    inject(ItemSymbol) as IArrayBaseItemProps
  )
  return recordRef ?? ref(record)
}

const isObjectValue: (schema: Recordable) => boolean = (schema: Recordable) => {
  if (schema?.type === "array" || schema?.type === "object") {
    return true
  }
  return false
}

const useKey = (schema: FormSchema) => {
  const isObject = isObjectValue(schema)
  let keyMap: WeakMap<Record<string, unknown>, string> | string[] | null = null

  if (isObject) {
    keyMap = new WeakMap()
  } else {
    keyMap = []
  }

  onBeforeUnmount(() => {
    keyMap = null
  })

  return {
    keyMap,
    getKey: (record: any, index?: number) => {
      if (keyMap instanceof WeakMap) {
        if (!keyMap.has(record)) {
          keyMap.set(record, buildUUID())
        }
        return `${keyMap.get(record)}`
      }
    }
  }
}

const ArrayBaseInner = defineComponent({
  name: "ArrayBase",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    keyMap: {
      type: [WeakMap, Array] as PropType<
        WeakMap<Record<string, unknown>, string> | string[]
      >
    }
  },
  setup(props, { slots, attrs }) {
    const { getArrayFormModel } = useFieldModal()
    const schema = useFieldSchema()
    const field = getArrayFormModel()

    provide(ArrayBaseSymbol, {
      field,
      schema,
      props,
      attrs,
      keyMap: props.keyMap
    })
    provide(ItemSymbol, { index: -1, record: null })

    return () => {
      return slots.default?.()
    }
  }
})

const ArrayBaseItem = defineComponent({
  name: "ArrayBaseItem",
  props: ["index", "record"],
  setup(props: IArrayBaseItemProps, { slots }) {
    provide(ItemSymbol, props)
    return () => {
      return slots.default?.()
    }
  }
})

const ArrayBaseSortHandle = defineComponent({
  name: "ArrayBaseSortHandle",
  props: ["index"],
  setup(_, { attrs }) {
    const array = useArray()
    const prefixCls = "array-base"
    const handleDirs = resolveDirective("handle")

    return () => {
      if (!array) return null

      return withDirectives(
        h(
          NIcon,
          {
            directives: [{ name: "handle" }],
            ...attrs,
            class: [`${prefixCls}-sort-handle`].concat(attrs.class as any)
          },
          { default: () => [h(ArrowMove)] }
        ),
        [[handleDirs || {}]]
      )
    }
  }
})


const ArrayBaseIndex = defineComponent({
  name: "ArrayBaseIndex",
  setup(props, { attrs }) {
    const index = useIndex()
    const  prefixCls  = "array-base"
    return () => {
      return h(
        "span",
        {
          class: `${prefixCls}-index`,
          ...attrs
        },
        {
          default: () => [`#${index.value + 1}.`]
        }
      )
    }
  }
})

const ArrayBaseAddition = defineComponent({
  name: "ArrayBaseAddition",
  props: [
    "method",
    "defaultValue",
    "title",
    "disabled",
    "iconName",
    "disabledFn"
  ],
  setup(props, { attrs }) {
    const array = useArray()
    const index = useIndex()
    const { setArrayFormModel } = useFieldModal()
    const prefixCls  = "array-base"
    const useThemeVar = useThemeVars()
    const primaryColor = unref(useThemeVar).primaryColor
    console.log({
      useThemeVar,
      primaryColor
    })
    return () => {
      if (!array) return null
      const additionClickHandle = (e) => {
        if (array.props?.disabled || props.disabled || props.disabledFn) return
        e.stopPropagation()
        if (props.method === "unshift") {
          setArrayFormModel("unshift")
        } else {
          setArrayFormModel("splice", index.value)
        }
        if (typeof attrs.onClick === "function") {
          attrs.onClick(e)
        }
      }
      return (
        <SvgIcon
          name='add'
          size="24"
          color={
            props.iconName === "component-add" || props.disabled
              ? "#999"
              : primaryColor
          }
          hoverColor={
            props.iconName === "component-add" ? "#999" : primaryColor
          }
          class={[
            `${prefixCls}-addition`,
            {
              [`${prefixCls}-addition-disable`]: props.disabled
            }
          ]}
          onClick={additionClickHandle}
        ></SvgIcon>
      )
    }
  }
})

const ArrayBaseRemove = defineComponent({
  name: "ArrayBaseRemove",
  props: ["title", "index", "disabled", "iconName"],
  setup(props, { attrs }) {
    const indexRef = useIndex(props.index)
    const { setArrayFormModel } = useFieldModal()
    const base = useArray()
    const prefixCls  = "array-base"
    const array = useArray()

    const removeClickHandle = (e: MouseEvent) => {
      if (array?.props?.disabled || props.disabled) return
      e.stopPropagation()
      if (Array.isArray(base?.keyMap)) {
        base?.keyMap?.splice(indexRef.value, 1)
      }
      setArrayFormModel("remove", indexRef.value)

      if (typeof attrs.onClick === "function") {
        attrs.onClick(e)
      }
    }
    return () => {
      return (
        <SvgIcon
         name='remove'
          {...props}
          size="24"
          color={
            props.iconName === "component-remove" || props.disabled
              ? "#999"
              : "#D92149"
          }
          hoverColor={
            props.iconName === "component-remove" ? "#999" : "#D92149"
          }
          class={[
            `${prefixCls}-remove`,
            {
              [`${prefixCls}-remove-disable`]: props.disabled
            }
          ].concat(attrs.class as any)}
          onClick={removeClickHandle}
        ></SvgIcon>
      )
    }
  }
})

const ExpendItem = defineComponent({
  name: "ExpendItem",
  setup(_, { slots, attrs }) {
    const schemaRef = useFieldSchema()
    const expendSlots = {
      default: () => renderSlot(slots, "default"),
      title: () => renderSlot(slots, "header")
    }
    const getUseCollapse = () => {
      if (
        (unref(schemaRef)?.componentProps as InstanceType<
          typeof ArrayItem
        >["$props"])?.useCollapse
      )
        return false
      return (
        (unref(schemaRef)?.componentProps as InstanceType<
          typeof ArrayItem
        >["$props"])?.expend ?? false
      )
    }
    return () => {
      return (
        <Expend
          {...attrs}
          {...unref(schemaRef).colProps}
          headerStyle={unref(schemaRef).itemStyle?.headerStyle}
          collapse={getUseCollapse()}
          v-slots={expendSlots}
        ></Expend>
      )
    }
  }
})

const CollapseItem = defineComponent({
  name: "ExpendItem",
  setup(_, { slots, attrs }) {
    const schemaRef = useFieldSchema()
    const expendSlots = {
      default: () => renderSlot(slots, "default"),
      title: () => renderSlot(slots, "header")
    }
    const getUseCollapse = () => {
      if (
        (unref(schemaRef)?.componentProps as InstanceType<
          typeof ArrayItem
        >["$props"])?.useCollapse
      )
        return false
      return (
        (unref(schemaRef)?.componentProps as InstanceType<
          typeof ArrayItem
        >["$props"])?.expend ?? false
      )
    }
    return () => {
      return (
        <Collapse
          {...attrs}
          {...unref(schemaRef).colProps}
          headerStyle={unref(schemaRef).itemStyle?.headerStyle}
          collapse={getUseCollapse()}
          v-slots={expendSlots}
        ></Collapse>
      )
    }
  }
})

export const ArrayBase = composeExport(ArrayBaseInner, {
  Index: ArrayBaseIndex,
  Item: ArrayBaseItem,
  SortHandle: ArrayBaseSortHandle,
  Addition: ArrayBaseAddition,
  Remove: ArrayBaseRemove,
  Expend: ExpendItem,
  Collapse: CollapseItem,
  useArray: useArray,
  useIndex: useIndex,
  useKey: useKey,
  useRecord: useRecord
})
