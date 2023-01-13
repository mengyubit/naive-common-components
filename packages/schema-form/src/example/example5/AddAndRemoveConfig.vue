<!-- add & remove按钮可配置化 demo -->

<script lang="ts" setup>
import { cloneDeep, set, get } from 'lodash-es';
import { onMounted, h } from 'vue';
import { useForm, BasicForm, IIconConfig } from '../../lib/index';
import { formSchema } from './schema'
import AddIcon from './addIcon.vue'
const [registerForm, { getCurrentSchema, getFormModal, appendSchemaByPath, submit, updateSchemaByPath }] = useForm({
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
}

const listenNameChange = () => {
  updateSchemaByPath({
    path: 'name',
    componentProps: {
      onUpdateValue: async (value) => {
       addItem()
      }
    }
  });
}

const addItem = async () => {
    const currentSchema = getCurrentSchema()
    const formModal = getFormModal()
    await appendSchemaByPath(cloneDeep(currentSchema[1]?.items?.[0] || []), 'basicSchema')
    const defaultValue = currentSchema[1]?.defaultValue || null
    const currentValue = get(formModal,'basicSchema')
    const res = currentValue.concat(defaultValue)
    set(formModal,'basicSchema', res )
}

const removeItem = async () => {
    const currentSchema = getCurrentSchema()
    const formModal = getFormModal()
    await appendSchemaByPath(cloneDeep(currentSchema[1]?.items?.[0] || []), 'basicSchema')
    const defaultValue = currentSchema[1]?.defaultValue || null
    const currentValue = get(formModal,'basicSchema')
    const res = currentValue.concat(defaultValue)
    set(formModal,'basicSchema', res )
}

onMounted(() => {
 
  listenNameChange()
  // console.log(appendSchemaByPath)
})

const iconStyleConfig: IIconConfig[] = [{
  name: "addFull" ,
  color: '#999',
  hoverColor: 'red',
  disableColor: '#D7DAE0',
  showTooltip: false,
  icon: () => h(AddIcon)
}]
</script>

<template>
  <BasicForm @register="registerForm" 
  :iconStyleConfig="iconStyleConfig"
  :row-props="rowProps" 
  style="width: 800px" 
/>
  <div>
      <n-button type="primary" class="ml-24px w-100px" @click="handleClick"
        >Save</n-button
      >
    </div>
</template>

<style lang="scss" scoped>
</style>
