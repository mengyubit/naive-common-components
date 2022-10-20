import { IStep } from "../interface";
import "./step.scss";
declare const _default: import("vue").DefineComponent<{
    step: {
        type: PropType<IStep>;
        default: () => {};
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("confirm" | "cancel")[], "confirm" | "cancel", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    step: {
        type: PropType<IStep>;
        default: () => {};
    };
}>> & {
    onConfirm?: ((...args: any[]) => any) | undefined;
    onCancel?: ((...args: any[]) => any) | undefined;
}, {
    step: IStep;
}>;
export default _default;
