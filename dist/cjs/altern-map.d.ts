import { ObservableInput, OperatorFunction, ObservedValueOf } from "rxjs";
declare type AlternMapOptions = {
    completeWithInner?: boolean;
    completeWithSource?: boolean;
};
export declare function alternMap<T, O extends ObservableInput<any>>(project: (value: T, index: number) => O, options?: AlternMapOptions): OperatorFunction<T, ObservedValueOf<O>>;
export declare function alternMap<T, O extends ObservableInput<any>>(project: (value: T, index: number) => O, options: AlternMapOptions, resultSelector: undefined): OperatorFunction<T, ObservedValueOf<O>>;
export declare function alternMap<T, R, O extends ObservableInput<any>>(project: (value: T, index: number) => O, options: AlternMapOptions, resultSelector: (outerValue: T, innerValue: ObservedValueOf<O>, outerIndex: number, innerIndex: number) => R): OperatorFunction<T, R>;
export {};
