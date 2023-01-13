import { ComputedRef, Ref, unref, toRaw } from "vue"
import {
  FormProps,
  FormSchema,
  FormActionType,
  FormValidateCallback,
  ApplyRule
} from "../types/form"
import { isArray, isFunction, isObject, isString } from "../utils/is"
import { deepMerge } from "../utils"
import { dateItemType } from "../helper"
import { cloneDeep, set } from "lodash-es"
import { NForm } from "naive-ui"
import { FormPath } from "@formily/core"
import { buildUUID, isNumber } from "../utils"

interface UseFormActionContext {
  emit: EmitType
  getProps: ComputedRef<FormProps>
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
  defaultValueRef: Ref<Recordable>
  formElRef: Ref<FormActionType>
  formItemElRefs: Array<InstanceType<typeof NForm> | null>
  schemaRef: Ref<FormSchema[]>
  handleFormValues: Fn
}
export function useFormEvents({
  emit,
  getProps,
  formModel,
  getSchema,
  defaultValueRef,
  formElRef,
  formItemElRefs,
  schemaRef,
  handleFormValues
}: UseFormActionContext) {
  /**
   * @description: reset form fields
   */
  async function resetFields(formModalValue?: Recordable): Promise<void> {
    const { resetFunc, submitOnReset } = unref(getProps)
    resetFunc && isFunction(resetFunc) && (await resetFunc())
    const formEl = unref(formElRef)
    if (!formEl) return
    setFormModelValue(formModalValue ?? defaultValueRef.value)
    nextTick(() => clearValidate())
    emit("reset", toRaw(formModel))
    submitOnReset && handleSubmit()
  }

  function setFormModelValue(defaultValue: Recordable) {
    const initialFormValue = cloneDeep(defaultValue)
    Object.keys(initialFormValue).forEach((key) => {
      // 区分初始化赋值和set值的区别
      if (isObject(initialFormValue[key])) {
        initialFormValue[key]["_init"] = false
      }
      formModel[key] = initialFormValue[key]
    })
  }

  /**
   * @description: Set form value
   */
  async function setFieldsValue<T>(values: T): Promise<void> {
    setFormModelValue(values)
  }

  async function updateFieldsValue<T = Recordable>(values: T): Promise<void> {
    if (!isObject(values)) {
      throw new Error("parameter must be object")
    }
    Object.keys(values).forEach((key) => {
      // setFormModel(key, values[key])
      const segments = FormPath.parse(key).segments
      findFormModelByPath(segments, formModel, (model, segment) => {
        model[segment] = values[key]
      })
    })
  }

  function findFormModelByPath(
    segments,
    formModel,
    cb?: (model: Recordable, segment: string) => void
  ) {
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      // 查找结束
      if (i === segments.length - 1) {
        cb && cb(formModel, segment)
        return
      } else {
        if (!Reflect.has(formModel, segment)) {
          throw new Error(`formModel has no property ${segment}`)
        }
        if (isString(segment)) {
          if (isArray(formModel[segment])) {
            // container[0].ports 这种情况
            if (isNumber(segments[i + 1])) {
              formModel = formModel[segment]
            } else {
              // container.ports 这种情况
              return formModel[segment].forEach((model) => {
                findFormModelByPath(segments.slice(i + 1), model, cb)
              })
            }
          } else formModel = formModel[segment]
        } else if (isNumber(segment)) {
          formModel = formModel[segment]
        }
      }
    }
  }

  function getSchemaByPath(path: string) {
    const segments = FormPath.parse(path).segments
    return findSchemaByPath(segments, unref(getSchema))
  }

  /**
   * @description: 处理 append schema时 遇到void类型的找不到fieldName的问题，递归查找 field 直到找到
   */
  function findVoidItemSchema(schemaList: FormSchema[], segment) {
    const index = schemaList.findIndex((s) => s.field === segment)
    if (index > -1) {
      return {
        schema: schemaList[index],
        index,
        schemaList
      }
    } else if (index === -1 && schemaList.find((s) => s.type === "void")) {
      return findVoidItemSchema(
        schemaList.find((s) => s.type === "void")?.items as FormSchema[],
        segment
      )
    }
  }

  function appendArraySchemaItems(
    items: FormSchema[] | FormSchema,
    path: string,
    index?: number
  ) {
    const schemaList: FormSchema[] = (unref(getSchema))
    _appendArraySchemaByPath(path, schemaList, items, index)
  }

  function _appendArraySchemaByPath(path: string, getSchema, items, idx) {
    const segments = FormPath.parse(path).segments
    const schemaList = unref(getSchema)
    findSchemaByPath(segments, schemaList, (schemaListItem, index) => {
      schemaListItem[index].items?.splice(
        idx ?? schemaListItem[index].items?.length,
        0,
        items
      )
    })
  }

  /**
   * @description: remove Array schema item
   */

  async function removeArraySchemaItems(path: string, index?: number) {
    const schemaList: FormSchema[] = (unref(getSchema))
    _removeArraySchemaByPath(path, schemaList, index)
  }

  function _removeArraySchemaByPath(path: string, getSchema, idx) {
    const schemaList = unref(getSchema)
    const segments = FormPath.parse(path).segments
    findSchemaByPath(segments, schemaList, (schemaListItem, index) => {
      schemaListItem[index].items?.splice(
        idx ?? schemaListItem[index].items?.length,
        1
      )
    })
  }

  /**
   * @description: Query the corresponding schema according to the "path"，and then execute the callback function
   */

  function findSchemaByPath(
    segments,
    schemaListItem,
    cb?: (schemaListItem: FormSchema[], index: number) => void
  ): {
    schemaListVal: FormSchema[]
    pathIndex: number
  } {
    let schemaListVal: FormSchema[] = []
    let pathIndex = 0
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]

      // 查找结束
      if (i === segments.length - 1) {
        const index = schemaListItem.findIndex(
          (schema) => schema.field === segment
        )
        if (index > -1) {
          // 找到了，统一处理回调
          cb?.(schemaListItem, index)
          pathIndex = index
          schemaListVal = schemaListItem[index].items as FormSchema[]
        } else if (schemaListItem.find((s) => s.type === "void")) {
          // 处理 void 类型的情况
          const findData = findVoidItemSchema(
            schemaListItem.find((s) => s.type === "void").items,
            segment
          )
          cb?.(findData.schemaList, findData.index)
          pathIndex = findData.index
          schemaListVal = findData.schema.items as FormSchema[]
        } else throw new Error("path does not match")
      } else {
        if (isString(segment)) {
          const items = schemaListItem.find((s) => s.field === segment)
          if (!items && !schemaListItem.find((s) => s.type === "void")) {
            throw new Error("path does not match")
          }
          // 处理 void 类型的情况
          else if (!items && schemaListItem.find((s) => s.type === "void")) {
            const voidItem = findVoidItemSchema(
              schemaListItem.find((s) => s.type === "void").items,
              segment
            ).schema

            // 也得判断是不是 array 类型
            if (voidItem.type === "array") {
              if (isNumber(segments[i + 1])) {
                schemaListItem = voidItem?.items as FormSchema[]
              } else {
                // container.ports 这种情况
                return voidItem?.items.forEach((schema) => {
                  findSchemaByPath(segments.slice(i + 1), schema, cb)
                })
              }
            } else {
              schemaListItem = schemaListItem.items as FormSchema[]
            }
          } else if (items?.type === "array") {
            // container[0].ports 这种情况
            if (isNumber(segments[i + 1])) {
              schemaListItem = items?.items as FormSchema[]
            } else {
              // container.ports 这种情况
              return items?.items.forEach((schema) => {
                findSchemaByPath(segments.slice(i + 1), schema, cb)
              })
            }
          } else schemaListItem = items?.items as FormSchema[]
        } else if (isNumber(segment)) {
          schemaListItem = schemaListItem[segment] as FormSchema[]
        }
      }
    }

    return {
      schemaListVal,
      pathIndex
    }
  }

  /**
   * @description: add schema
   */
  async function appendSchemaByPath(
    schema: FormSchema[] | FormSchema,
    prefixField: string,
    first = false
  ) {
    if (isString(prefixField)) {
      const schemaList: FormSchema[] = (unref(getSchema))
      const segments = FormPath.parse(prefixField).segments
      findSchemaByPath(segments, schemaList, (schemaListItem, index) => {
        isArray(schema)
          ? schemaListItem.splice(first ? index : index + 1, 0, ...schema)
          : schemaListItem.splice(first ? index : index + 1, 0, schema)
      })
    }
  }

  /**
   * @description: update schema
   */

  async function updateSchemaByPath(
    data:
      | (Partial<FormSchema> & { path: string })
      | Array<Partial<FormSchema> & { path: string }>
  ) {
    let updateData: Array<Partial<FormSchema> & { path: string }> = []
    if (isObject(data)) {
      updateData.push(data as Partial<FormSchema> & { path: string })
    }
    if (isArray(data)) {
      updateData = [...data]
    }

    const hasPath = updateData.every(
      (item) => Reflect.has(item, "path") && item.path
    )

    if (!hasPath) {
      throw new Error(
        "All children of the form Schema array that need to be updated must contain the `path` field"
      )
    }
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema))
    updateData.forEach((item) => {
      _updateSchema(schemaList, item)
    })
    schemaRef.value = schemaList
  }

  function _updateSchema(
    schemaList: FormSchema[],
    item: Partial<FormSchema & { path: string }>
  ) {
    if (isString(item.path)) {
      const segments = FormPath.parse(item.path).segments

      findSchemaByPath(
        segments,
        schemaList,
        (schemaListItem: FormSchema[], index: number) => {
          // 注意：这里只是deepMerge，不是直接覆盖, 但是如果属性是一个函数，比如componentProps，就会直接覆盖
          // 请谨慎使用，否则会导致一些不可预知的问题
          const newSchema = deepMerge(schemaListItem[index], item)
          schemaListItem.splice(index, 1, newSchema as FormSchema)
        }
      )
    }
  }

  /**
   * @description: Delete based on field name
   */

  async function removeSchemaByPath(path: string | string[]): Promise<void> {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema))
    if (!path) {
      return
    }
    const pathList: string[] = isString(path) ? [path] : path
    for (const path of pathList) {
      _removeSchemaByPath(schemaList, path)
    }
    schemaRef.value = schemaList
  }

  function _removeSchemaByPath(schemaList: FormSchema[], path: string) {
    const segments = FormPath.parse(path).segments
    findSchemaByPath(segments, schemaList, (schemaListItem, index) => {
      schemaListItem.splice(index, 1)
    })
  }

  async function resetSchema(
    data: Partial<FormSchema> | Partial<FormSchema>[]
  ) {
    let updateData: Partial<FormSchema>[] = []
    if (isObject(data)) {
      updateData.push(data as FormSchema)
    }
    if (isArray(data)) {
      updateData = [...data]
    }
    schemaRef.value = updateData as FormSchema[]
  }

  function getFieldsValue(): Recordable {
    const formEl = unref(formElRef)
    if (!formEl) return {}
    return handleFormValues(toRaw(unref(formModel)))
  }

  /**
   * @description: Is it time
   */
  function itemIsDateType(key: string) {
    if (!isString(key)) return false
    return dateItemType.includes(key as string)
  }

  async function validateFields(
    field: string[],
    options: {
      trigger?: string
      callback?: FormValidateCallback
      shouldRuleBeApplied?: ApplyRule
    } = {
      callback: () => {}
    }
  ) {
    const formItemEls = unref(formItemElRefs)
    
    formItemEls.forEach((formItemEl) => {
      console.log(unref((formItemEl as any)?.path))
      // @ts-ignore
      if (field.includes((formItemEl as any)?.path)) {
        // @ts-ignore
        console.log('call');
        formItemEl!.validate.call(formItemEl, options as any);
      }
    })
  }
  async function validate(
    validateCallback?: FormValidateCallback,
    shouldRuleBeApplied: ApplyRule = () => true
  ) {
    await unref(formElRef)?.validate(validateCallback, shouldRuleBeApplied)
  }

  async function clearValidate(): Promise<void> {
    await unref(formElRef)?.restoreValidation()
  }

  /**
   * @description: Form submission
   */
  async function handleSubmit<T>(e?: Event): Promise<T> {
    e && e.preventDefault()
    const { submitFunc } = unref(getProps)
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc()
      return {} as T
    }
    const formEl = unref(formElRef)
    if (!formEl) return {} as T
    try {
      await validate()
      const value = await getFieldsValue()
      // format form value
      emit("submit", value)
      return value as T
    } catch (error) {
      throw new Error(error as string)
    }
  }

  return {
    handleSubmit,
    clearValidate,
    validate,
    validateFields,
    getFieldsValue,
    updateSchemaByPath,
    resetSchema,
    appendSchemaByPath,
    removeSchemaByPath,
    resetFields,
    setFieldsValue,
    updateFieldsValue,
    appendArraySchemaItems,
    removeArraySchemaItems,
    getSchemaByPath
  }
}
