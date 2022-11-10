import { FormSchema } from "../../lib/index"
import { cloneDeep } from "lodash-es"
import { validateVolume } from './rules'

const volumesOptions = [
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
  }
];

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
    required: true,
    componentProps: {
      minValue: 0,
      useSubHeader: true,
      AdditionAndRemovePlacement: 'right'
    },
    defaultValue: cloneDeep(volumesOptions),
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
  }
]