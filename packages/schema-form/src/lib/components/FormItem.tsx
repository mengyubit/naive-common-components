import {
  PropType,
  resolveComponent,
  renderSlot,
  CSSProperties,
  VNodeChild,
  nextTick,
  onUnmounted,
  defineComponent,
  computed,
  unref,
  ref,
  Ref
} from "vue"
import {
  ApplyRule,
  FormProps,
  FormValidateCallback,
  FormSchema
} from "../types/form"
import {
  NInput,
  FormItemRule,
  NFormItem,
  NForm,
  ColProps,
  NSkeleton
} from "naive-ui"
import { FORM_ITEM_STYLE } from "../const"
import { isBoolean, isFunction, isNull, isNullOrUnDef, isString } from "../utils/is"
import BasicHelp from "./basic-help/BasicHelp.vue"
import { upperFirst, cloneDeep, get } from "lodash-es"
import { componentMap, editModelCompMap } from "../componentMap"
import { useFormContext } from "../hooks/useFormContext"
import { useFormItemApi } from "../hooks/useFormItemApi"
import { ComponentType } from "../types/component"
import { createField, createFieldSchema } from "../hooks/useFormContext"
import FormItemText from "./form-item-text/FormItemText"
import {
  createPlaceholderMessage,
  createThemeOverrides,
  createTrigger,
  setComponentRuleType
} from "../helper"
import GridItem from "./GridItem"
import { onClickOutside } from "@vueuse/core"

export default defineComponent({
  name: "BasicFormItem",
  __GRID_ITEM__: true,
  components: {
    NInput
  },
  props: {
    schema: {
      type: Object as PropType<FormSchema>,
      default: () => ({})
    },
    rule: {
      type: Object as PropType<FormItemRule>,
      default: null
    },
    path: {
      type: String,
      default: null
    }
  },
  setup(props, { slots }) {
    const formItem = ref<InstanceType<typeof NForm> | null>()
    const formItemComp = ref<InstanceType<typeof NForm> | null>()
    const edit = ref(false)
    let stopOutSideWatch: Fn | null = null

    // 需要设置成响应式，否则schema变化不会触发重新渲染
    const { schema } = toRefs(props) as {
      schema: Ref<FormSchema>
    }

    const {
      formModel,
      formActionType,
      setFormModel,
      validate: formValidate,
      getBindValues
    } = useFormContext()
    const formProps = computed<Partial<FormProps>>(() =>
      unref(unref(getBindValues).getProps)
    )

    const globDisabled = computed(() => unref(formProps).disabled)

    const { getOptions, getLoading } = useFormItemApi({
      apiConfig: props.schema.apiConfig
    })

    const bindVal = computed(() =>
      get(formModel, props.path ?? props.schema.field)
    )

    const getValues = computed(() => {
      const { schema, path } = props
      return {
        field: schema.field,
        path,
        model: formModel,
        bindVal,
        values: formModel,
        schema: schema
      }
    })

    const initRegister = () => {
      createField(props.path)
      createFieldSchema(schema)
    }

    onMounted(() => {
      const { storageFormItemEl } = useFormContext();
      if (formItem.value) {
        storageFormItemEl(formItem.value, false);
      }
    });
    
    onUnmounted(() => {
      const { storageFormItemEl } = useFormContext();
      if (formItem.value) {
        storageFormItemEl(formItem.value, true);
      }
    });

    const getComponentsProps = computed(() => {
      const { schema } = props
      const { componentProps = {} } = schema
      if (!isFunction(componentProps)) {
        return componentProps
      }
      return (
        componentProps({
          schema,
          formModel,
          formActionType,
          path: props.path,
          bindVal
        }) ?? {}
      )
    })

    const getDisable = computed(() => {
      const { dynamicDisabled } = props.schema
      const { disabled: itemDisabled = false } = unref(getComponentsProps)
      let disabled = !!unref(globDisabled) || itemDisabled
      if (isBoolean(dynamicDisabled)) {
        disabled = dynamicDisabled
      }
      if (isFunction(dynamicDisabled)) {
        disabled = dynamicDisabled(unref(getValues))
      }
      return disabled
    })

    function getShow(): { isShow: boolean; isIfShow: boolean } {
      const { show, ifShow } = props.schema
      const { showAdvancedButton } = unref(formProps)
      const itemIsAdvanced = showAdvancedButton
        ? isBoolean(props.schema.isAdvanced)
          ? props.schema.isAdvanced
          : true
        : true

      let isShow = true
      let isIfShow = true

      if (isBoolean(show)) {
        isShow = show
      }
      if (isBoolean(ifShow)) {
        isIfShow = ifShow
      }
      if (isFunction(show)) {
        isShow = show(unref(getValues))
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(unref(getValues))
      }
      isShow = isShow && itemIsAdvanced
      return { isShow, isIfShow }
    }

    function handleRules(): FormItemRule[] | FormItemRule | undefined {
      const {
        rules: defRules = [],
        component,
        rulesMessageJoinLabel,
        label,
        dynamicRules,
        required
      } = props.schema

      if (!required) return

      if (isFunction(dynamicRules)) {
        return dynamicRules(unref(getValues)) as FormItemRule[]
      }

      let rules: FormItemRule[]

      if (isFunction(defRules)) {
        rules = cloneDeep(defRules(formModel) as any) as FormItemRule[]
      } else {
        rules = cloneDeep(defRules) as FormItemRule[]
      }
      const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = unref(
        formProps
      )

      const joinLabel = Reflect.has(props.schema, "rulesMessageJoinLabel")
        ? rulesMessageJoinLabel
        : globalRulesMessageJoinLabel

      const defaultMsg =
        createPlaceholderMessage(component!) +
        ` ${joinLabel ? (isString(label) ? label : "") : ""}`

      function validator(rule: FormItemRule, value: any) {
        const msg = rule.message || defaultMsg
        if (value === undefined || isNull(value)) {
          // 空值
          return new Error(msg as string)
        } else if (Array.isArray(value) && value.length === 0) {
          // 数组类型
          return new Error(msg as string)
        } else if (typeof value === "string" && value.trim() === "") {
          // 空字符串
          return new Error(msg as string)
        } else if (
          typeof value === "object" &&
          Reflect.has(value, "checked") &&
          Reflect.has(value, "halfChecked") &&
          Array.isArray(value.checked) &&
          Array.isArray(value.halfChecked) &&
          value.checked.length === 0 &&
          value.halfChecked.length === 0
        ) {
          // 非关联选择的tree组件
          return new Error(msg as string)
        }
        return true
      }

      const getRequired = isFunction(required)
        ? required(unref(getValues))
        : required

      /*
       * rules中的required，优先级大于required
       */
      if (getRequired) {
        if (!rules || rules.length === 0) {
          rules = [
            {
              required: getRequired,
              validator,
              trigger: createTrigger(component!)
            }
          ]
        } else {
          const requiredIndex: number = rules.findIndex((rule) =>
            Reflect.has(rule, "required")
          )

          if (requiredIndex === -1) {
            rules.push({
              required: getRequired,
              validator,
              trigger: createTrigger(component!)
            })
          }
        }
      }

      const requiredRuleIndex: number = rules.findIndex(
        (rule) =>
          Reflect.has(rule, "required") && !Reflect.has(rule, "validator")
      )

      if (requiredRuleIndex !== -1) {
        const rule = rules[requiredRuleIndex]
        const { isShow } = getShow()
        if (!isShow) {
          rule.required = false
        }
        if (component) {
          if (!Reflect.has(rule, "type")) {
            rule.type = component === "n-input-number" ? "number" : "string"
          }

          rule.message = rule.message || defaultMsg
          const valueFormat = unref(getComponentsProps)?.valueFormat
          setComponentRuleType(rule, component, valueFormat)
        }
      }

      return rules
    }

    function getLabel(): string | VNodeChild {
      const { label = "", subLabel } = props.schema
      const { loading } = unref(getBindValues)
      if (isFunction(label)) {
        return label(unref(getValues), formActionType, renderLabelHelpMessage)
      }
      const renderLabel = subLabel ? (
        <span>
          {label}
          <span>{subLabel}</span>
        </span>
      ) : (
        label
      )

      return unref(loading) ? (
        <NSkeleton text style="height:100%" round />
      ) : (
        <span style="display: flex; position: relative;">
          {renderLabel}
          {renderLabelHelpMessage()}
        </span>
      )
    }

    function formItemTextClick() {
      edit.value = true
      nextTick(() => {
        ;((formItemComp.value as never) as HTMLElement)?.focus?.()
      })
    }

    function renderComponent(compParams: Recordable = {}) {
      const {
        renderComponentContent,
        component,
        field = "",
        changeEvent = "update:value",
        valueField,
        apiConfig,
        type,
        label,
        defaultValue,
        isValidateTrigger,
        componentProps
      } = props.schema

      const isCheck = component && ["n-checkbox"].includes(component as string)

      const eventKey = `on${upperFirst(changeEvent)}`

      function setFieldValue(args: Nullable<Recordable>[]) {
        const [e] = args
        if (propsData[eventKey]) {
          propsData[eventKey](...args)
        }
        const target = e ? e.target : null
        const value = target ? (isCheck ? target.checked : target.value) : e
        setFormModel(props.path, value)
        // 是否需要主动触发校验
        if (isValidateTrigger) formItem.value?.validate()
      }

      const on = {
        [eventKey]: (...args: Nullable<Recordable>[]) => {
          setFieldValue(args)
        },
        onBlur: onBlurHandler
      }

      const Comp =
        typeof component === "string"
          ? componentMap.has(component as ComponentType)
            ? (componentMap.get(component as ComponentType) as ReturnType<
                typeof defineComponent
              >)
            : resolveComponent(component)
          : toRaw(component) // 去除组件的响应式，不然会报警告

      const {
        size,
        autoSetPlaceHolder,
        themeOverrides,
        isEditMode,
        labelPlacement,
        formSubmitRequestFn
      } = unref(formProps)
      async function onBlurHandler() {
        if (isEditMode) {
          try {
            await validate({
              callback: async (error) => {
                if (!error) {
                  edit.value = false
                }
              }
            })
            await formValidate()
            await formSubmitRequestFn?.()
          } catch (error) {
            console.log("formValidate error", error)
          }
        }
      }
      const propsData: Recordable = {
        allowClear: true,
        getPopupContainer: (trigger: Element) => trigger.parentNode,
        size,
        ...unref(getComponentsProps),
        disabled: unref(getDisable)
      }

      const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder

      // RangePicker place is an array
      if (isCreatePlaceholder && component) {
        propsData.placeholder = isNullOrUnDef(
          unref(getComponentsProps)?.placeholder
        )
          ? `${createPlaceholderMessage(component)} ${
              isString(label) ? label?.toLocaleLowerCase() : ""
            }`
          : unref(getComponentsProps)?.placeholder
      }

      propsData.codeField = field
      propsData.formValues = unref(getValues)
      propsData.labelPlacement = unref(labelPlacement)

      if (apiConfig) {
        const { optionsKey = "options", loadingFiled = "loading" } = apiConfig
        propsData[optionsKey] = unref(getOptions)
        propsData[loadingFiled] = unref(getLoading)
      }

      if (themeOverrides) {
        propsData["theme-overrides"] = createThemeOverrides(
          themeOverrides,
          component!
        )
      }

      const bindValue = {
        [valueField || (isCheck ? "checked" : "value")]: unref(bindVal)
      }
      if (defaultValue && bindVal.value === undefined && type !== "void") {
        // 为了解决类似n-input-number这种自定义组件的defaultValue不生效的问题
        propsData["defaultValue"] = defaultValue

        // 给formModel赋默认值
        // 如果没有在schema配置defaultValue属性，那么会默认的遍历schema结构，构造当前schema的默认值
        // 这里赋值是为了兼容defaultValue为空数组的情况
        setFormModel(props.path, defaultValue)
      }

      const compAttr: Recordable = {
        ...compParams,
        ...propsData,
        ...on,
        ...(type !== "void" ? bindValue : {})
      }

      // 渲染组件slot
      const compSlot = isFunction(renderComponentContent)
        ? renderComponentContent(unref(getValues))
        : renderComponentContent

      // 在 EditMode 下会有复杂的组合组件，比如n-input-group，其中没有触发onBlur事件的方法，所以需要手动触发
      // 注: 需要内部组件 autofocus
      if (isEditMode && renderComponentContent) {
        if (!stopOutSideWatch) {
          stopOutSideWatch = onClickOutside(formItemComp, onBlurHandler)!
        }
      }

      const supportEditModel =
        isString(component) &&
        editModelCompMap.some((item) => component.includes(item))

      if (isEditMode && !edit.value && supportEditModel) {
        return (
          <FormItemText
            {...compAttr}
            onClick={
              !(componentProps as Recordable)?.disabled && formItemTextClick
            }
          />
        )
      } else
        return (
          <Comp ref={formItemComp} {...compAttr}>
            {compSlot}
          </Comp>
        )
    }
    // 触发item验证
    const validate = async (options: {
      trigger?: string
      callback?: FormValidateCallback
      shouldRuleBeApplied?: ApplyRule
    }) => {
      // @ts-ignore
      unref(formItem)?.validate?.(options)
      if (isFunction(unref(formItemComp)?.validate)) {
        await unref(formItemComp)?.validate?.(options.callback)
      }
    }

    function renderLabelHelpMessage(): VNodeChild {
      const {
        helpMessage,
        helpComponentProps,
        helpComponentSlot
      } = props.schema

      const getHelpMessage = isFunction(helpMessage)
        ? helpMessage(unref(getValues))
        : helpMessage
      if (
        (!helpComponentSlot && !getHelpMessage) ||
        (Array.isArray(getHelpMessage) && getHelpMessage.length === 0)
      ) {
        return null
      }
      const slots = isFunction(helpComponentSlot) ? helpComponentSlot() : null
      return (
        <BasicHelp
          placement="top"
          class="mx-1"
          v-slots={slots}
          text={getHelpMessage}
          {...helpComponentProps}
        />
      )
    }

    const FormItemContentStyle = (): CSSProperties => {
      return {
        display: "flex",
        width: "100%"
      }
    }

    function renderItem() {
      const {
        itemProps = {},
        itemStyle,
        slot,
        render,
        field,
        suffix,
        type = "field",
        defaultValue
      } = props.schema

      const getContent = (formItemProps = {}) => {
        const { loading } = unref(getBindValues)
        if (unref(loading)) {
          // @TODO 这里的 30px 需要优化
          return <NSkeleton text style="height:30px;" round />
        }
        if (render) {
          setFormModel(props.path, defaultValue)
          return render(unref(getValues))
          // 给 formModel 赋值
        }
        return renderComponent(formItemProps)
      }
      const formItemProps = {
        style: {
          ...FORM_ITEM_STYLE,
          ...formProps.value.itemStyle,
          ...itemStyle
        },
        ...(itemProps as Recordable)
      }

      if (type !== "field") {
        return getContent(formItemProps)
      }

      const getSlotContent = (slot) => {
        return {
          label: () => getLabel(),
          [slot]: () => renderSlot(slots, slot, unref(getValues))
        }
      }
      const showSuffix = !!suffix
      const getSuffix = isFunction(suffix) ? suffix(unref(getValues)) : suffix
      return (
        <NFormItem
          path={props.path ?? field}
          key={props.path ?? field}
          class={{ "suffix-item": showSuffix }}
          {...formItemProps}
          rule={handleRules()}
          v-slots={getSlotContent(slot)}
          ref={formItem}
        >
          <div style={FormItemContentStyle()}>
            {getContent()}
            {showSuffix && <span class="suffix">{getSuffix}</span>}
          </div>
        </NFormItem>
      )
    }
    initRegister()
    onUnmounted(() => {
      if (stopOutSideWatch) {
        stopOutSideWatch()
      }
    })
    return {
      getValues,
      formProps,
      getShow,
      renderItem,
      validate
    }
  },
  render() {
    const { getValues, formProps, getShow, renderItem } = this
    const { colProps = {}, colSlot, renderColContent, span } = this.schema
    const { baseColProps = {} } = formProps
    const realColProps: Recordable = { ...baseColProps, ...colProps }
    realColProps["span"] = span

    const { isIfShow, isShow } = getShow()

    const values = unref(getValues)
    const getContent = () => {
      return colSlot
        ? renderSlot(this.$slots, colSlot, values)
        : renderColContent
        ? renderColContent(values)
        : renderItem()
    }
    return (
      isIfShow && (
        <GridItem v-show={isShow} {...(realColProps as ColProps)}>
          {getContent()}
        </GridItem>
      )
    )
  }
})
