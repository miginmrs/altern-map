import { ObservableInput, OperatorFunction, Observable } from 'rxjs';
declare type ValuedObservable<T> = Observable<T> & {
    readonly value: T;
};
declare type ValuedOperator<T, R> = {
    (o: ValuedObservable<T>): ValuedObservable<R>;
};
declare type AlternMapOptions = {
    completeWithInner?: boolean;
    completeWithSource?: boolean;
};
export declare function alternMap<T, R>(project: (value: T, index: number) => ObservableInput<R>, options?: AlternMapOptions): OperatorFunction<T, R>;
export declare function alternMap<T, R>(project: (value: T, index: number) => ValuedObservable<R>, options: AlternMapOptions, valued: true): ValuedOperator<T, R>;
export {};
