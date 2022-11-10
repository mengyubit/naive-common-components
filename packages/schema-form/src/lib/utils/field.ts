import { IFieldProps, VueComponent } from "../types/field"

export const getFieldProps = () => ({
  name: {},
  title: {},
  description: {},
  value: {},
  initialValue: {},
  basePath: {},
  decorator: Array,
  component: Array,
  display: String,
  pattern: String,
  required: { type: Boolean, default: undefined },
  validateFirst: { type: Boolean, default: undefined },
  hidden: { type: Boolean, default: undefined },
  visible: { type: Boolean, default: undefined },
  editable: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  readOnly: { type: Boolean, default: undefined },
  readPretty: { type: Boolean, default: undefined },
  dataSource: {},
  validator: {},
  reactions: [Array, Function]
})
export const getVoidFieldProps = () => ({
  name: {},
  title: {},
  description: {},
  basePath: {},
  decorator: Array,
  component: Array,
  display: String,
  pattern: String,
  hidden: { type: Boolean, default: undefined },
  visible: { type: Boolean, default: undefined },
  editable: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  readOnly: { type: Boolean, default: undefined },
  readPretty: { type: Boolean, default: undefined },
  reactions: [Array, Function]
})
