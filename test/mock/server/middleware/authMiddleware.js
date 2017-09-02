"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
const httpError_1 = require("../../../../lib/common/error/httpError");
let AuthMiddleware = AuthMiddleware_1 = class AuthMiddleware extends appolo.StaticMiddleware {
    run(req, res, next) {
        AuthMiddleware_1.sendUnauthorized(next, new httpError_1.HttpError(403, "NOT AUTHORIZED"), 11);
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], AuthMiddleware.prototype, "manager", void 0);
AuthMiddleware = AuthMiddleware_1 = tslib_1.__decorate([
    decorators_1.define(),
    decorators_1.singleton(),
    decorators_1.lazy()
], AuthMiddleware);
exports.AuthMiddleware = AuthMiddleware;
var AuthMiddleware_1;
//# sourceMappingURL=authMiddleware.js.map