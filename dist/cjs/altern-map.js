"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alternMap = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const OuterSubscriber_1 = require("rxjs/internal/OuterSubscriber");
const InnerSubscriber_1 = require("rxjs/internal/InnerSubscriber");
const subscribeToResult_1 = require("rxjs/internal/util/subscribeToResult");
function alternMap(project, options, resultSelector) {
    if (typeof resultSelector === 'function') {
        return (source) => source.pipe(alternMap((a, i) => rxjs_1.from(project(a, i)).pipe(operators_1.map((b, ii) => resultSelector(a, b, i, ii))), options));
    }
    return (source) => source.lift(new AlternMapOperator(project, options || {}));
}
exports.alternMap = alternMap;
class AlternMapOperator {
    constructor(project, options) {
        this.project = project;
        this.options = options;
    }
    call(subscriber, source) {
        return source.subscribe(new AlternMapSubscriber(subscriber, this.project, this.options));
    }
}
class AlternMapSubscriber extends OuterSubscriber_1.OuterSubscriber {
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
        const innerSubscriber = new InnerSubscriber_1.InnerSubscriber(this, value, index);
        const destination = this.destination;
        destination.add(innerSubscriber);
        this.innerSubscription = subscribeToResult_1.subscribeToResult(this, result, undefined, undefined, innerSubscriber);
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