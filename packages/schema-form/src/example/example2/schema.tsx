import { FormSchema } from "../../lib/index"
import { cloneDeep } from "lodash-es"
import { validateVolume } from './rules'

export const formSchema: FormSchema[] = [
  {
    field: "name",
    label: "AppName",
    component: "n-input",
    span: 24,
    required: true,
  },
  {
    field: 'volumes',
    label: 'Volumes',
    type: 'array',
    component: 'array-item',
    span: 24,
    colProps: {
      style: {
        position: 'relative'
      }
    },
    componentProps: {
      minValue: 0,
      useSubHeader: true,
      AdditionAndRemovePlacement: 'right'
    },
    defaultValue: [
      {
        path: '/mnt',
        mountPath: '/mnt'
      },
      {
        path: '/etc/timezone',
        mountPath: '/etc/timezone'
      },
      {
        path: '/etc/localtime',
        mountPath: '/etc/localtime'
      },
      {
        path: '/etc/localtime1',
        mountPath: '/etc/localtime1'
      }
    ],
    items: [
      [
        {
          span: 8,
          field: 'path',
          component: 'n-input',
          itemProps: {
            showLabel: false
          },
          componentProps: {
            placeholder: 'Path: e.g. localtime'
          },
          dynamicDisabled: (val: any) => {
            return false;
          }
        },
        {
          span: 8,
          field: 'mountPath',
          component: 'n-input',
          itemProps: {
            showLabel: false
          },
          componentProps: {
            placeholder: 'Mount Path: e.g. localtime'
          }
        }
      ]
    ] as FormSchema[]
  },
  {
    span: 24,
    field: 'environmentVariable',
    label: 'Environment Variables',
    type: 'array',
    component: 'array-item',
    colProps: {
      style: {
        position: 'relative'
      }
    },
    defaultValue:  [
      {
        value: null,
        name: null
      }
    ],
    required: true,
    componentProps: {
      minValue: 0,
      useSubHeader: true,
      AdditionAndRemovePlacement: 'right'
    },
    items: [
      [
        {
          span: 8,
          field: 'name',
          component: 'n-input',
          componentProps: {
            placeholder: 'Name: e.g. Foo'
          },
          itemProps: {
            showLabel: false
          },
        },
        {
          span: 8,
          field: 'value',
          component: 'n-input',
          componentProps: {
            placeholder: 'value: e.g. bar'
          },
          itemProps: {
            showLabel: false
          },
        }
      ]
    ]
  }
]