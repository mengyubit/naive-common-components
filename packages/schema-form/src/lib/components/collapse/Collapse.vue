<script lang="ts" setup>
import { CSSProperties } from "vue"
import UpAlertImg from "../../assets/up-alert.png"
import SvgIcon from "../Icon/SvgIcon.vue"

const props = withDefaults(
  defineProps<{
    name?: string
    contentHeight?: string
    expend?: boolean
    headerStyle?: CSSProperties
    collapse?: boolean
    advanced?: boolean
  }>(),
  {
    collapse: true,
    expend: true
  }
)

const emits = defineEmits(["expend"])

const prefixCls  = "expend"
const expendRef = ref(props.expend || false)
const itemheight = ref(props.expend ? "" : "0")

watch(
  () => props.expend,
  () => {
    handleExpand()
  }
)

const getImageStyle = computed(() => {
  return {
    transform: expendRef.value ? "rotate(0deg)" : "rotate(90deg)",
    transition: "all .4s"
  }
})
async function handleExpand() {
  expendRef.value = !expendRef.value
  if (expendRef.value) {
    itemheight.value = ""
    emits("expend")
  } else itemheight.value = "0"
}
const expendedName = computed(() => {
  return expendRef.value ? ["expend"] : []
})

defineExpose({
  expend: expendRef
})
</script>
<template>
  <div v-bind="$attrs" :class="`${prefixCls}`">
    <n-collapse :expanded-names="expendedName">
      <template #arrow>
        <div :class="`${prefixCls}-header`" :style="headerStyle">
          <div
            v-if="collapse"
            :style="getImageStyle"
            :class="`${prefixCls}-icon`"
            @click="handleExpand"
          >
            <img v-if="advanced" :src="UpAlertImg" alt="" />
            <!-- <img v-else :src="UpImg" alt="" /> -->
            <SvgIcon v-else name="expend" size="24" />
          </div>
        </div>
      </template>
      <n-collapse-item :title="name">
        <template #header>
          <slot name="title">
            <div :class="`${prefixCls}-name`">
              {{ name }}
            </div>
          </slot>
        </template>
        <slot name="default"></slot> </n-collapse-item
    ></n-collapse>
    <!-- <n-collapse-transition :class="`${prefixCls}-content`" :show="expendRef">
      <slot></slot>
    </n-collapse-transition> -->
  </div>
</template>

<style lang="scss" scoped>
$class-prefix: expend;

.#{$class-prefix} {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  width: 100%;

  &-header {
    display: flex;
    align-items: center;
    width: 100%;
  }

  &-name {
    color: #333;
    font-size: 18px;
  }

  &-content {
    box-sizing: border-box;
    width: 100%;
  }

  &-icon {
    margin: 0 8px;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
}
</style>
