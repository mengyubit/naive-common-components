# 一个好用的新手引导组件


## 基础用法

```vue
<div>
  <div  class="test">
    <div class="start">
     点击 start guide 按钮开始吧 ！
     <n-button @click="startGuide" type="info" ghost>start guide</n-button>
    </div>
    <n-button id="guide__create-component" type="primary" ghost>test button</n-button>
  </div>
  <v-tour ref="tourRef" name="myTour" :steps="steps"></v-tour>
</div>

<script lang="ts" setup>
import { NButton } from 'naive-ui';
import { VTour, StepStatus, IStep } from "@naive-ui-common/guide"
import { onMounted, ref } from 'vue'
import arrowUrl from "../assets/arrow.svg"
import '@naive-ui-common/guide/dist/lib/style.css'

const indexStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
  background: "#E2EEFF",
  borderRadius: "14px",
  marginRight: "16px"
}


const dialogStyle = {
  lineHeight: "28px",
  width: "443px",
  height: "172px",
  color: "#333",
  fontWeight: 500,
  padding: "20px 40px 20px 20px",
  fontSize: "20px"
}

const basicStepConfig = {
  confirmText: "Next",
  cancelText: "Skip",
  dialogStyle: dialogStyle,
  confirmButtonProps: {
    quaternary: true,
    strong: true,
    themeOverrides: {
      paddingMedium: "0 12px"
    }
  },

  cancelButtonProps: {
    quaternary: true,
    strong: true,
    themeOverrides: {
      paddingMedium: "0 12px",
      textColor: "#999"
    }
  },

  arrowImageUrl: arrowUrl,
  arrowImageStyle: {
    width: "146px",
    height: "156px"
  },
  arrowExtraInfo: {
    offsetX: 8,
    offsetY: 16
  }
}

const steps: IStep[] = [
  {
    ...basicStepConfig,
    arrowDirection: "RIGHT_TOP",
    target: "#guide__create-component",

    content: `if you want to deploy a backend service, please create at least one component here.`
  },
  {
    ...basicStepConfig,
    arrowDirection: "RIGHT_BOTTOM",
    target: "#guide__create-component",
    cancelText: 'Prev',
    cancelAction: () => Promise.resolve('PREV'),
    content: `if you want to deploy a backend service, please create at least one component here.`
  },
  {
    ...basicStepConfig,
    arrowDirection: "LEFT_BOTTOM",
    target: "#guide__create-component",

    content: `if you want to deploy a backend service, please create at least one component here.`
    
  },
  {
    ...basicStepConfig,
    arrowDirection: "LEFT_TOP",
    target: "#guide__create-component",

    content: `if you want to deploy a backend service, please create at least one component here.`,
    showCancelBtn: false,
    confirmText: 'Finish'
  },
]

const tourRef = ref()

const startGuide = () => {
  tourRef.value.start()
}
</script>

<style scoped lang="scss">

.test {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 100%;
  background: #eee;
   .start {
    position: absolute;
    top: 20px;
    left: 20px;
  }
}
</style>
```

## Attributes

| 参数    | 说明   | 类型      | 可选值                                             | 默认值  |
| ------- | ------ | ------- | ------------------------------------------------  | ------- |
| target  | 目标选择器名称 | string| — | body |
| renderTarget | 手动渲染目标 | string  |— | 空 |
| targetStyle | 目标样式 | CSSProperties | — | 空   |
| targetInnerStyle | 目标内部样式 | CSSProperties |  — | 空|
| header | header内容 | string  | VNode |空|
| content | content内容 | string  | VNode|空|
| confirmText | confirmText内容 | string | — |Confirm|
| cancelText | cancelText内容 | string   | — | Skip|
| footerStyle | footerStyle |  CSSProperties |— |空|
| cancelButtonProps | cancelButtonProps |  ButtonProps |— |  空|
| confirmButtonProps | confirmButtonProps |  ButtonProps |— |  空|
| showConfirmBtn | showConfirmBtn |  boolean |— |  true|
| showCancelBtn | showCancelBtn |  boolean |— |  true|
| arrowImageUrl | arrowImageUrl |  string |— |  空|
| arrowDirection | arrowDirection |  string |— |   "RIGHT_TOP"|
| arrowExtraInfo | arrowExtraInfo |  {} |— |  空|
| dialogStyle | dialogStyle |  CSSProperties|—  |  空|
| confirmAction | confirmAction |  Function |— | () => Promise.resolve('NEXT')|
| cancelAction | cancelAction |  Function|—  |  () => Promise.resolve('SKIP')|
| beforeAction | beforeAction |  Function |— |  空|
| afterAction | afterAction |  Function|— |  空|


