import { CSSProperties } from "vue";
import { ArrowDirection, IStep } from "./interface";
export declare const getNodeBySelector: (selector: string) => Element | null;
export declare const getPageOffset: (node: HTMLElement) => {
    left: number;
    top: number;
} | null;
declare type ElementInfo = {
    left: number;
    top: number;
    width: number;
    height: number;
};
export declare const getViewOffset: (element: HTMLElement | null) => null | ElementInfo;
export declare const calcTargetViewOffset: (step: IStep, targetInfo: null | ElementInfo) => {
    left: number;
    top: number;
    width: number;
    height: number;
} | null;
export declare const calcArrowViewOffset: (step: IStep, targetInfo: null | ElementInfo) => {
    left: number;
    top: number;
    width: number;
    height: number;
} | null | undefined;
export declare const calcDialogViewOffset: (step: IStep, arrowInfo: null | ElementInfo) => {
    left: number;
    top: number;
    width: number;
    height: number;
} | undefined;
export declare const getMergedArrowStyle: (arrowStyle: CSSProperties, arrowDirection: ArrowDirection) => CSSProperties;
export {};
