"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../index");
const decorators_1 = require("../../../lib/decorators/decorators");
let Bootstrap = class Bootstrap {
    run(callback) {
        this.working = true;
        setTimeout(callback, 10);
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], Bootstrap.prototype, "manager", void 0);
Bootstrap = tslib_1.__decorate([
    appolo.define(),
    appolo.bootstrap(),
    appolo.singleton()
], Bootstrap);
exports.Bootstrap = Bootstrap;
//# sourceMappingURL=bootstrap.js.map