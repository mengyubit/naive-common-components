import { FormSchema } from "../../lib/index"

export const formSchema: FormSchema[] = [
  // {
  //   field: "name",
  //   label: "AppName",
  //   component: "n-input",
  //   required: true,
  // },
  
  // {
  //   field: "desc",
  //   label: "App Description",
  //   component: "n-input",
  //   span: 12,
  //   required: true,
  //   componentProps: {
  //     type: "textarea"
  //   },
  // },

  // {
  //   field: "name",
  //   label: "AppName",
  //   component: "n-input",
  //   required: true,
  // },

  // {
  //   field: "repository",
  //   label: "Image Repository",
  //   component: "n-input",
  //   required: true,
  //   itemProps: {
  //     showRequireMark: false
  //   },
  //   span: 12
  // },
  // {
  //   field: "repository",
  //   label: "Image Repository",
  //   component: "n-input",
  //   required: true,
  //   itemProps: {
  //     showRequireMark: false
  //   },
  //   span: 24
  // },

  {
    span: 26,
    type: 'void',
    field: 'basicSchema',
    component: 'void-item',
    itemProps: {
      id: 'modalBasic'
    },
    itemStyle: {
      contentStyle: {
        marginBottom: '20px'
      }
    },
    label: 'void item label',
    colProps: {
      style:{
        gridColumn: 'span 26 / span 26'
      }
    },
    items: [
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
        span: 26,
        colProps: {
          style:{
            gridColumn: 'span 26 / span 26'
          }
        },
      }
    ]
  },
]