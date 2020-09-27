(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("rxjs/internal/InnerSubscriber"), require("rxjs/internal/OuterSubscriber"), require("rxjs/internal/util/subscribeToResult"));
	else if(typeof define === 'function' && define.amd)
		define(["rxjs/internal/InnerSubscriber", "rxjs/internal/OuterSubscriber", "rxjs/internal/util/subscribeToResult"], factory);
	else if(typeof exports === 'object')
		exports["alternMap"] = factory(require("rxjs/internal/InnerSubscriber"), require("rxjs/internal/OuterSubscriber"), require("rxjs/internal/util/subscribeToResult"));
	else
		root["alternMap"] = factory(root["rxjs"]["internal"]["InnerSubscriber"], root["rxjs"]["internal"]["OuterSubscriber"], root["rxjs"]["internal"]["util"]["subscribeToResult"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_rxjs_internal_InnerSubscriber__, __WEBPACK_EXTERNAL_MODULE_rxjs_internal_OuterSubscriber__, __WEBPACK_EXTERNAL_MODULE_rxjs_internal_util_subscribeToResult__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./source/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./source/altern-map.ts":
/*!******************************!*\
  !*** ./source/altern-map.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.alternMap = void 0;
const OuterSubscriber_1 = __webpack_require__(/*! rxjs/internal/OuterSubscriber */ "rxjs/internal/OuterSubscriber");
const InnerSubscriber_1 = __webpack_require__(/*! rxjs/internal/InnerSubscriber */ "rxjs/internal/InnerSubscriber");
const subscribeToResult_1 = __webpack_require__(/*! rxjs/internal/util/subscribeToResult */ "rxjs/internal/util/subscribeToResult");
function alternMap(...args) {
    const [project, options] = args;
    const op = (source) => source.lift(new AlternMapOperator(project, options || {}));
    if (!args[2])
        return op;
    const p = args[0];
    return (source) => Object.defineProperty(op(source), 'value', {
        get: () => p(source.value, -1).value
    });
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


/***/ }),

/***/ "./source/index.ts":
/*!*************************!*\
  !*** ./source/index.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(__webpack_require__(/*! ./altern-map */ "./source/altern-map.ts"), exports);


/***/ }),

/***/ "rxjs/internal/InnerSubscriber":
/*!********************************************************************************************************************************************************************************************!*\
  !*** external {"root":["rxjs","internal","InnerSubscriber"],"commonjs":"rxjs/internal/InnerSubscriber","commonjs2":"rxjs/internal/InnerSubscriber","amd":"rxjs/internal/InnerSubscriber"} ***!
  \********************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_rxjs_internal_InnerSubscriber__;

/***/ }),

/***/ "rxjs/internal/OuterSubscriber":
/*!********************************************************************************************************************************************************************************************!*\
  !*** external {"root":["rxjs","internal","OuterSubscriber"],"commonjs":"rxjs/internal/OuterSubscriber","commonjs2":"rxjs/internal/OuterSubscriber","amd":"rxjs/internal/OuterSubscriber"} ***!
  \********************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_rxjs_internal_OuterSubscriber__;

/***/ }),

/***/ "rxjs/internal/util/subscribeToResult":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** external {"root":["rxjs","internal","util","subscribeToResult"],"commonjs":"rxjs/internal/util/subscribeToResult","commonjs2":"rxjs/internal/util/subscribeToResult","amd":"rxjs/internal/util/subscribeToResult"} ***!
  \**************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_rxjs_internal_util_subscribeToResult__;

/***/ })

/******/ });
});
//# sourceMappingURL=altern-map.umd.js.map