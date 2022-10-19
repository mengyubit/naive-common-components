import { CSSProperties } from "vue"
import { ArrowDirection, EArrowDirection, IStep } from "./interface"

export const getNodeBySelector = (selector: string) => {
  return document.querySelector(selector)
}

// 计算元素在页面中的位置
export const getPageOffset = (node: HTMLElement) => {
  if (!node) {
    return null
  }
  const { left, top } = node.getBoundingClientRect()
  const { scrollLeft, scrollTop } = document.documentElement
  return {
    left: left + scrollLeft,
    top: top + scrollTop
  }
}

type ElementInfo = {
  left: number
  top: number
  width: number
  height: number
}

export const getViewOffset: (
  element: HTMLElement | null
) => null | ElementInfo = (element) => {
  if (!element) {
    return null
  }
  const { left, top } = element.getBoundingClientRect()
  const { scrollLeft, scrollTop } = document.documentElement
  return {
    left: left - scrollLeft,
    top: top - scrollTop,
    width: element.offsetWidth,
    height: element.offsetHeight
  }
}
// 计算高亮的target的位置
export const calcTargetViewOffset = (step: IStep,
  anchorInfo: null | ElementInfo) => {
    if (!anchorInfo) {
      return null
    }
    
    const {  height: targetHeight, width: targetWidth } = anchorInfo
    const { width = 0, height = 0 } = step.arrowImageStyle || {}
    const arrowWidth = parseInt(width, 10)
    const arrowHeight = parseInt(height, 10)
    const leftPosition  = -targetWidth / 2
    const topPosition =  -targetHeight
    const offsetY= step.arrowExtraInfo?.offsetY || 0

    return {
      left: leftPosition - offsetY,
      top: topPosition - offsetY,
      width: arrowWidth,
      height: arrowHeight
    }
  }

// 计算arrow 在 view中的位置
export const calcArrowViewOffset = (
  step: IStep,
  anchorInfo: null | ElementInfo
) => {
  if (!anchorInfo) {
    return null
  }

  const {  height: targetHeight } = anchorInfo
  const { width = 0, height = 0 } = step.arrowImageStyle || {}
  const { arrowDirection = EArrowDirection.RIGHT_TOP, arrowExtraInfo } = step
  const arrowWidth = parseInt(width, 10)
  const arrowHeight = parseInt(height, 10)

  switch (arrowDirection) {
    case EArrowDirection.RIGHT_TOP: {
      const leftPosition = -arrowWidth
      const topPosition =  0
      return {
        left: leftPosition + (arrowExtraInfo?.offsetX || 0),
        top: topPosition + (arrowExtraInfo?.offsetY || 0),
        width: arrowWidth,
        height: arrowHeight
      }
    }

    case EArrowDirection.RIGHT_BOTTOM: {
      const leftPosition = -arrowWidth
      const topPosition = -arrowHeight - targetHeight

      return {
        left: leftPosition + (arrowExtraInfo?.offsetX || 0),
        top: topPosition - (arrowExtraInfo?.offsetY || 0),
        width: arrowWidth,
        height: arrowHeight
      }
    }

    case EArrowDirection.LEFT_TOP: {
      const leftPosition =  0
      const topPosition =  0
      return {
        left: leftPosition - (arrowExtraInfo?.offsetX || 0),
        top: topPosition + (arrowExtraInfo?.offsetY || 0),
        width: arrowWidth,
        height: arrowHeight
      }
    }

    case EArrowDirection.LEFT_BOTTOM: {
      const leftPosition = 0
      const topPosition = -arrowHeight - targetHeight
      return {
        left: leftPosition - (arrowExtraInfo?.offsetX || 0),
        top: topPosition - (arrowExtraInfo?.offsetY || 0),
        width: arrowWidth,
        height: arrowHeight
      }
    }
  }
}

// 计算dialog 在页面中的位置
export const calcDialogViewOffset = (
  step: IStep,
  arrowInfo: null | ElementInfo
) => {
  if (!arrowInfo) {
    return
  }
  const { left, top, height: targetHeight, width: targetWidth } = arrowInfo
  const { width = 0, height = 0 } = step.dialogStyle || {}
  const { arrowDirection = EArrowDirection.RIGHT_TOP } = step
  const dialogWidth = parseInt(width, 10)
  const dialogHeight = parseInt(height, 10)

  switch (arrowDirection) {
    case EArrowDirection.RIGHT_TOP: {
      const leftPosition = left - dialogWidth
      const topPosition = top + targetHeight / 2

      return {
        left: leftPosition,
        top: topPosition,
        width: dialogWidth,
        height: dialogHeight
      }
    }

    case EArrowDirection.RIGHT_BOTTOM: {
      const leftPosition = left - dialogWidth
      const topPosition = top - targetHeight

      return {
        left: leftPosition,
        top: topPosition,
        width: dialogWidth,
        height: dialogHeight
      }
    }

    case EArrowDirection.LEFT_TOP: {
      const leftPosition = left + targetWidth
      const topPosition = top + targetHeight / 2

      return {
        left: leftPosition,
        top: topPosition,
        width: dialogWidth,
        height: dialogHeight
      }
    }

    case EArrowDirection.LEFT_BOTTOM: {
      const leftPosition = left + targetWidth
      const topPosition = top - targetHeight / 2

      return {
        left: leftPosition,
        top: topPosition,
        width: dialogWidth,
        height: dialogHeight
      }
    }
  }
}

export const getMergedArrowStyle = (
  arrowStyle: CSSProperties,
  arrowDirection: ArrowDirection
) => {
  if (arrowDirection === EArrowDirection.LEFT_BOTTOM) {
    return {
      ...arrowStyle,
      transform: "rotate(180deg)"
    }
  } else if (arrowDirection === EArrowDirection.LEFT_TOP) {
    return {
      ...arrowStyle,
      transform: "rotateY(180deg)"
    }
  } else if (arrowDirection === EArrowDirection.RIGHT_BOTTOM) {
    return {
      ...arrowStyle,
      transform: "rotateX(180deg)"
    }
  } else {
    return arrowStyle
  }
}
