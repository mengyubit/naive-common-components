import { IStep, StepStatus } from "../interface";
import "./tour.scss";
declare const _default: import("vue").DefineComponent<__VLS_TypePropsToRuntimeProps<{
    steps: IStep[];
}>, {
    start: () => void;
    stop: () => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    finish: (status: StepStatus) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    steps: IStep[];
}>>> & {
    onFinish?: ((status: StepStatus) => any) | undefined;
}, {}>;
export default _default;
declare type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
declare type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
