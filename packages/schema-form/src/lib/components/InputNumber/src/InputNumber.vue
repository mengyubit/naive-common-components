<template>
  <div :class="`${mergedClsPrefix}-input-number`">
    <NInput
      ref="inputInstRef"
      :style="getInputStyle"
      :bordered="mergedBordered"
      :loading="loading"
      :value="displayedValue"
      :on-update-value="handleUpdateDisplayedValue"
      :builtin-theme-overrides="inputThemeOverrides"
      :size="mergedSize"
      :placeholder="mergedPlaceholder"
      :disabled="mergedDisabled"
      :readonly="readonly"
      :text-decoration="displayedValueInvalid ? 'line-through' : undefined"
      :clearable="clearable"
      internal-loading-before-suffix
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeyDown"
      @mousedown="handleMouseDown"
      @clear="handleClear"
    >
      <template #prefix>
        <NButton
          text
          :disabled="!minusable || mergedDisabled || readonly"
          :focusable="false"
          :builtin-theme-overrides="buttonThemeOverrides"
          :style="{
            '--n-text-color-pressed': primaryColor
          }"
          @click="handleMinusClick"
        >
          <NBaseIcon
            :cls-prefix="mergedClsPrefix"
            :style="`--n-icon-size: ${suffixesStyles.suffixesIconSize}`"
          >
            <RemoveIcon />
          </NBaseIcon>
        </NButton>
      </template>
      <template #suffix>
        <NButton
          text
          :disabled="!addable || mergedDisabled || readonly"
          :focusable="false"
          :builtin-theme-overrides="buttonThemeOverrides"
          :style="{
            '--n-text-color-pressed': primaryColor
          }"
          @click="handleAddClick"
        >
          <NBaseIcon
            :cls-prefix="mergedClsPrefix"
            :style="`--n-icon-size: ${suffixesStyles.suffixesIconSize}`"
          >
            <AddIcon />
          </NBaseIcon>
        </NButton>
      </template>
    </NInput>
  </div>
</template>

<script lang="tsx">
import { defineComponent, ref, toRef, watch, computed, PropType, DefineComponent } from 'vue';
import { rgba } from 'seemly';
import { useMemo, useMergedState } from 'vooks';
import { NInput, NButton, InputInst, useThemeVars, NInputNumber } from 'naive-ui';
import { parse, validator, format, parseNumber, isWipValue } from './utils';
import type { OnUpdateValue, InputNumberInst } from './interface';
import { call, ExtractPublicPropTypes, MaybeArray } from 'naive-ui/lib/_utils';
import { ThemeProps, useConfig, useFormItem, useLocale, useTheme } from 'naive-ui/lib/_mixins';
import { InputNumberTheme } from 'naive-ui/lib/input-number/styles';
import RemoveIcon from './remove.vue';
import AddIcon from './add.vue';
import { DefaultInputNumberConfig } from '../input-number.config';
import { NBaseIcon } from 'naive-ui/lib/_internal';
import { inputLight } from 'naive-ui/lib/input/styles';
import style from './styles/input-number.cssr';


const inputNumberProps = {
  ...(useTheme.props as ThemeProps<InputNumberTheme>),
  loading: {
    type: Boolean,
    default: undefined
  },
  placeholder: String,
  defaultValue: {
    type: Number as PropType<number | null>,
    default: null
  },
  value: Number as PropType<number | null>,
  step: {
    type: [Number, String],
    default: 1
  },
  min: [Number, String],
  max: [Number, String],
  size: String as PropType<'small' | 'medium' | 'large'>,
  disabled: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined
  },
  validator: Function as PropType<(value: number) => boolean>,
  bordered: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined
  },
  showButton: {
    type: Boolean,
    default: true
  },
  readonly: Boolean,
  clearable: Boolean,
  keyboard: {
    type: Object as PropType<{
      ArrowUp?: boolean;
      ArrowDown?: boolean;
    }>,
    default: {}
  },
  updateValueOnInput: {
    type: Boolean,
    default: true
  },
  'onUpdate:value': [Function, Array] as PropType<MaybeArray<OnUpdateValue>>,
  onUpdateValue: [Function, Array] as PropType<MaybeArray<OnUpdateValue>>,
  onFocus: [Function, Array] as PropType<MaybeArray<(e: FocusEvent) => void>>,
  onBlur: [Function, Array] as PropType<MaybeArray<(e: FocusEvent) => void>>,
  onClear: [Function, Array] as PropType<MaybeArray<(e: MouseEvent) => void>>,
  // deprecated
  onChange: {
    type: [Function, Array] as PropType<MaybeArray<OnUpdateValue> | undefined>,
    validator: () => {
      return true;
    },
    default: undefined
  }
};

export type InputNumberProps = ExtractPublicPropTypes<typeof inputNumberProps>;

const IInputNumber: InstanceType<typeof NInputNumber>['$props'] =  defineComponent({
  name: 'IInputNumber',
  components: {
    RemoveIcon,
    AddIcon,
    NButton,
    NInput,
    NBaseIcon
  },
  props: inputNumberProps,
  setup(props: any) {

    const { mergedBorderedRef, mergedClsPrefixRef } = useConfig(props);
    const useThemeVar = useThemeVars()
    const themeRef = useTheme(
      'InputNumber',
      'InputNumber',
      style,
      inputLight,
      props,
      mergedClsPrefixRef
    );

    const { localeRef } = useLocale('InputNumber');
    const formItem = useFormItem(props);

    const { mergedSizeRef, mergedDisabledRef, mergedStatusRef } = formItem;

    // dom ref
    const inputInstRef = ref<InputInst | null>(null);
    const minusButtonInstRef = ref<{ $el: HTMLElement } | null>(null);
    const addButtonInstRef = ref<{ $el: HTMLElement } | null>(null);
    // value
    const uncontrolledValueRef = ref(props.defaultValue);
    const controlledValueRef = toRef(props, 'value');
    const mergedValueRef = useMergedState(controlledValueRef, uncontrolledValueRef);
    const displayedValueRef = ref('');
    const getMaxPrecision = (currentValue: number): number => {
      const precisions = [props.min, props.max, props.step, currentValue].map((item) => {
        const fraction = String(item).split('.')[1];
        return fraction ? fraction.length : 0;
      });
      return Math.max(...precisions);
    };
    const mergedPlaceholderRef = useMemo(() => {
      const { placeholder } = props;
      if (placeholder !== undefined) return placeholder;
      return localeRef.value.placeholder;
    });
    const mergedStepRef = useMemo(() => {
      const parsedNumber = parseNumber(props.step);
      if (parsedNumber !== null) {
        return parsedNumber === 0 ? 1 : Math.abs(parsedNumber);
      }
      return 1;
    });
    const mergedMinRef = useMemo(() => {
      const parsedNumber = parseNumber(props.min);
      if (parsedNumber !== null) return parsedNumber;
      else return null;
    });
    const mergedMaxRef = useMemo(() => {
      const parsedNumber = parseNumber(props.max);
      if (parsedNumber !== null) return parsedNumber;
      else return null;
    });
    const doUpdateValue = (value: number | null): void => {
      const { value: mergedValue } = mergedValueRef;
      if (value === mergedValue) {
        deriveDisplayedValueFromValue();
        return;
      }
      const { 'onUpdate:value': _onUpdateValue, onUpdateValue, onChange } = props;
      const { nTriggerFormInput, nTriggerFormChange } = formItem;
      if (onChange) call(onChange, value);
      if (onUpdateValue) call(onUpdateValue, value);
      if (_onUpdateValue) call(_onUpdateValue, value);
      uncontrolledValueRef.value = value;
      nTriggerFormInput();
      nTriggerFormChange();
    };
    const deriveValueFromDisplayedValue = (
      offset = 0,
      doUpdateIfValid = true,
      isInputing = false
    ): null | number | false => {
      const { value: displayedValue } = displayedValueRef;
      if (isInputing && isWipValue(displayedValue)) {
        return false;
      }
      const parsedValue = parse(displayedValue);
      if (parsedValue === null) {
        if (doUpdateIfValid) doUpdateValue(null);
        return null;
      }
      if (validator(parsedValue)) {
        const precision = getMaxPrecision(parsedValue);
        let nextValue = parseFloat((parsedValue + offset).toFixed(precision));
        if (validator(nextValue)) {
          const { value: mergedMax } = mergedMaxRef;
          const { value: mergedMin } = mergedMinRef;
          if (mergedMax !== null && nextValue > mergedMax) {
            if (!doUpdateIfValid || isInputing) return false;
            // if doUpdateIfValid=true, we try to make it a valid value
            nextValue = mergedMax;
          }
          if (mergedMin !== null && nextValue < mergedMin) {
            if (!doUpdateIfValid || isInputing) return false;
            // if doUpdateIfValid=true, we try to make it a valid value
            nextValue = mergedMin;
          }
          if (props.validator && !props.validator(nextValue)) return false;
          if (doUpdateIfValid) doUpdateValue(nextValue);
          return nextValue;
        }
      }
      return false;
    };
    const deriveDisplayedValueFromValue = (): void => {
      const { value: mergedValue } = mergedValueRef as any;
      if (validator(mergedValue)) {
        displayedValueRef.value = format(mergedValue);
      } else {
        // null can pass the validator check
        // so mergedValue is a number
        displayedValueRef.value = String(mergedValue as number);
      }
    };
    deriveDisplayedValueFromValue();
    const displayedValueInvalidRef = useMemo(() => {
      const derivedValue = deriveValueFromDisplayedValue(0, false);
      return derivedValue === false;
    });
    const minusableRef = useMemo(() => {
      const { value: mergedValue } = mergedValueRef;
      if (props.validator && mergedValue === null) {
        return false;
      }
      const { value: mergedStep } = mergedStepRef;
      const derivedNextValue = deriveValueFromDisplayedValue(-mergedStep, false);
      return derivedNextValue !== false;
    });
    const addableRef = useMemo(() => {
      const { value: mergedValue } = mergedValueRef;
      if (props.validator && mergedValue === null) {
        return false;
      }
      const { value: mergedStep } = mergedStepRef;
      const derivedNextValue = deriveValueFromDisplayedValue(+mergedStep, false);
      return derivedNextValue !== false;
    });
    function doFocus(e: FocusEvent): void {
      const { onFocus } = props;
      const { nTriggerFormFocus } = formItem;
      if (onFocus) call(onFocus, e);
      nTriggerFormFocus();
    }
    function doBlur(e: FocusEvent): void {
      if (e.target === inputInstRef.value?.wrapperElRef) {
        // hit input wrapper
        // which means not activated
        return;
      }
      const value = deriveValueFromDisplayedValue();
      // If valid, update event has been emitted
      // make sure e.target.value is correct in blur callback
      if (value !== false) {
        const inputElRef = inputInstRef.value?.inputElRef;
        if (inputElRef) {
          inputElRef.value = String(value || '');
        }
        // If value is not changed, the displayed value may be greater than or
        // less than the current value. The derived value is reformatted so the
        // value is not changed. We can simply derive a new displayed value
        if (mergedValueRef.value === value) {
          deriveDisplayedValueFromValue();
        }
      } else {
        // If not valid, nothing will be emitted, so derive displayed value from
        // origin value
        deriveDisplayedValueFromValue();
      }
      const { onBlur } = props;

      const { nTriggerFormBlur, mergedStatusRef } = formItem;
      if (onBlur) call(onBlur, e);


      nTriggerFormBlur();
    }
    function doClear(e: MouseEvent): void {
      const { onClear } = props;
      if (onClear) call(onClear, e);
    }
    function doAdd(): void {
      const { value: addable } = addableRef;
      if (!addable) return;
      const { value: mergedValue } = mergedValueRef;
      if (mergedValue === null) {
        if (!props.validator) {
          doUpdateValue(createValidValue() as number);
        }
      } else {
        const { value: mergedStep } = mergedStepRef;
        deriveValueFromDisplayedValue(mergedStep);
      }
    }
    function doMinus(): void {
      const { value: minusable } = minusableRef;
      if (!minusable) return;
      const { value: mergedValue } = mergedValueRef;
      if (mergedValue === null) {
        if (!props.validator) {
          doUpdateValue(createValidValue() as number);
        }
      } else {
        const { value: mergedStep } = mergedStepRef;
        deriveValueFromDisplayedValue(-mergedStep);
      }
    }
    const handleFocus = doFocus;
    const handleBlur = doBlur;
    function createValidValue(): number | null {
      if (props.validator) return null;
      const { value: mergedMin } = mergedMinRef;
      const { value: mergedMax } = mergedMaxRef;
      if (mergedMin !== null) {
        return Math.max(0, mergedMin);
      } else if (mergedMax !== null) {
        return Math.min(0, mergedMax);
      } else {
        return 0;
      }
    }
    function handleClear(e: MouseEvent): void {
      doClear(e);
      doUpdateValue(null);
    }
    function handleMouseDown(e: MouseEvent): void {
      if (addButtonInstRef.value?.$el.contains(e.target as Node)) {
        e.preventDefault();
      }
      if (minusButtonInstRef.value?.$el.contains(e.target as Node)) {
        e.preventDefault();
      }
      inputInstRef.value?.activate();
    }
    const handleAddClick = doAdd;
    const handleMinusClick = doMinus;
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        if (e.target === inputInstRef.value?.wrapperElRef) {
          // hit input wrapper
          // which means not activated
          return;
        }
        const value = deriveValueFromDisplayedValue();
        if (value !== false) {
          inputInstRef.value?.deactivate();
        }
      } else if (e.code === 'ArrowUp') {
        if (props.keyboard.ArrowUp === false) return;
        e.preventDefault();
        const value = deriveValueFromDisplayedValue();
        if (value !== false) {
          doAdd();
        }
      } else if (e.code === 'ArrowDown') {
        if (props.keyboard.ArrowDown === false) return;
        e.preventDefault();
        const value = deriveValueFromDisplayedValue();
        if (value !== false) {
          doMinus();
        }
      }
    }
    function handleUpdateDisplayedValue(value: string): void {
      displayedValueRef.value = value;
      if (props.updateValueOnInput) {
        deriveValueFromDisplayedValue(0, true, true);
      }
    }
    watch(mergedValueRef, () => {
      deriveDisplayedValueFromValue();
    });
    const exposedMethods: InputNumberInst = {
      focus: () => inputInstRef.value?.focus(),
      blur: () => inputInstRef.value?.blur()
    };

    const suffixesStyles = computed(() => {
      const styles = {
        suffixesPadding: '',
        suffixesBorderRadius: '',
        suffixesIconSize: '',
        suffixesHeight: ''
      };
      if (props.size === 'large') {
        styles.suffixesPadding = DefaultInputNumberConfig.iconPaddingLarge;
        styles.suffixesIconSize = DefaultInputNumberConfig.iconLargeSize;
        styles.suffixesHeight = DefaultInputNumberConfig.largeHeight;
      } else if (props.size === 'small') {
        styles.suffixesPadding = DefaultInputNumberConfig.iconPaddingSmall;
        styles.suffixesIconSize = DefaultInputNumberConfig.iconSmallSize;
        styles.suffixesHeight = DefaultInputNumberConfig.smallHeight;
      } else {
        styles.suffixesPadding = DefaultInputNumberConfig.iconPaddingMedium;
        styles.suffixesIconSize = DefaultInputNumberConfig.iconMediumSize;
        styles.suffixesHeight = DefaultInputNumberConfig.mediumHeight;
      }
      return styles;
    });

    const getInputStyle = computed(() => {
      return `--n-padding-right: 0; --n-padding-left: 0;--n-height:${suffixesStyles.value.suffixesHeight}; --n-border: none;`;
    });

    const suffixesPadding = computed(() => suffixesStyles.value.suffixesPadding);

    const suffixesBorderRadius = computed(() => themeRef.value.self.borderRadius);

    const suffixesBackground = DefaultInputNumberConfig.iconBackgroundColor;

    const validate = async (call) => {
      try {

        await (inputInstRef.value as any)?.validator(call)
      } catch (err) {
        console.log(err)
      }
    }
    const stateBorderStyleRef = computed(()=>{
      if(mergedStatusRef.value === 'error') return '1px solid #D92149'
      else if(mergedStatusRef.value === 'success') return '1px solid #FFAC26'
      else return ''
    })

    return {
      ...exposedMethods,
      inputInstRef,
      minusButtonInstRef,
      addButtonInstRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedBordered: mergedBorderedRef,
      uncontrolledValue: uncontrolledValueRef,
      mergedValue: mergedValueRef,
      mergedPlaceholder: mergedPlaceholderRef,
      displayedValueInvalid: displayedValueInvalidRef,
      mergedSize: mergedSizeRef,
      mergedDisabled: mergedDisabledRef,
      displayedValue: displayedValueRef,
      addable: addableRef,
      minusable: minusableRef,
      primaryColor: unref(useThemeVar).primaryColor,
      handleFocus,
      handleBlur,
      handleClear,
      handleMouseDown,
      handleAddClick,
      handleMinusClick,
      handleKeyDown,
      handleUpdateDisplayedValue,
      validate,
      // theme
      inputThemeOverrides: {
        paddingSmall: '0 8px 0 10px',
        paddingMedium: '0 8px 0 12px',
        paddingLarge: '0 8px 0 14px'
      },
      buttonThemeOverrides: computed(() => {
        const [r, g, b, a] = rgba('#ccc');
        return {
          textColorTextDisabled: `rgb(${r}, ${g}, ${b})`,
          opacityDisabled: `${a}`
        };
      }),
      getInputStyle,
      suffixesStyles,
      suffixesPadding,
      suffixesBorderRadius,
      suffixesBackground,
      stateBorderStyle:stateBorderStyleRef
    };
  }
});

export default IInputNumber
</script>

<style scoped lang="scss">
::v-deep(.n-input .n-input__suffix),
::v-deep(.n-input .n-input__prefix) {
  padding: v-bind(suffixesPadding);
  background: v-bind(suffixesBackground);
}

::v-deep(.n-input .n-input__prefix) {
  border-radius: v-bind(suffixesBorderRadius) 0 0 v-bind(suffixesBorderRadius);
}

::v-deep(.n-input .n-input__state-border) {
  border: v-bind(stateBorderStyle);
}

::v-deep(.n-input .n-input__suffix) {
  border-radius: 0 v-bind(suffixesBorderRadius) v-bind(suffixesBorderRadius) 0;
}

::v-deep(.n-input .n-input__input-el) {
  text-align: center;

  &::placeholder {
    color: #ccc;
    text-align: center;
  }
}

::v-deep(.n-input:not(.n-input--textarea) .n-input__placeholder) {
  display: none;
}
</style>
