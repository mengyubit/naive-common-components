import { NTooltip } from 'naive-ui'

export default defineComponent({
  name: "DynamicIcon",
  components: {
    NTooltip
  },
  props: {
    name: {
      type: String,
    },
    icon: {
      type: Object,
    },
    showTooltip: {
      type: Boolean,
      default: false
    }
  },
 
  render() {
    const iconSlots = {
      trigger: () => this.$props.icon?.(),
      default: () => this.$props.name
    }
    return this.$props.showTooltip ? <NTooltip v-slots={iconSlots}>
      </NTooltip> : this.$props.icon?.()
  }
})