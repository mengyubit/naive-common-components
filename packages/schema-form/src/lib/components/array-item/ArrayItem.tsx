import {
  CSSProperties,
  defineComponent,
  StyleValue,
  unref,
  VNode,
  watch
} from "vue"
import { ArrayBase } from "../array-base/ArrayBase"
import { buildUUID, isNullOrUnDef } from "../../utils"
import {
  createFieldModal,
  useField,
  useFieldSchema,
  useFormContext
} from "../../hooks/useFormContext"
import { composeExport } from "../../utils"
import { cloneDeep, get } from "lodash-es"
import "./style.scss"
import ObjectItem from "../object-item/ObjectItem"
import { NSwitch, NCollapseTransition } from "naive-ui"
import UpAlertImg from "../../assets/up-alert.png"
import GridItem from "../GridItem/index"
import { FormSchema } from '../../index'
const ArrayItemsInner = defineComponent({
  name: "ArrayItems",
  inheritAttrs: false,
  props: {
    renderAddition: {
      type: Function as PropType<() => VNode>
    },
    AdditionAndRemovePlacement: {
      type: String as PropType<"top" | "right">,
      default: "top"
    },
    subHeaderLabel: {
      type: String,
      default: ""
    },
    maxValue: {
      type: Number,
      default: Infinity
    },
    minValue: {
      type: Number,
      default: 1
    },
    useCollapse: {
      type: Boolean,
      default: false
    },
    collapseType: {
      type: String as PropType<"switch" | "expend" | "subSwitch" | "subExpend">,
      default: "expend"
    },
    useSubHeader: {
      type: Boolean,
      default: false
    },
    expend: {
      type: Boolean,
      default: true
    },
    itemProps: {
      type: Object as PropType<{ [key: string]: any }>,
      default: () => ({
        useCollapse: false,
        showCount: false,
        expend: true,
        dividingLine: false,
        required: false,
        collapseType: "expend"
      })
    },
    additionStyle: {
      type: Object as PropType<{ [key: string]: string | number }>,
      default: () => ({})
    },
    subHeaderStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    subHeaderLabelStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    itemsContentExtraStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    addText: {
      type: String
    },
    useDynamic: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const schemaRef = useFieldSchema()
    const filedRef = useField()
    const {
      setFormModel,
      formModel,
      getBindValues,
      appendArraySchemaItems,
      removeArraySchemaItems,
      getSchemaByPath
    } = useFormContext()
    const prefixCls = "array-items"
    const { keyMap } = ArrayBase.useKey(unref(schemaRef))

    const { items: itemSchema } = unref(schemaRef)
    const arrayModalOrigin: Recordable = {}
    const expendRef = ref(props.expend)

    const createArrayModal = (items) => {
      items?.forEach((item) => {
        if (item.type === "void") {
          return createArrayModal(item.items)
        }
        arrayModalOrigin[item.field!] = item.defaultValue ?? null

        // 新增的每一项都要有一个唯一的key，为了解决对象value都为空会expend默认关闭的问题，不用expend功能可以删除这个id。
        arrayModalOrigin["_id"] = buildUUID()
      })
      return arrayModalOrigin
    }

    // must reactive
    const arrayModal = computed(() => {
      return get(formModel, filedRef) || []
    })

    const arrayModelLength = computed(() => {
      return unref(arrayModal).length
    })

    const minLenDisabled = computed(
      () => unref(arrayModelLength) <= props.minValue
    )
    const maxLenDisabled = computed(
      () => props.maxValue <= unref(arrayModelLength)
    )

    // 处理 collapseType === 'switch' 时，如果有数据，会默认展开。
    watch(
      () => arrayModal.value,
      () => {
        if (
          props.collapseType === "switch" ||
          props.collapseType === "subSwitch"
        ) {
          if (arrayModal.value?.length !== 0 && !arrayModal.value._init) {
            // 注意：collapseType === 'subSwitch' 时，默认都会有一行数据。如果这一行数据为空，那么就不展开。
            // 只是数组有这么一个特殊需求，其他地方不需要这么做。
            if (Object.keys(toRaw(arrayModal.value)).length === 1) {
              // 判断每一项是否为空，如果为空，就不展开。新增的每一项会附加一个 _id 属性，所以新增的每一项都不为空。
              if (
                Object.values(arrayModal.value[0]).every(
                  (item) => item === null
                )
              ) {
                expendRef.value = false
              } else {
                expendRef.value = true
              }
            } else if (Object.keys(toRaw(arrayModal.value)).length !== 0)
              expendRef.value = true
          }
        }
      },
      {
        immediate: true
      }
    )

    const getArrayFormModel = (index?: number) => {
      if (index) return arrayModal[index]
      return arrayModal
    }

    const setArrayFormModel = (type = "push", index = -1) => {
      const cloneArrayValue = cloneDeep(arrayModal.value)
      const cloneArraySchema = cloneDeep(toRaw(itemSchema?.[0] as FormSchema[]))

      if (type === "push") {
        cloneArrayValue.push(cloneDeep(createArrayModal(itemSchema?.[0])))
        cloneArrayValue.length > 1 &&
          appendArraySchemaItems(cloneArraySchema, unref(filedRef))
      } else if (type === "remove") {
        cloneArrayValue.splice(index, 1)
        setFormModel(filedRef, cloneArrayValue)
        cloneArrayValue.length > 1 &&
          removeArraySchemaItems(unref(filedRef), index)
      } else if (type === "splice") {
        if (!isNullOrUnDef(index) && index !== -1) {
          cloneArrayValue.splice(
            index + 1,
            0,
            cloneDeep(createArrayModal(itemSchema?.[0]))
          )
          cloneArrayValue.length > 1 &&
            appendArraySchemaItems(cloneArraySchema, unref(filedRef), index + 1)
        } else {
          cloneArrayValue.push(cloneDeep(createArrayModal(itemSchema?.[0])))
          cloneArrayValue.length > 1 &&
            appendArraySchemaItems(cloneArraySchema, unref(filedRef))
        }
        setFormModel(filedRef, cloneArrayValue)
      }
    }

    watch(
      () => arrayModal.value,
      (model) => {
        if (model.length > 1) {
          const { schemaListVal } = getSchemaByPath(unref(filedRef))
          if (toRaw(schemaListVal).length !== model.length) {
            let len = model.length - toRaw(schemaListVal).length
            for (
              let i = 0;
              i < len;
              i++
            ) {
              appendArraySchemaItems(
                cloneDeep(cloneDeep(toRaw(itemSchema?.[0] as FormSchema[]))),
                unref(filedRef)
              )
            }
          }
        }
      },
      {
        immediate: true
      }
    )

    createFieldModal({
      getArrayFormModel,
      setArrayFormModel
    })

    return () => {
      const schema = unref(schemaRef)
      if (!schema) throw new Error("can not found schema object")
      const renderRequireMark = () => {
        return props.itemProps.required ? (
          <span class={`${prefixCls}-mark`}>&nbsp;*</span>
        ) : null
      }

      const switchHandle = () => {
        expendRef.value = !expendRef.value
        setFormModel(`${unref(filedRef)}._expend`, expendRef.value)
      }

      const renderArrayItemHeader = (index: number) => {
        return (
          <div class={`${prefixCls}-header`} style={props.subHeaderStyle}>
            {unref(schemaRef).label}
            {props.itemProps.showCount && (
              <>
                <span class={`${prefixCls}-header__count`}>{index + 1}</span>
                <span class={`${prefixCls}-header__total`}>
                  /{props.maxValue}
                </span>
              </>
            )}
            {props.useDynamic && props.AdditionAndRemovePlacement === "top" ? (
              <ArrayBase.Remove
                disabled={unref(minLenDisabled)}
              ></ArrayBase.Remove>
            ) : null}
          </div>
        )
      }

      const getImageStyle = computed(
        (): CSSProperties => {
          return {
            transform: expendRef.value ? "rotate(0deg)" : "rotate(90deg)",
            transition: "all .4s"
          }
        }
      )
      const getPlacementMerge = computed(() => {
        return (
          unref(schema)?.itemProps?.labelPlacement ??
          unref(unref(getBindValues).getProps)?.labelPlacement ??
          "top"
        )
      })
      const getLabelWidthMerge = computed(() => {
        return (
          unref(schema)?.itemProps?.labelWidth ??
          unref(unref(getBindValues).getProps).labelWidth ??
          80
        )
      })

      const getLabelWidth = computed(() => {
        return getPlacementMerge.value === "top"
          ? "100%"
          : getLabelWidthMerge.value + "px"
      })

      const getContentWidth = computed(() => {
        return getPlacementMerge.value === "top"
          ? "100%"
          : `calc(100% - ${getLabelWidthMerge.value}px)`
      })

      const renderArrayHeader = () => {
        return (
          <div
            class={`${prefixCls}-sub-header`}
            style={{
              ...props.subHeaderLabelStyle
            }}
          >
            {props.useCollapse && props.collapseType === "subExpend" ? (
              <div
                class={`${prefixCls}-sub-header-expend w-24px`}
                onClick={switchHandle}
                style={getImageStyle.value}
              >
                <img src={UpAlertImg} alt="" class="w-24px h-24px" />
              </div>
            ) : null}
            <div style={{ width: getLabelWidth.value }}>
              {props.subHeaderLabel}
            </div>

            {props.useCollapse && props.collapseType === "subSwitch" ? (
              <NSwitch
                value={expendRef.value}
                onUpdateValue={switchHandle}
              ></NSwitch>
            ) : null}
          </div>
        )
      }

      const renderArrayAdd = () => {
        // 选中热区增加，通过disabledFn控制
        const addHandle = () => {
          if (unref(maxLenDisabled)) return
          const index = ArrayBase.useIndex()
          setArrayFormModel("splice", index.value)
        }
        return props.useDynamic &&
          props.AdditionAndRemovePlacement === "top" ? (
          <div
            class={`${prefixCls}-add`}
            onClick={addHandle}
            style={props.additionStyle}
          >
            <ArrayBase.Addition
              disabled={unref(maxLenDisabled)}
              disabledFn={true}
            ></ArrayBase.Addition>

            <span
              class={`${prefixCls}-add-text color-primary`}
              style={unref(schemaRef)?.itemStyle?.addTextStyle as StyleValue}
            >
              {props?.addText}
            </span>
            {renderRequireMark()}
          </div>
        ) : null
      }

      const renderDividingLine = () => {
        return (
          props.itemProps.dividingLine && (
            <div
              style={{
                marginLeft: "40px"
              }}
              class={`${prefixCls}-dividing-line`}
            ></div>
          )
        )
      }

      const objectSlots = {
        title: (path: string) => {
          const index = path.replace(/(.+)\[(\d+)\]$/g, "$2")
          return props.useDynamic &&
            props.AdditionAndRemovePlacement === "right" &&
            Number(index) !== 0
            ? null
            : renderArrayItemHeader(Number(index || 0))
        },
        contentExtra: ({ path }: { path: string }) => {
          return props.useDynamic &&
            props.AdditionAndRemovePlacement === "right" ? (
            <GridItem
              class={`${prefixCls}-content-extra`}
              style={props.itemsContentExtraStyle}
            >
              <ArrayBase.Remove
                disabled={unref(minLenDisabled)}
                iconName="component-remove"
              ></ArrayBase.Remove>
              <ArrayBase.Addition
                iconName="component-add"
                disabled={unref(maxLenDisabled)}
              ></ArrayBase.Addition>
            </GridItem>
          ) : null
        }
      }

      const renderItems = () => {
        return arrayModal.value?.map((item, index) => {
          return (
            <ArrayBase.Item index={index} record={item} key={item._id}>
              <ObjectItem
                useCollapse={props.itemProps.useCollapse}
                expend={props.itemProps.expend ?? true}
                collapseType={props.itemProps.collapseType}
                v-slots={objectSlots}
                field={`${filedRef}[${index}]`}
                index={index}
                array={true}
              ></ObjectItem>
              {renderDividingLine()}
            </ArrayBase.Item>
          )
        })
      }
      return (
        <ArrayBase keyMap={keyMap}>
          <div class={`${prefixCls}-main`}>
            {props.useSubHeader && renderArrayHeader()}
            <NCollapseTransition
              style={{
                width: getContentWidth.value
              }}
              show={expendRef.value}
            >
              <div class={`${prefixCls}`}>{renderItems()}</div>
            </NCollapseTransition>
            {props.renderAddition ? props.renderAddition() : renderArrayAdd()}
          </div>
        </ArrayBase>
      )
    }
  }
})
export const ArrayItems = composeExport(ArrayItemsInner, {
  Index: ArrayBase.Index,
  SortHandle: ArrayBase.SortHandle,
  Addition: ArrayBase.Addition,
  Remove: ArrayBase.Remove,
  MoveDown: ArrayBase.MoveDown,
  MoveUp: ArrayBase.MoveUp,
  useArray: ArrayBase.useArray,
  useIndex: ArrayBase.useIndex,
  useRecord: ArrayBase.useRecord
})

export default ArrayItems
