<script lang="ts" setup>
import { useForm, BasicForm } from '../../lib/index';
import { formSchema } from './schema'

const [registerForm, { submit }] = useForm({
  schemas: formSchema,
  itemStyle: {
    "--n-blank-height": "30px",
    "--n-label-text-color": "#333",
    "--n-label-font-size": "16px",
    "--n-label-padding": "0 0 8px 0",
    "--n-label-height": "26px"
  }
})

const handleClick = async () => {
  const fromData = await submit()
  console.log({fromData})
}

const rowProps = {
  xGap: 20,
  yGap: 0 ,
  style: {
    gridTemplateColumns: '100px repeat(12, 1fr) 100px repeat(24, 1fr)'
  }
}
</script>
<template>
  <BasicForm @register="registerForm" :row-props="rowProps" style="width: 800px"/>
  <div>
      <n-button type="primary" class="ml-24px w-100px" @click="handleClick"
        >Save</n-button
      >
    </div>
</template>

<style lang="scss" scoped>
</style>
