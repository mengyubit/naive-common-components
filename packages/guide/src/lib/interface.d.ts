import { ButtonProps } from "naive-ui";
import { CSSProperties, VNode } from "vue";
export declare type StepStatus = "PREV" | "NEXT" | "SKIP" | "FINISH";
export declare enum EArrowDirection {
    "RIGHT_TOP" = "RIGHT_TOP",
    "RIGHT_BOTTOM" = "RIGHT_BOTTOM",
    "LEFT_TOP" = "LEFT_TOP",
    "LEFT_BOTTOM" = "LEFT_BOTTOM"
}
export declare type ArrowDirection = "RIGHT_TOP" | "RIGHT_BOTTOM" | "LEFT_TOP" | "LEFT_BOTTOM";
export interface IStep {
    target: string;
    renderTarget?: () => VNode;
    targetStyle?: CSSProperties;
    targetInnerStyle?: CSSProperties;
    header?: string | VNode;
    content?: string | VNode;
    index: number;
    confirmText?: string;
    cancelText?: string;
    confirmAction?: () => Promise<StepStatus>;
    cancelAction?: () => Promise<StepStatus>;
    footerStyle?: CSSProperties;
    cancelButtonProps?: ButtonProps;
    confirmButtonProps?: ButtonProps;
    showConfirmBtn?: boolean;
    showCancelBtn?: boolean;
    arrowImageUrl?: string;
    arrowImageStyle?: CSSProperties;
    arrowDirection: ArrowDirection;
    arrowExtraInfo?: {
        offsetX: number;
        offsetY: number;
    };
    dialogStyle?: CSSProperties;
    beforeAction?: () => Promise<any>;
    afterAction?: () => Promise<any>;
}
