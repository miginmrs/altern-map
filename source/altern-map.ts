import { ObservableInput, OperatorFunction, ObservedValueOf, from, Observable, Operator, Subscriber, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { OuterSubscriber } from "rxjs/internal/OuterSubscriber";
import { InnerSubscriber } from "rxjs/internal/InnerSubscriber";
import { subscribeToResult } from "rxjs/internal/util/subscribeToResult";


type AlternMapOptions = { completeWithInner?: boolean, completeWithSource?: boolean };

/* tslint:disable:max-line-length */
export function alternMap<T, O extends ObservableInput<any>>(project: (value: T, index: number) => O, options?: AlternMapOptions): OperatorFunction<T, ObservedValueOf<O>>;
/** @deprecated resultSelector is no longer supported, use inner map instead */
export function alternMap<T, O extends ObservableInput<any>>(project: (value: T, index: number) => O, options: AlternMapOptions, resultSelector: undefined): OperatorFunction<T, ObservedValueOf<O>>;
/** @deprecated resultSelector is no longer supported, use inner map instead */
export function alternMap<T, R, O extends ObservableInput<any>>(project: (value: T, index: number) => O, options: AlternMapOptions, resultSelector: (outerValue: T, innerValue: ObservedValueOf<O>, outerIndex: number, innerIndex: number) => R): OperatorFunction<T, R>;
/* tslint:enable:max-line-length */

/**
 *
 * Same as switchMap except that, unlike switchMap, alternMap will unsubscribe from its previous inner Observable only after subscribing to the new inner Observable
 * 
 * @see {@link switchMap}
 * @see {@link mergeMap}
 *
 * @param {function(value: T, ?index: number): ObservableInput} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional deprecated `resultSelector`) to each item
 * emitted by the source Observable and taking only the values from the most recently
 * projected inner Observable.
 * @method alternMap
 * @owner Observable
 */
export function alternMap<T, R, O extends ObservableInput<any>>(
  project: (value: T, index: number) => O,
  options?: AlternMapOptions,
  resultSelector?: (outerValue: T, innerValue: ObservedValueOf<O>, outerIndex: number, innerIndex: number) => R,
): OperatorFunction<T, ObservedValueOf<O> | R> {
  if (typeof resultSelector === 'function') {
    return (source: Observable<T>) => source.pipe(
      alternMap((a, i) => from(project(a, i)).pipe(
        map((b, ii) => resultSelector(a, b, i, ii))
      ), options)
    );
  }
  return (source: Observable<T>) => source.lift(new AlternMapOperator(project, options || {}));
}

class AlternMapOperator<T, R> implements Operator<T, R> {
  constructor(private project: (value: T, index: number) => ObservableInput<R>, private options: AlternMapOptions,) {
  }

  call(subscriber: Subscriber<R>, source: any): any {
    return source.subscribe(new AlternMapSubscriber(subscriber, this.project, this.options));
  }
}

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class AlternMapSubscriber<T, R> extends OuterSubscriber<T, R> {
  private index: number = 0;
  private innerSubscription: Subscription | null | undefined;

  constructor(destination: Subscriber<R>,
    private project: (value: T, index: number) => ObservableInput<R>,
    private options: AlternMapOptions) {
    super(destination);
  }

  protected _next(value: T) {
    let result: ObservableInput<R>;
    const index = this.index++;
    try {
      result = this.project(value, index);
    } catch (error) {
      this.destination.error!(error);
      return;
    }
    this._innerSub(result, value, index);
  }

  private _innerSub(result: ObservableInput<R>, value: T, index: number) {
    const innerSubscription = this.innerSubscription;
    const innerSubscriber = new InnerSubscriber(this, value, index);
    const destination = this.destination as Subscription;
    destination.add(innerSubscriber);
    this.innerSubscription = subscribeToResult(this, result, undefined, undefined, innerSubscriber);
    // The returned subscription will usually be the subscriber that was
    // passed. However, interop subscribers will be wrapped and for
    // unsubscriptions to chain correctly, the wrapper needs to be added, too.
    if (this.innerSubscription !== innerSubscriber) {
      destination.add(this.innerSubscription);
    }
    if (innerSubscription) {
      innerSubscription.unsubscribe();
    }
  }

  protected _complete(): void {
    const { innerSubscription } = this;
    if (!innerSubscription || innerSubscription.closed || this.options.completeWithSource) {
      super._complete();
    }
    this.unsubscribe();
  }

  protected _unsubscribe() {
    this.innerSubscription = null!;
  }

  notifyComplete(innerSub: Subscription): void {
    const destination = this.destination as Subscription;
    destination.remove(innerSub);
    this.innerSubscription = null!;
    if (this.isStopped || this.options.completeWithInner) {
      super._complete();
    }
  }

  notifyNext(outerValue: T, innerValue: R,
    outerIndex: number, innerIndex: number,
    innerSub: InnerSubscriber<T, R>): void {
    this.destination.next!(innerValue);
  }
}