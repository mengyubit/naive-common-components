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
    span: 26
  },




  {
    span: 26,
    type: 'void',
    field: 'basicSchema',
    component: 'void-item',
    rowProps: {
      style: {
        gridTemplateColumns: '100px 1fr 100px 1fr',
      },
      cols: 4
    },
    componentProps: {
      useCollapse: true,
      expend: false,
    },
    itemProps: {
      id: 'modalBasic'
    },
    itemStyle: {
      contentStyle: {
        marginBottom: '20px'
      }
    },
    label: 'void item label',
   
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
      },
      {
        field: "repository",
        label: "Image Repository",
        component: "n-input",
        required: true,
        itemProps: {
          showRequireMark: false
        },
       
      }
    ]
  },



  {
    span: 26,
    type: 'object',
    field: 'basicSchema',
    component: 'object-item',
    componentProps: {
      useCollapse: true,
      expend: false,
    },
    itemProps: {
      id: 'modalBasic'
    },
    itemStyle: {
      contentStyle: {
        marginBottom: '20px'
      }
    },
    label: 'object item label 1',
   
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
       
      }
    ]
  },

  

  {
    span: 26,
    type: 'object',
    field: 'basicSchema',
    component: 'object-item',
    componentProps: {
      useCollapse: true,
      expend: false,
    },
    itemProps: {
      id: 'modalBasic'
    },
    itemStyle: {
      contentStyle: {
        marginBottom: '20px'
      }
    },
    label: 'object item label 2',
    rowProps: {
      style: {},
      cols: 24,
    },
    items: [
      {
        field: "name",
        label: "AppName",
        component: "n-input",
        required: true,
        span: 12,
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
        span: 12,
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
        span: 24,
       
      }
    ]
  },
]