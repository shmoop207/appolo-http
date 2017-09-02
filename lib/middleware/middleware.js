"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        Middleware.sendError(this.next, error, code);
    }
    sendBadRequest(error, code) {
        Middleware.sendBadRequest(this.next, error, code);
    }
    sendUnauthorized(error, code) {
        Middleware.sendUnauthorized(this.next, error, code);
    }
    sendNotFound(error, code) {
        Middleware.sendNotFound(this.next, error, code);
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=middleware.js.map