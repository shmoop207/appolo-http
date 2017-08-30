"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpError_1 = require("../common/error/httpError");
const staticMiddleware_1 = require("./staticMiddleware");
class Middleware extends staticMiddleware_1.StaticMiddleware {
    constructor(req, res, next, route) {
        super();
        this.req = req;
        this.res = res;
        this.next = next;
        this.route = route;
    }
    getModel() {
        return (this.req).model;
    }
    sendError(error, code) {
        this._callNext(500, "Internal Server Error", error, code);
    }
    sendBadRequest(error, code) {
        this._callNext(400, "Bad Request", error, code);
    }
    sendUnauthorized(error, code) {
        this._callNext(401, "Unauthorized", error, code);
    }
    sendNotFound(error, code) {
        this._callNext(404, "Not Found", error, code);
    }
    _callNext(status, statusText, error, code) {
        this.next(new httpError_1.HttpError(status, statusText, {
            status: status,
            statusText: statusText,
            error: error,
            code: code
        }));
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=middleware.js.map