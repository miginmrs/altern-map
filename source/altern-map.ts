import { Subscriber, ObservableInput, OperatorFunction, ObservedValueOf } from 'rxjs';
import { innerFrom } from 'rxjs/internal/observable/innerFrom';
import { operate } from 'rxjs/internal/util/lift';
import { createOperatorSubscriber } from 'rxjs/internal/operators/OperatorSubscriber';

/* tslint:disable:max-line-length */
export function alternMap<T, O extends ObservableInput<any>>(
  project: (value: T, index: number) => O
): OperatorFunction<T, ObservedValueOf<O>>;
/** @deprecated The `resultSelector` parameter will be removed in v8. Use an inner `map` instead. Details: https://rxjs.dev/deprecations/resultSelector */
export function alternMap<T, O extends ObservableInput<any>>(
  project: (value: T, index: number) => O,
  resultSelector: undefined
): OperatorFunction<T, ObservedValueOf<O>>;
/** @deprecated The `resultSelector` parameter will be removed in v8. Use an inner `map` instead. Details: https://rxjs.dev/deprecations/resultSelector */
export function alternMap<T, R, O extends ObservableInput<any>>(
  project: (value: T, index: number) => O,
  resultSelector: (outerValue: T, innerValue: ObservedValueOf<O>, outerIndex: number, innerIndex: number) => R
): OperatorFunction<T, R>;
/* tslint:enable:max-line-length */

/* tslint:enable:max-line-length */

/**
 *
 * Same as switchMap except that, unlike switchMap, alternMap will unsubscribe from its previous inner Observable only after subscribing to the new inner Observable
 * 
 * @see {@link switchMap}
 * @see {@link mergeMap}
 *
 * @param {function(value: T, ?index: number): ObservableInput} p A function
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
  resultSelector?: (outerValue: T, innerValue: ObservedValueOf<O>, outerIndex: number, innerIndex: number) => R
): OperatorFunction<T, ObservedValueOf<O> | R> {
  return operate((source, subscriber) => {
    let innerSubscriber: Subscriber<ObservedValueOf<O>> | null = null;
    let index = 0;
    // Whether or not the source subscription has completed
    let isComplete = false;

    // We only complete the result if the source is complete AND we don't have an active inner subscription.
    // This is called both when the source completes and when the inners complete.
    const checkComplete = () => isComplete && !innerSubscriber && subscriber.complete();

    source.subscribe(
      createOperatorSubscriber(
        subscriber,
        (value) => {
          const subs = innerSubscriber
          let innerIndex = 0;
          const outerIndex = index++;
          // Start the next inner subscription
          innerFrom(project(value, outerIndex)).subscribe(
            (innerSubscriber = createOperatorSubscriber(
              subscriber,
              // When we get a new inner value, next it through. Note that this is
              // handling the deprecate result selector here. This is because with this architecture
              // it ends up being smaller than using the map operator.
              (innerValue) => subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue),
              () => {
                // The inner has completed. Null out the inner subscriber to
                // free up memory and to signal that we have no inner subscription
                // currently.
                innerSubscriber = null!;
                checkComplete();
              }
            ))
          );
          // Cancel the previous inner subscription if there was one
          subs?.unsubscribe();
        },
        () => {
          isComplete = true;
          checkComplete();
        }
      )
    );
  });
}
