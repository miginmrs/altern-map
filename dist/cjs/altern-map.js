"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alternMap = void 0;
const innerFrom_1 = require("rxjs/internal/observable/innerFrom");
const lift_1 = require("rxjs/internal/util/lift");
const OperatorSubscriber_1 = require("rxjs/internal/operators/OperatorSubscriber");
function alternMap(project, resultSelector) {
    return (0, lift_1.operate)((source, subscriber) => {
        let innerSubscriber = null;
        let index = 0;
        let isComplete = false;
        const checkComplete = () => isComplete && !innerSubscriber && subscriber.complete();
        source.subscribe((0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, (value) => {
            const subs = innerSubscriber;
            let innerIndex = 0;
            const outerIndex = index++;
            (0, innerFrom_1.innerFrom)(project(value, outerIndex)).subscribe((innerSubscriber = (0, OperatorSubscriber_1.createOperatorSubscriber)(subscriber, (innerValue) => subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue), () => {
                innerSubscriber = null;
                checkComplete();
            })));
            subs?.unsubscribe();
        }, () => {
            isComplete = true;
            checkComplete();
        }));
    });
}
exports.alternMap = alternMap;
//# sourceMappingURL=altern-map.js.map