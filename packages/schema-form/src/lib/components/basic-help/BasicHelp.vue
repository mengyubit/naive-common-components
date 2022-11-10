<script lang="tsx" setup>
import { computed, unref, withDefaults, VNode } from 'vue'
import { NPopover, useThemeVars } from "naive-ui"
import type { PopoverProps } from "naive-ui"
import { isString } from "../../utils"
import { useProjectSettingsContext } from "../../hooks/useProjectSettings"

type PickProps<T, P> = P extends keyof T ? T[P] : never
const props = withDefaults(defineProps<{
  maxWidth?:number,
  showIndex?: boolean
  color?: string
  backgroundColor?:string
  fontSize?: string
  placement?: PickProps<Pick<PopoverProps, 'placement'>, 'placement'>
  text?: string[] | string
  x?:number | string,
  y?:number | string,
  transform?:string,
  right?:string
  left?:string
}>(), {
  showIndex: false,
  color: '#fff',
  fontSize: '14px',
  placement: 'top',
  backgroundColor: '#333',
  x: undefined,
  y: undefined,
  transform: ''
})
const useThemeVar = useThemeVars()
const primaryColor = unref(useThemeVar).primaryColor
const prefixCls = 'basic-help'
const getTooltipStyle = computed(() => ({ '--color': props.backgroundColor, color: props.color, fontSize: props.fontSize, transform: props.transform, right: props.right}))
const yBind = computed(() => props.y ?? '1px')
const xBind = computed(() => props.x ?? '-7px')
const textList = computed(()=>{
  const { text } = unref(props)
  if(isString(text)) {
    return [text]
  }else return text
})
</script>

<template>
  <n-popover
    :placement="placement"
    trigger="hover"
    :style="getTooltipStyle"
    :width="maxWidth"
  >
    <template #trigger>
      <span :class="`${prefixCls}`">
        <slot v-if="$slots.default"></slot>
        <SvgIcon
          color="#999"
          hover-color="#3F8DFD"
          name="help"
          size="16"
        ></SvgIcon>
      </span>
    </template>
    <div>
      <slot name="content">
        <template v-for="item in textList" :key="item.index">
          <div>
            {{ item }}
          </div>
        </template>
      </slot>
    </div>
  </n-popover>
</template>

<style lang="scss">
$prefix-cls: basic-help;

.#{$prefix-cls} {
  position: absolute;
  top: v-bind(yBind);
  right: v-bind(xBind);
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  transform: translate(0, -50%);

  &:hover {
    color: v-bind(primaryColor);
  }

  &__wrap {
    p {
      margin-bottom: 0;
    }
  }
}
</style>
