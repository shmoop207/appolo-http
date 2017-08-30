"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpError_1 = require("../common/error/httpError");
class Middleware {
    constructor(req, res, next, route) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.route = route;
    }
    getModel(req) {
        return (req || this.req).model;
    }
    run(req, res, next, route) {
        next();
    }
    sendServerError(error, code, next) {
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
        (next || this.next)(new httpError_1.HttpError(status, statusText, {
            status: status,
            statusText: statusText,
            error: error,
            code: code
        }));
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=middleware.js.map