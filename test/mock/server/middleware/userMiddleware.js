"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let UserMiddleware = class UserMiddleware extends appolo.Middleware {
    run(req, res, next) {
        req.user = "user";
        next();
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], UserMiddleware.prototype, "manager", void 0);
UserMiddleware = tslib_1.__decorate([
    decorators_1.define()
], UserMiddleware);
exports.UserMiddleware = UserMiddleware;
//# sourceMappingURL=userMiddleware.js.map