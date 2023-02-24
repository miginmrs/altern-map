import { expect } from 'chai';
import { TestScheduler } from 'rxjs/testing';
import { share, switchMap, tap } from 'rxjs/operators';
import { alternMap } from '../source/index';

const testScheduler = () => new TestScheduler((actual, expected) => {
  expect(actual).deep.equal(expected);
});

describe('AlternMap', function () {
  it('should unsubscribe to new observable after subscribing to new observable', function () {
    testScheduler().run(({ expectObservable, cold }) => {
      const obs = cold('abc').pipe(share())
      expectObservable(cold('a-b').pipe(switchMap(() => obs))).toBe('ababc');
    })
    testScheduler().run(({ expectObservable, cold }) => {
      const obs = cold('abc').pipe(share())
      expectObservable(cold('a-b').pipe(alternMap(() => obs))).toBe('abc');
    })
  })
})