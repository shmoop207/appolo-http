"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpError_1 = require("../common/error/httpError");
class StaticMiddleware {
    getModel(req) {
        return (req).model;
    }
    sendError(error, code, next) {
        this._callNext(500, "Internal Server Error", error, code, next);
    }
    sendBadRequest(error, code, next) {
        this._callNext(400, "Bad Request", error, code, next);
    }
    sendUnauthorized(error, code, next) {
        this._callNext(401, "Unauthorized", error, code, next);
    }
    sendNotFound(error, code, next) {
        this._callNext(404, "Not Found", error, code, next);
    }
    _callNext(status, statusText, error, code, next) {
        next(new httpError_1.HttpError(status, statusText, {
            status: status,
            statusText: statusText,
            error: error,
            code: code
        }));
    }
}
exports.StaticMiddleware = StaticMiddleware;
//# sourceMappingURL=staticMiddleware.js.map