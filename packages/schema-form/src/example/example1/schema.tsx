import { NInput } from "naive-ui"
import { FormSchema, RenderCallbackParams } from "../../lib/index"
import { useFormContext } from "../../lib/hooks/useFormContext"
import { appNameRules } from "./rules"

export const formSchema: FormSchema[] = [
  {
    field: "name",
    label: "AppName",
    component: "n-input",
    span: 24,
    required: true,
    rules: appNameRules
  },
  {
    field: "desc",
    label: "App Description",
    component: "n-input",
    span: 24,
    required: true,
    componentProps: {
      type: "textarea"
    },
  },
  {
    field: "responsibleTeam",
    label: "Responsible Team",
    component: "n-select",
    componentProps: {
      options: [
        {
          label: 'team1',
          value: 'team1'
        },
        {
          label: 'team2',
          value: 'team2'
        }
      ],
      filterable: true
    },
    helpComponentSlot: () => {
      return {
        content: () => {
          return (
            <div class="leading-20px">
              <div>"团队" in Aura create team link:</div>
            </div>
          )
        }
      }
    },
    helpComponentProps: {
      x: "-32px",
      y: "12px",
      maxWidth: 210
    },
    required: true,
    span: 24
  },
  {
    field: "department",
    label: "Department",
    component: "n-select",
    required: true,
    span: 24,
    componentProps: {
      options: [
        {
          label: 'Artifactory',
          value: 'artifactory'
        },
        {
          label: 'Custom',
          value: 'custom'
        }
      ],
      filterable: true
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
    span: 24
  },
  {
    field: "mainPage",
    label: "Main Page",
    component: "n-input-group",
    required: true,

    renderComponentContent: ({ path = "", bindVal }: RenderCallbackParams) => {
      const { setFormModel } = useFormContext()
      const handleInput = (value: string) => {
        if (value.startsWith("https://")) {
          setFormModel(path, value)
        } else {
          setFormModel(path, `https://${value}`)
        }
      }
      return (
        <>
          <n-input-group-label>https://</n-input-group-label>
          <NInput
            value={bindVal?.value?.split("https://")[1]}
            onUpdateValue={handleInput}
          ></NInput>
        </>
      )
    },
    span: 24
  }
]