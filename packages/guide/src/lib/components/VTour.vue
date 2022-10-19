<template>
  <div v-if="isStart" class="v-tour">
    <VStep
      v-if="currentStepIndex !== -1"
      :key="currentStepIndex"
      :step="props.steps[currentStepIndex]"
      @confirm="confirmHandler"
      @cancel="cancelHandler"
    >
    </VStep>
  </div>
</template>

<script setup lang="ts">
import VStep from "./VStep"
import { IStep, StepStatus } from "../interface"
import "./tour.scss"

const currentStepIndex = ref(-1)
const pendingStep = ref()
const isStart = ref(false)
const props = defineProps<{
  steps: IStep[]
}>()

const startNextStepBeforeAction = async () => {
  const nextStepIndex = currentStepIndex.value + 1

  const { beforeAction } = props.steps[nextStepIndex]
  if (beforeAction) {
    await beforeAction()
  }

  currentStepIndex.value = nextStepIndex
}

const start = () => {
  isStart.value = true
  setTimeout(() => {
    startNextStepBeforeAction()
  }, 5000)
}

const stop = () => {
  isStart.value = false
  currentStepIndex.value = -1
}

const currentStep = computed(() => props.steps[currentStepIndex.value])

const confirmHandler = () => {
  ;(currentStep.value.confirmAction?.() || Promise.resolve("NEXT")).then(
    (res) => {
      return pendingStep.value[0](res)
    }
  )
}

const cancelHandler = () => {
  ;(currentStep.value.cancelAction?.() || Promise.resolve("SKIP")).then(
    (res: StepStatus) => {
      return pendingStep.value[0](res)
    }
  )
}

const waitingAction = () => {
  return new Promise((resolve) => {
    pendingStep.value = [resolve]
  })
}

watch(
  () => currentStepIndex.value,
  async (currentIndex) => {
    if (!isStart.value) {
      return
    }

    const stepStatus = await waitingAction()

    if (stepStatus === "SKIP") {
      stop()
      return
    }

    const { afterAction } = props.steps[currentIndex]

    if (afterAction) {
      await afterAction()
    }

    await nextTick()

    if (currentIndex + 1 === props.steps.length) {
      stop()
      return
    }

    // 开始下一步的before action
    await startNextStepBeforeAction()
  }
)

defineExpose({
  start,
  stop
})
</script>
