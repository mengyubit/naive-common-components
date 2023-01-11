import { h, defineComponent, inject, getCurrentInstance, PropType } from "vue"
import { pxfy } from "seemly"
import { NGridItem } from "naive-ui"
import { ExtractPublicPropTypes, keysOf } from "naive-ui/es/_utils"
import { gridInjectionKey } from "naive-ui/lib/grid/src/config"

export const defaultSpan = 1

interface GridItemVNodeProps {
  privateOffset?: number
  privateSpan?: number
  privateColStart?: number
  privateShow?: boolean
}

export const gridItemProps = {
  span: {
    type: [Number, String] as PropType<string | number>,
    default: defaultSpan
  },
  offset: {
    type: [Number, String] as PropType<string | number>,
    default: 0
  },
  suffix: Boolean,
  // private props
  privateOffset: Number,
  privateSpan: Number,
  privateColStart: Number,
  privateShow: {
    type: Boolean,
    default: true
  }
} as const

export const gridItemPropKeys = keysOf(gridItemProps)

export type GridItemProps = ExtractPublicPropTypes<typeof gridItemProps>

export default defineComponent({
  __GRID_ITEM__: true,
  name: "GridItem",
  props: gridItemProps,
  setup(props, { attrs: { blankSpan } }) {
    const {
      xGapRef
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } = inject(gridInjectionKey)!
    const self = getCurrentInstance()

    // Here is quite a hack, I hope there is a better way to solve it
    const {
      privateSpan
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } = self!.vnode.props as GridItemVNodeProps
    const { value: xGap } = xGapRef

    const mergedXGap = pxfy(xGap || 0)
    const mergedBlankSpan: number = (blankSpan as number) || 0
    let marginRight = ''
    let mergedPrivateSpan

    if (privateSpan) {
      mergedPrivateSpan = privateSpan + mergedBlankSpan
       marginRight = blankSpan
      ? `calc((100% - (${mergedPrivateSpan} - 1) * ${mergedXGap}) / ${mergedPrivateSpan} * ${mergedBlankSpan} + ${mergedXGap} * ${mergedBlankSpan})`
      : ""
    }


    return {
      styles: {
        marginRight
      },
      mergeProps: {
        ...props,
        privateSpan: mergedPrivateSpan
      }
    }
  },

  render() {
    return (
      <NGridItem style={this.styles} {...this.mergeProps}>
        {this.$slots.default?.()}
      </NGridItem>
    )
  }
})
