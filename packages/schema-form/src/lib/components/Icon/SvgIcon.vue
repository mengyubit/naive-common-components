<template>
  <n-popover v-if="getPopover" v-bind="getPopover" :style="getPopoverStyle">
    <template #trigger>
      <div :class="getClass" :style="getStyle">
        <n-icon :class="getClassSvg" :style="getStyle" size="24" class="hover-naivecolor">
          <AddIcon v-if="props.name === 'add'" />
          <RemoveIcon v-if="props.name === 'remove'" />
          <HelpIcon v-if="props.name === 'help'" />
          <ExpendIcon v-if="props.name === 'expend'"/>
        </n-icon>
      </div>
    </template>
    <div>
      <slot name="content">
        <template v-for="item in textList" :key="item.index">
          <p>
            {{ item }}
          </p>
        </template>
      </slot>
    </div>
  </n-popover>
  <div v-else :class="getClass" :style="getStyle">
    <n-icon :class="getClassSvg" :style="getStyle" size="24" class="hover-naivecolor">
      <n-tooltip v-if="props.name === 'add'">
        <template #trigger> <AddIcon /> </template>
        Add
      </n-tooltip>
      <n-tooltip v-if="props.name === 'remove'">
        <template #trigger> <RemoveIcon /> </template>
        Delete
      </n-tooltip>
      <n-tooltip v-if="props.name === 'help'">
        <template #trigger> <HelpIcon /> </template>
      </n-tooltip>
      <n-tooltip v-if="props.name === 'expend'">
        <template #trigger> <ExpendIcon /> </template>
      </n-tooltip>
    </n-icon>
  </div>
</template>
<script lang="tsx" setup>
import { CSSProperties, toRefs } from 'vue';
import { computed, unref, withDefaults, useAttrs } from 'vue';
import { PopoverProps, useThemeVars } from 'naive-ui';
import AddIcon from './add.vue';
import RemoveIcon from './remove.vue';
import HelpIcon from './help-svg.vue'
import ExpendIcon from './expend.vue';
import { isString } from '../../utils';

export interface ISvgProps {
  prefix?: string;
  name: string;
  size?: number | string;
  spin?: boolean;
  color?: string;
  disabled?: boolean;
  popover?: PopoverProps & { text: string };
  closePointer?: boolean;
  transform?: string;
}
const useThemeVar = useThemeVars()
const primaryColor = unref(useThemeVar).primaryColor

const props = withDefaults(defineProps<ISvgProps>(), {
  prefix: 'icon',
  size: 16,
  spin: false,
  color: '#ccc',
  disabled: false,
  popover: undefined,
  closePointer: false,
  transform: ''
});
const attrs = useAttrs();
const symbolId = computed(() => `#${props.prefix}-${props.name}`);
const iconColorRef = computed(() => {
  if (props.disabled) {
    return '#D7DAE0';
  } else {
    return unref(props.color) || '#ccc';
  }
});

const getStyle = computed((): CSSProperties => {
  const { size, disabled, closePointer } = props;
  return {
    cursor: disabled ? 'not-allowed' : !closePointer ? 'pointer' : 'default'
  };
});
const getClassSvg = computed(() => {
  return ['svg-icon__svg', props.spin && 'svg-icon-spin'];
});
const getClass = computed(() => {
  return ['svg-icon', attrs.class];
});
const getPopoverStyle = computed(() => {
  return {
    '--color': '#333',
    color: '#fff',
    fontSize: '14px',
    transform: props.transform
  };
});

const textList = computed(() => {
  const { text } = unref(props.popover);
  if (isString(text)) {
    return [text];
  } else return text;
});
const getPopover = computed(() => {
  if (!props.popover) return false;

  return {
    trigger: 'hover',
    ...toRefs(props.popover)
  };
});
</script>
<style lang="scss" scoped>
::v-deep(.n-icon) {
  svg {
    &:focus {
      outline: none !important;
    }
  }
}

.svg-icon {
  display: flex;
  align-items: center;
  color: v-bind(iconColorRef);

  &__svg {
    display: inline-block;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentColor;
  }

  &-svg__hover:hover {
    color: red;
    fill: v-bind(primaryColor);
  }
}

.svg-icon-spin {
  animation: loadingCircle 1s infinite linear;
}
</style>
