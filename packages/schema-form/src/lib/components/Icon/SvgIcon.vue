<template>
  <div :class="getClass" :style="getStyle">
    <n-icon :class="getClassSvg" :style="getStyle" :size="iconConfig?.size || props.size">
      <DynamicIcon :showTooltip="iconConfig?.showTooltip" :name="props.name" :icon="iconConfig?.icon || ICON_CONFIG_MAP[props.name]"></DynamicIcon>
    </n-icon>
  </div>
</template>
<script lang="tsx" setup>
import { CSSProperties } from 'vue';
import { computed, withDefaults, useAttrs } from 'vue';
import { PopoverProps } from 'naive-ui';
import DynamicIcon from './DynamicIcon';
import { useIconConfigContext } from '../../hooks/useFormContext';
import { ICON_CONFIG_MAP } from './default-icon-config'

export interface ISvgProps {
  prefix?: string;
  name: string;
  size?: number | string;
  spin?: boolean;
  color?: string;
  disabled?: boolean;
  disableColor?: string;
  popover?: PopoverProps & { text: string };
  closePointer?: boolean;
  transform?: string;
}
const iconStyleConfig = useIconConfigContext()

const props = withDefaults(defineProps<ISvgProps>(), {
  prefix: 'icon',
  size: 24,
  spin: false,
  color: '#999',
  disableColor: '#D7DAE0',
  disabled: false,
  popover: undefined,
  closePointer: false,
  transform: '',
});
const attrs = useAttrs();

const iconConfig = computed(() => iconStyleConfig.find((item) => item.name === props.name))
const iconColorRef = computed(() => {
  const { disableColor = props.disableColor , color =props.color } = iconConfig.value || {}
  return props.disabled ? disableColor :color
});
const iconConfigHover = computed(() => iconConfig.value?.hoverColor || iconColorRef.value)

const getStyle = computed((): CSSProperties => {
  const { disabled, closePointer } = props;
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
  &:hover {
    color: v-bind(iconConfigHover);
  }

  &__svg {
    display: inline-block;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentColor;
  }
}

.svg-icon-spin {
  animation: loadingCircle 1s infinite linear;
}
</style>
