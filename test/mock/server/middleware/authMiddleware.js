"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
const httpError_1 = require("../../../../lib/common/error/httpError");
let AuthMiddleware = class AuthMiddleware extends appolo.StaticMiddleware {
    run(req, res, next) {
        next(new httpError_1.HttpError(403, "NOT AUTHORIZED"));
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], AuthMiddleware.prototype, "manager", void 0);
AuthMiddleware = tslib_1.__decorate([
    decorators_1.define(),
    decorators_1.singleton(),
    decorators_1.lazy()
], AuthMiddleware);
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=authMiddleware.js.map