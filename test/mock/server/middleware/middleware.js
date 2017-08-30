"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let TestMiddleware = class TestMiddleware extends appolo.Middleware {
    run(req, res, next) {
        res.send({ working: true, middleware: true, name: this.manager.name });
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], TestMiddleware.prototype, "manager", void 0);
TestMiddleware = tslib_1.__decorate([
    decorators_1.define()
], TestMiddleware);
exports.TestMiddleware = TestMiddleware;
//# sourceMappingURL=middleware.js.map