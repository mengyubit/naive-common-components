import { FormSchema } from "../../lib/index"

export const formSchema: FormSchema[] = [
  {
    field: "name",
    label: "AppName",
    component: "n-input",
    required: true,
  },
  
  {
    field: "desc",
    label: "App Description",
    component: "n-input",
    span: 12,
    required: true,
    componentProps: {
      type: "textarea"
    },
  },

  {
    field: "name",
    label: "AppName",
    component: "n-input",
    required: true,
  },

  {
    field: "repository",
    label: "Image Repository",
    component: "n-input",
    required: true,
    itemProps: {
      showRequireMark: false
    },
    span: 12
  },
  {
    field: "repository",
    label: "Image Repository",
    component: "n-input",
    required: true,
    itemProps: {
      showRequireMark: false
    },
    span: 24
  }
]