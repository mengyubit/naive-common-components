import { FormSchema } from "../../lib/index"

export const formSchema: FormSchema[] = [
  {
    field: "name",
    label: "AppName",
    component: "n-input",
    span: 12
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
    componentProps: {
      // useSubHeader: true,
      AdditionAndRemovePlacement: 'top'
    },
    label: 'array item',
    defaultValue: [
      {
        arrayName: 'test',
      }
    ],
    items: [
      [
        {
          span: 12,
          field: "arrayName",
          label: "AppName",
          component: "n-input",
       },
     ]
    ]
  },
]