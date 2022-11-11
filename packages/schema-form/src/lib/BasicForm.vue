<template>
  <NForm
    v-bind="getBindValue"
    ref="formElRef"
    :model="formModel"
    class="basic-form"
    @keypress.enter="handleEnterPress"
  >
    <slot name="formHeader"></slot>
    <NGrid v-bind="getRow">
      <template v-for="schema in getSchema" :key="schema.field">
        <FormItem
          :ref="storageFormItemEl"
          :span="schema.span"
          v-bind="schema.colProps"
          :schema="{
            ...schema,
            rowProps: { ...getRow, ...(schema.rowProps || {}) }
          }"
          :field-value="formModel"
          :path="schema.field"
        >
          <template v-for="item in Object.keys($slots)" #[item]="data">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </FormItem>
      </template>
    </NGrid>
    <slot name="formFooter"></slot>
  </NForm>
</template>
<script lang="ts">
import { FormActionType, FormProps, FormSchema } from "./types/form"
import { AdvanceState } from "./types/hooks"
import { Ref, markRaw, toRaw } from "vue"
import {
  defineComponent,
  reactive,
  ref,
  computed,
  unref,
  onMounted,
  watch
} from "vue"
import FormItem from "./components/FormItem"
import { dateItemType } from "./helper"
import moment from "moment"
import { deepMerge } from "./utils"
import { useFormValues } from "./hooks/useFormValues"
import { useFormEvents } from "./hooks/useFormEvents"
import { createFormContext } from "./hooks/useFormContext"
import { useAutoFocus } from "./hooks/useAutoFocus"
import { NForm } from "naive-ui"
import { set } from "lodash-es"

import { basicProps } from "./props"
import { Recordable, Nullable } from "./types/index"
import { useLoading } from './hooks/tools/useLoading'

export default defineComponent({
  name: "BasicForm",
  components: { FormItem },
  props: basicProps,
  emits: ["advanced-change", "reset", "submit", "register"],
  setup(props, { emit, attrs }) {
    // 不能接受外部modal，会导致多个modal同时存在一个对象
    const formModel = reactive<Recordable>({})
    const advanceState = reactive<AdvanceState>({
      isAdvanced: true,
      hideAdvanceBtn: false,
      isLoad: false,
      actionSpan: 6
    })
    const defaultValueRef = ref<Recordable>({})
    const isInitedDefaultRef = ref(false)
    const propsRef = ref<Partial<FormProps>>({})
    const schemaRef = ref<Nullable<FormSchema[]>>(null)
    const formElRef = ref<Nullable<FormActionType>>(null)
    const formItemElRefs = markRaw<Array<InstanceType<typeof NForm>>>([])

    const storageFormItemEl = (el) => {
      formItemElRefs.push(el)
    }

    const getProps = computed(
      (): FormProps => {
        // @ts-ignore
        return { ...props, ...unref(propsRef) }
      }
    )

    const getRow = computed(
      (): Recordable => {
        const { rowProps } = unref(getProps)
        return {
          ...rowProps
        }
      }
    )

    const getBindValue = computed(
      () => ({ ...attrs, ...props, ...unref(getProps) } as Recordable)
    )

    const getSchema = computed((): FormSchema[] => {
      const schemas: FormSchema[] =
        unref(schemaRef) || (unref(getProps).schemas as any)

      for (const schema of schemas) {
        const { defaultValue, component } = schema
        // handle date type
        if (defaultValue && dateItemType.includes(component as string)) {
          if (!Array.isArray(defaultValue)) {
            schema.defaultValue = moment(defaultValue)
          } else {
            const def = []
            defaultValue.forEach((item) => {
              def.push(moment(item) as never)
            })
            schema.defaultValue = def
          }
        }
      }
      return schemas as FormSchema[]
    })

    const { handleFormValues, initDefault } = useFormValues({
      getProps,
      defaultValueRef,
      getSchema,
      formModel
    })

    const { getLoading, setLoading } = useLoading<FormProps>(getProps)

    useAutoFocus({
      getSchema,
      getProps,
      isInitedDefault: isInitedDefaultRef,
      formElRef: formElRef as Ref<FormActionType>
    })

    const {
      handleSubmit,
      setFieldsValue,
      clearValidate,
      validate,
      validateFields,
      getFieldsValue,
      updateSchemaByPath,
      resetSchema,
      appendSchemaByPath,
      removeSchemaByPath,
      resetFields,
      updateFieldsValue,
      appendArraySchemaItems,
      removeArraySchemaItems,
      getSchemaByPath
    } = useFormEvents({
      emit,
      getProps,
      formModel,
      getSchema,
      defaultValueRef,
      formElRef: formElRef as Ref<FormActionType>,
      formItemElRefs,
      schemaRef: schemaRef as Ref<FormSchema[]>,
      handleFormValues
    })

    watch(
      () => unref(getProps).model,
      () => {
        const { model } = unref(getProps)
        if (!model || Object.keys(model).length === 0) return
        setFieldsValue(model)
      },
      {
        immediate: true
      }
    )

    watch(
      () => unref(getProps).schemas,
      (schemas) => {
        resetSchema(schemas ?? [])
      }
    )

    watch(
      () => getSchema.value,
      (schema) => {
        if (unref(isInitedDefaultRef)) {
          return
        }
        if (schema?.length) {
          initDefault()
          isInitedDefaultRef.value = true
        }
      }
    )

    async function setProps(formProps: Partial<FormProps>): Promise<void> {
      propsRef.value = deepMerge(unref(propsRef) || {}, formProps)
    }

    function setFormModel(key: string, value: any) {
      set(formModel, key, value)
      const { validateTrigger } = unref(getBindValue)
      if (validateTrigger && validateTrigger === "change") {
        validateFields([key])
      }
    }

    function handleEnterPress(e: KeyboardEvent) {
      const { autoSubmitOnEnter } = unref(getProps)
      if (!autoSubmitOnEnter) return
      if (e.key === "Enter" && e.target && e.target instanceof HTMLElement) {
        const target: HTMLElement = e.target as HTMLElement
        if (
          target &&
          target.tagName &&
          target.tagName.toUpperCase() == "INPUT"
        ) {
          handleSubmit()
        }
      }
    }

    const formActionType: Partial<FormActionType> = {
      getFieldsValue,
      setFieldsValue,
      resetFields,
      getFormModal: () => formModel,
      updateFieldsValue,
      updateSchemaByPath,
      resetSchema,
      setProps,
      removeSchemaByPath,
      appendSchemaByPath,
      clearValidate,
      validateFields,
      validate,
      submit: handleSubmit,
      initDefault,
      setLoading
    }

    const getBindValues = computed(() => {
      const propsData: Recordable = {
        loading: getLoading,
        allDefaultValues: defaultValueRef,
        getProps: propsRef as Ref<Partial<FormProps>>
      }

      return propsData
    })

    createFormContext({
      setFormModel,
      formModel,
      formActionType,
      getBindValues,
      validate,
      appendArraySchemaItems,
      removeArraySchemaItems,
      getSchemaByPath
    })

    onMounted(() => {
      initDefault()

      emit("register", formActionType)
    })

    return {
      formItemElRefs,
      getBindValue,
      formModel,
      defaultValueRef,
      advanceState,
      getRow,
      getProps,
      formElRef,
      getSchema,
      formActionType: formActionType as any,
      getFormActionBindProps: computed(
        (): Recordable => ({ ...getProps.value, ...advanceState })
      ),
      setFormModel,
      handleEnterPress,
      storageFormItemEl,
      ...formActionType
    }
  }
})
</script>

<style scoped lang="scss">
$class-prefix: basic-form;
.#{$class-prefix} {
  ::v-deep(.n-form-item-label) {
    display: flex;
  }
}
</style>
