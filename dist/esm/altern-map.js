import { OuterSubscriber } from 'rxjs/internal/OuterSubscriber';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';
import { subscribeToResult } from 'rxjs/internal/util/subscribeToResult';
export function alternMap(...args) {
    const [project, options] = args;
    const op = (source) => source.lift(new AlternMapOperator(project, options || {}));
    if (!args[2])
        return op;
    const p = args[0];
    return (source) => Object.defineProperty(op(source), 'value', {
        get: () => p(source.value, -1).value
    });
}
class AlternMapOperator {
    constructor(project, options) {
        this.project = project;
        this.options = options;
    }
    call(subscriber, source) {
        return source.subscribe(new AlternMapSubscriber(subscriber, this.project, this.options));
    }
}
class AlternMapSubscriber extends OuterSubscriber {
    constructor(destination, project, options) {
        super(destination);
        this.project = project;
        this.options = options;
        this.index = 0;
    }
    _next(value) {
        let result;
        const index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (error) {
            this.destination.error(error);
            return;
        }
        this._innerSub(result, value, index);
    }
    _innerSub(result, value, index) {
        const innerSubscription = this.innerSubscription;
        const innerSubscriber = new InnerSubscriber(this, value, index);
        const destination = this.destination;
        destination.add(innerSubscriber);
        this.innerSubscription = subscribeToResult(this, result, undefined, undefined, innerSubscriber);
        if (this.innerSubscription !== innerSubscriber) {
            destination.add(this.innerSubscription);
        }
        if (innerSubscription) {
            innerSubscription.unsubscribe();
        }
    }
    _complete() {
        const { innerSubscription } = this;
        if (!innerSubscription || innerSubscription.closed || this.options.completeWithSource) {
            super._complete();
        }
        this.unsubscribe();
    }
    _unsubscribe() {
        this.innerSubscription = null;
    }
    notifyComplete(innerSub) {
        const destination = this.destination;
        destination.remove(innerSub);
        this.innerSubscription = null;
        if (this.isStopped || this.options.completeWithInner) {
            super._complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    }
}
//# sourceMappingURL=altern-map.js.map