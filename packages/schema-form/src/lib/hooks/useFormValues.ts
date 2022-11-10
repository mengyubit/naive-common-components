import { isArray, isFunction, isObject, isString } from "../utils/is"
import moment from "moment"
import { unref } from "vue"
import { Ref, ComputedRef } from "vue"
import { FormProps, FormSchema } from "../types/form"
import { set } from "lodash-es"
import { cloneDeep } from "lodash-es"
import { buildUUID, isBoolean, deepCopy } from "../utils"

interface UseFormValuesContext {
  defaultValueRef: Ref<any>
  getSchema: ComputedRef<FormSchema[]>
  getProps: ComputedRef<FormProps>
  formModel: Recordable
}
export function useFormValues({
  defaultValueRef,
  getSchema,
  formModel,
  getProps
}: UseFormValuesContext) {
  // Processing form values
  function handleFormValues(values: Recordable) {
    const schemas = getSchema.value
    if (!isObject(values)) {
      return {}
    }
    const res: Recordable = {}
    const transform = (
      values: Recordable,
      schemas: FormSchema[],
      path = ""
    ) => {
      for (const item of Object.entries(schemas)) {
        const [, schema] = item
        const key = schema.field || ""
        let val = values[key]

        if (schema?.type === "void") {
          return transform(values, schema.items as FormSchema[], path)
        }
        if (
          !key ||
          !val ||
          val?.length === 0 ||
          isFunction(val) ||
          key === "_id"
        ) {
          continue
        }

        if (
          !schema?.type &&
          schema.type !== "object" &&
          schema.type !== "array"
        ) {
          if (schema?.format) {
            if (isFunction(schema.format)) schema.format(val)
            if (schema.format === "string") val = String(val?.trim())
            else if (schema.format === "number") val = Number(val)
            else if (schema.format === "boolean") val = Boolean(val)
            else if (schema.format === "date")
              val = moment(val).format("YYYY-MM-DD")
          } else if (isString(val)) val = val?.trim()
          set(res, `${path}${key}`, val)
          continue
        }

        // handle _expend
        if (Reflect.has(val, "_expend") && !Reflect.get(val, "_expend")) {
          continue
        }

        if (schema) {
          set(res, `${path}${key}`, null)
          if (isArray(val)) {
            val.forEach((itemVal, index) => {
              transform(
                itemVal,
                (schema?.items?.[index] as FormSchema[]) || [],
                `${path}${key}[${index}].`
              )
            })
            continue
          }
          if (isObject(val)) {
            transform(
              val,
              schema.items as FormSchema[],
              `${path}${schema.field}.`
            )
            continue
          }
        }
      }
    }

    transform(values, schemas, "")
    return res
  }

  /**
   * @description: Processing time interval parameters
   */
  function handleRangeTimeValue(values: Recordable) {
    const fieldMapToTime = unref(getProps).fieldMapToTime

    if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
      return values
    }

    for (const [
      field,
      [startTimeKey, endTimeKey],
      format = "YYYY-MM-DD"
    ] of fieldMapToTime) {
      if (!field || !startTimeKey || !endTimeKey || !values[field]) {
        continue
      }

      const [startTime, endTime]: string[] = values[field]

      values[startTimeKey] = moment(startTime).format(format)
      values[endTimeKey] = moment(endTime).format(format)
      Reflect.deleteProperty(values, field)
    }

    return values
  }

  // 初始化formModel
  function initDefault() {
    const schemas = unref(getSchema)
    const obj: Recordable = {}

    const transformValue = (schema: FormSchema[] | undefined, path = "") => {
      schema?.forEach((item: Recordable) => {
        if (item.type === "void") {
          return transformValue(item.items as FormSchema[], path)
        }
        const { defaultValue = null } = toRaw(item)

        // 给model设置初始值
        set(obj, `${path}${item.field}`, null)
        if (item.type === "array" && isArray(defaultValue)) {
          // 默认的defaultValue中每一下都加一个_id，主要为了区分初始化和编辑时Expend的状态
          defaultValue.forEach((itemVal) => {
            itemVal["_id"] = buildUUID()
          })
          set(obj, `${path}${item.field}`, cloneDeep(defaultValue))
          set(obj, `${path}${item.field}._init`, true)
          if (
            item.componentProps?.useCollapse &&
            item.componentProps?.collapseType === "subSwitch"
          ) {
            set(
              obj,
              `${path}${item.field}._expend`,
              isBoolean(item.componentProps?.expend)
                ? item.componentProps?.expend
                : true
            )
          }
          if (defaultValue.length === 0) return
        } else if (item.type === "object" && isObject(defaultValue)) {
          set(obj, `${path}${item.field}`, cloneDeep(defaultValue))
          if (
            item.componentProps?.useCollapse &&
            item.componentProps?.collapseType === "switch"
          ) {
            set(
              obj,
              `${path}${item.field}._expend`,
              isBoolean(item.componentProps?.expend)
                ? item.componentProps?.expend
                : true
            )
          }
        } else {
          // 给对象类型添加 _init 标记
          if (item.type === "object") {
            const val = {
              _init: true
            }
            if (
              item.componentProps?.useCollapse &&
              item.componentProps?.collapseType === "switch"
            ) {
              val["_expend"] = isBoolean(item.componentProps?.expend)
                ? item.componentProps?.expend
                : true
            }
            set(obj, `${path}${item.field}`, val)
          } else {
            set(obj, `${path}${item.field}`, defaultValue)
          }
        }

        // 递归遍历schema，给model设置初始值
        if (item.items) {
          if (item.type === "array") {
            // 注意：类型为array时，这里schema是个二维数组，后续需要优化

            if (isArray(defaultValue)) {
              // 如果defaultValue是数组，那么就遍历数组，对数组中的每一项进行处理,使用第一个schema结构来初始化。
              defaultValue.forEach((_, index) => {
                transformValue(
                  item?.items?.[0] as FormSchema[],
                  `${path}${item.field}[${index}].`
                )
              })
            } else
              transformValue(
                item.items[0] as FormSchema[],
                `${path}${item.field}[0].`
              )
          } else if (item.type === "object") {
            transformValue(item.items as FormSchema[], `${path}${item.field}.`)
          }
        }
      })
    }
    transformValue(schemas)
    defaultValueRef.value = obj
    // 使用deepCopy 替代 cloneDeep， cloneDeep 不会 copy Array 的属性
    const initialFormValue = deepCopy(obj)
    Object.keys(initialFormValue).forEach((key) => {
      // 区分初始化赋值和set值的区别
      if (isObject(initialFormValue[key])) {
        initialFormValue[key]["_init"] = true
      }
      formModel[key] = initialFormValue[key]
    })
  }

  return { handleFormValues, initDefault }
}
