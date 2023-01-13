import { FormSchema } from "../../lib/index"

export const formSchema: FormSchema[] = [
  {
    field: "name",
    label: "AppName",
    component: "n-input",
    required: true,
    span: 12
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
    span: 24,
    type: 'object',
    field: 'basicSchema',
    component: 'object-item',
    itemProps: {
      id: 'modalBasic'
    },
    itemStyle: {
      contentStyle: {
        marginBottom: '20px'
      }
    },
    label: 'object item',
   
    items: [
      {
        span: 12,
        field: "name",
        label: "AppName",
        component: "n-input",
        required: true,
      }
    ]
  },

  {
    span: 24,
    type: 'array',
    field: 'basicSchema',
    component: 'array-item',
    itemProps: {
      id: 'modalBasic'
    },
    itemStyle: {
      contentStyle: {
        marginBottom: '20px'
      }
    },
    label: 'array item',
   
    items: [
      [{
        span: 12,
        field: "name",
        label: "AppName",
        component: "n-input",
        required: true,
      }]
    ]
  },
]