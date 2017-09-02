"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
let Handler2 = class Handler2 {
    handle() {
        return 2;
    }
};
Handler2 = tslib_1.__decorate([
    appolo.define(),
    appolo.singleton(),
    appolo.alias("IHandler")
], Handler2);
exports.Handler2 = Handler2;
//# sourceMappingURL=handler2.js.map