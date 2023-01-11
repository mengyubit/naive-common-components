import { NGrid } from "naive-ui"
import { ExtractPublicPropTypes } from "naive-ui/es/_utils"
import { CSSProperties } from "vue"

const defaultCols = 24
const gridProps = {
  style: {
    type: [Object, String] as PropType<CSSProperties | string>,
    default: {}
  },
  responsive: {
    type: [String, Boolean] as PropType<'self' | 'screen'>,
    default: 'self'
  },
  cols: {
    type: [Number, String] as PropType<number | string>,
    default: defaultCols
  },
  itemResponsive: Boolean,
  collapsed: Boolean,
  // may create grid rows < collapsedRows since a item may take all the row
  collapsedRows: {
    type: Number,
    default: 1
  },
  itemStyle: [Object, String] as PropType<CSSProperties | string>,
  xGap: {
    type: [Number, String] as PropType<number | string>,
    default: 0
  },
  yGap: {
    type: [Number, String] as PropType<number | string>,
    default: 0
  }
} as const


export type GridProps = ExtractPublicPropTypes<typeof gridProps>

export default defineComponent({
  name: "IGrid",
  props: gridProps,
  render() {
    return (
      <NGrid  {...this.$props} style={this.$props.style}>
        {this.$slots.default?.()}
      </NGrid>
    )
  }
})

