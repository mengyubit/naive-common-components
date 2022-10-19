<template>
  <div  class="fffff">
    <n-button id="guide__create-component">test button</n-button>
  </div>
  <v-tour ref="tourRef" name="myTour" :steps="steps"></v-tour>
</template>

<script lang="ts" setup>
import { NButton } from 'naive-ui';
import './index.scss'

import VTour from "./lib/components/VTour.vue"
import { onMounted, ref } from 'vue'
import { steps } from './config'
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