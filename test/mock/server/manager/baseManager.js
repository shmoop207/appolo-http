"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
class BaseManager {
}
tslib_1.__decorate([
    appolo.inject()
], BaseManager.prototype, "logger", void 0);
tslib_1.__decorate([
    appolo.inject()
], BaseManager.prototype, "env", void 0);
exports.BaseManager = BaseManager;
//# sourceMappingURL=baseManager.js.map