import { isFunction, isNullOrUnDef } from "../../utils"
import { NPopover } from "naive-ui"
import "./style.scss"

export default defineComponent({
  name: "FormItemText",
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: "Please enter"
    },
    renderText: {
      type: Function,
      default: null
    }
  },
  setup(props) {
    const prefixCls  = "form-item-text"
    const isEmpty = computed(() => {
      return isNullOrUnDef(props.value) || props.value === ""
    })
    const textValue = computed(() => {
      return isEmpty.value ? props.placeholder : props.value
    })

    const renderTextValue = () => {
      if (props.renderText && isFunction(props.renderText)) {
        return props.renderText(textValue.value)
      } else return textValue.value
    }
    const renderText = () => {
      return (
        <div
          class={[
            `${prefixCls}-input`,
            [
              {
                [`${prefixCls}-disabled`]: props.disabled,
                [`${prefixCls}-input-hover`]: !props.disabled,
                [`${prefixCls}-input-empty`]: isEmpty.value
              }
            ]
          ]}
        >
          {renderTextValue()}
        </div>
      )
    }
    const slots = {
      trigger: () => renderText(),
      default: () => <div>无法编辑</div>
    }
    return () =>
      props.disabled ? (
        <NPopover
          v-slots={slots}
          style={{
            "--n-space-arrow": "8px"
          }}
          trigger="hover"
          placement="top-start"
        ></NPopover>
      ) : (
        renderText()
      )
  }
})
