# Button 按钮

常用的操作按钮。

## 基础用法

基础的按钮用法。

```vue
<template>
  <div  class="fffff">
    <n-button id="guide__create-component">test button</n-button>
  </div>
  <v-tour ref="tourRef" name="myTour" :steps="steps"></v-tour>
</template>

<script lang="ts" setup>
import { NButton } from 'naive-ui';

import { VTour, StepStatus } from "@naive-ui-common/guide"
import { onMounted, ref } from 'vue'
import { steps } from '../demo/config'
const tourRef = ref()

onMounted(() => {
  tourRef.value.start()
})
</script>

<style scoped>
.fffff {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}
</style>
```


## Attributes

| 参数    | 说明   | 类型      | 可选值                                             | 默认值  |
| ------- | ------ | ------- | ------------------------------------------------  | ------- |
| target  | 目标选择器名称 | string                                                | body |
| renderTarget | 手动渲染目标   |         —                                        | 空 |
| targetStyle | 目标样式 | CSSProperties | —                                      | 空   |
| targetInnerStyle | 目标内部样式 | CSSProperties |  — | 空|
| header | header内容 | string  | VNode                                          |空|
| content | content内容 | string  | VNode                                          |空|
| confirmText | confirmText内容 | string                                            |confirm|
| cancelText | cancelText内容 | string                                            |skip|
| footerStyle | footerStyle |  CSSProperties |空|
| cancelButtonProps | cancelButtonProps |  ButtonProps |  空|
| confirmButtonProps | confirmButtonProps |  ButtonProps |  空|
| showConfirmBtn | showConfirmBtn |  boolean |  true|
| showCancelBtn | showCancelBtn |  boolean |  true|
| arrowImageUrl | arrowImageUrl |  string |  空|
| arrowDirection | arrowDirection |  ArrowDirection |  空|
| arrowExtraInfo | arrowExtraInfo |  {} |  空|
| dialogStyle | dialogStyle |  CSSProperties |  空|
| confirmAction | confirmAction |  Function| () => Promise.resolve('Next')|
| cancelAction | cancelAction |  Function|  () => Promise.resolve('Skip')|
| beforeAction | beforeAction |  Function |  空|
| afterAction | afterAction |  Function |  空|
