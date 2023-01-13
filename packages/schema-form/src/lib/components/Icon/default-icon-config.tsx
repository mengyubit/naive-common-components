import AddIcon from './add.vue';
import RemoveIcon from './remove.vue';
import AddFullIcon from './addFull.vue';
import RemoveFullIcon from './removeFull.vue';
import ExpendIcon from './expend.vue';

export const ICON_CONFIG_MAP = {
  add: () => h(AddIcon),
  remove: () => h(RemoveIcon),
  addFull: () => h(AddFullIcon),
  removeFull: () => h(RemoveFullIcon),
  expend: () => h(ExpendIcon),
}