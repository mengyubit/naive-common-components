import {
  FormProps,
  FormActionType,
  UseFormReturnType,
  FormSchema,
  FormValidateCallback,
  ApplyRule
} from "../types/form"
import { DynamicProps } from "../types/base"
import { ref, onUnmounted, unref, nextTick, watch } from "vue"

export declare type ValidateFields = (nameList?: any[]) => Promise<Recordable>

type Props = Partial<DynamicProps<FormProps>>

export function useForm(props?: Props): UseFormReturnType {
  const formRef = ref<Nullable<FormActionType>>(null)
  const loadedRef = ref<Nullable<boolean>>(false)

  async function getForm() {
    const form = unref(formRef)

    if (!form) {
      throw new Error(
        "The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!"
      )
    }
    await nextTick()
    return form as FormActionType
  }
  function getDynamicProps<T, U>(props: T): Partial<U> {
    const ret: Recordable = {}

    Object.keys(props).map((key) => {
      ret[key] = unref((props as Recordable)[key])
    })

    return ret as Partial<U>
  }

  function register(instance: FormActionType) {
    onUnmounted(() => {
      formRef.value = null
      loadedRef.value = null
    })
    if (unref(loadedRef) && instance === unref(formRef)) return

    formRef.value = instance
    loadedRef.value = true

    watch(
      () => props,
      () => {
        props && instance.setProps(getDynamicProps(props))
      },
      {
        immediate: true,
        deep: true
      }
    )
  }

  const methods: FormActionType = {
    setProps: async (formProps: Partial<FormProps>) => {
      const form = await getForm()
      form.setProps(formProps)
    },

    getFormModal: () => {
      return formRef.value?.getFormModal() || {}
    },

    updateFieldsValue: async <T>(values: T) => {
      const form = await getForm()
      form.updateFieldsValue(values)
    },
    updateSchemaByPath: async (
      data:
        | (Partial<FormSchema> & { path: string })
        | Array<Partial<FormSchema> & { path: string }>
    ) => {
      const form = await getForm()
      form.updateSchemaByPath(data)
    },
    initDefault: () => {
      unref(formRef)?.initDefault()
    },
    resetSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm()
      form.resetSchema(data)
    },

    restoreValidation: async () => {
      const form = await getForm()
      form.restoreValidation()
    },
    clearValidate: async () => {
      const form = await getForm()
      await form.clearValidate()
    },

    resetFields: async (formModelValue?: Recordable) => {
      getForm().then(async (form) => {
        await form.resetFields(formModelValue)
      })
    },

    removeSchemaByPath: async (field: string | string[]) => {
      unref(formRef)?.removeSchemaByPath(field)
    },
    replaceSchemaByField: async (
      schema: FormSchema | FormSchema[],
      predFiled?: string,
      nextFiled?: string
    ) => {
      const form = await getForm()
      form.replaceSchemaByField(schema, predFiled, nextFiled)
    },

    // TODO promisify
    getFieldsValue: <T>() => {
      return unref(formRef)?.getFieldsValue() as T
    },
    setFieldsValue: async <T>(values: T) => {
      const form = await getForm()
      form.setFieldsValue<T>(values)
    },
    appendSchemaByPath: async (
      schema: FormSchema | FormSchema[],
      prefixField: string,
      first?: boolean
    ) => {
      const form = await getForm()
      form.appendSchemaByPath(schema, prefixField, first)
    },

    submit: async <T>(): Promise<Recordable<any> | T> => {
      const form = await getForm()
      return form.submit<T>()
    },

    validate: async (
      validateCallback?: FormValidateCallback,
      shouldRuleBeApplied: ApplyRule = () => true
    ): Promise<Recordable> => {
      const form = await getForm()
      return form.validate(validateCallback, shouldRuleBeApplied)
    },
    validateFields: async (
      field: string[],
      options: { trigger?: string; callback?: FormValidateCallback },
      shouldRuleBeApplied?: ApplyRule
    ): Promise<any> => {
      const form = await getForm()
      return form.validateFields(field, options, shouldRuleBeApplied)
    },
    setLoading: async (loading: boolean) => {
      const form = await getForm()
      form.setLoading(loading)
    }
  }

  return [register, methods]
}
