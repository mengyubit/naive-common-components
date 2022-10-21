import { IStep } from "./lib/interface"
import arrowUrl from "@/assets/arrow.svg"
const indexStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "28px",
  height: "28px",
  background: "#E2EEFF",
  borderRadius: "14px",
  marginRight: "16px"
}

const renderContent = (index: number, content: string) => (
  <div
    style={{
      display: "flex"
    }}
  >
    <div style={indexStyle}>{index}</div>
    <div style={{ flex: 1 }}>{content}</div>
  </div>
)

const dialogStyle = {
  lineHeight: "28px",
  width: "443px",
  height: "172px",
  color: "#333",
  fontWeight: 500,
  padding: "20px 40px 20px 20px",
  fontSize: "20px"
}

const basicStepConfig = {
  confirmText: "Next",
  cancelText: "Skip",
  dialogStyle: dialogStyle,
  confirmButtonProps: {
    quaternary: true,
    strong: true,
    themeOverrides: {
      paddingMedium: "0 12px"
    }
  },

  cancelButtonProps: {
    quaternary: true,
    strong: true,
    themeOverrides: {
      paddingMedium: "0 12px",
      textColor: "#999"
    }
  },

  arrowImageUrl: arrowUrl,
  arrowImageStyle: {
    width: "146px",
    height: "156px"
  },
  arrowExtraInfo: {
    offsetX: 8,
    offsetY: 16
  }
}

export const steps: IStep[] = [
  {
    ...basicStepConfig,
    arrowDirection: "RIGHT_TOP",
    target: "#guide__create-component",

    content: renderContent(
      1,
      `if you want to deploy a backend service, please create at least one component here.`
    )
  },
  {
    ...basicStepConfig,
    arrowDirection: "RIGHT_BOTTOM",
    target: "#guide__create-component",

    content: renderContent(
      2,
      `if you want to deploy a backend service, please create at least one component here.`
    )
  },
  {
    ...basicStepConfig,
    arrowDirection: "LEFT_BOTTOM",
    target: "#guide__create-component",

    content: renderContent(
      3,
      `if you want to deploy a backend service, please create at least one component here.`
    )
  },
  {
    ...basicStepConfig,
    arrowDirection: "LEFT_TOP",
    target: "#guide__create-component",

    content: renderContent(
      4,
      `if you want to deploy a backend service, please create at least one component here.`
    )
  },
]
