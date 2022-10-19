import { NButton, NSpace } from "naive-ui"
import { CSSProperties } from "vue"
import {
  getNodeBySelector,
  getViewOffset,
  calcArrowViewOffset,
  calcDialogViewOffset,
  getMergedArrowStyle
} from "../utils"
import { IStep } from "../interface"
import "./step.scss"

export default defineComponent({
  name: "VStep",
  props: {
    step: {
      type: Object as PropType<IStep>,
      default: () => ({})
    }
  },
  emits: ["confirm", "cancel"],
  setup(props, { slots, emit }) {
    function handleOk(e: Event) {
      emit("confirm", e)
    }

    function handleCancel(e: Event) {
      emit("cancel", e)
    }
    const footerContainerStyle = computed(
      (): CSSProperties => {
        return {
          borderTop: "1px solid var(--n-border-color)",
          ...(props.step.footerStyle as CSSProperties)
        }
      }
    )

    return () => {
      const {
        cancelText = "skip",
        confirmText = "next",
        cancelButtonProps,
        confirmButtonProps,
        showConfirmBtn = true,
        showCancelBtn = true,
        arrowImageUrl,
        arrowImageStyle = {},
        dialogStyle = {},
        target,
        renderTarget,
        targetStyle,
        targetInnerStyle,
        header,
        content,
        arrowDirection = "RIGHT_TOP"
      } = props.step
      const mergedArrowStyle = getMergedArrowStyle(
        arrowImageStyle,
        arrowDirection
      )
      const currentNode: HTMLElement | null = getNodeBySelector(
        target
      ) as HTMLElement | null
      const anchorInfo = getViewOffset(currentNode)
      const { left, top } = anchorInfo || {}
      const arrowPosition = calcArrowViewOffset(props.step, anchorInfo)
      const dialogPosition = (arrowPosition &&
        calcDialogViewOffset(props.step, arrowPosition)) || {
        left: "auto",
        top: "auto"
      }
      return (
        <>
          <div
            class="v-step"
            style={{
              ...dialogStyle,
              left: dialogPosition?.left + "px",
              top: dialogPosition?.top + "px"
            }}
          >
            <div class="v-step__header">{header}</div>
            <div class="v-step__content">{content}</div>
            <NSpace
              class="v-step__footer"
              style={unref(footerContainerStyle)}
              justify="end"
            >
              {showCancelBtn ? (
                <NButton {...cancelButtonProps} onClick={handleCancel}>
                  {cancelText}
                </NButton>
              ) : null}
              {showConfirmBtn ? (
                <NButton
                  {...confirmButtonProps}
                  onClick={handleOk}
                  type="primary"
                >
                  {confirmText}
                </NButton>
              ) : null}
            </NSpace>
          </div>
          {renderTarget ? (
            <div
              style={{
                position: "fixed",
                left: `${left || "auto"}px`,
                top: `${top || "auto"}px`,
                ...targetStyle
              }}
            >
              {renderTarget()}
            </div>
          ) : (
            <div
              class="v-step__target"
              style={{
                left: `${left || "auto"}px`,
                top: `${top || "auto"}px`,
                ...targetStyle
              }}
            >
              <div
                style={targetInnerStyle}
                class="v-step__target-inner"
                v-html={currentNode?.outerHTML}
              ></div>
            </div>
          )}

          {arrowImageUrl && (
            <div
              style={{
                ...mergedArrowStyle,
                left: arrowPosition?.left + "px",
                top: arrowPosition?.top + "px"
              }}
              class="v-step__arrow"
            >
              <img src={arrowImageUrl} class="step__arrow__image" />
            </div>
          )}
        </>
      )
    }
  }
})
