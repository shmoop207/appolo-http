"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const staticController_1 = require("./staticController");
class Controller extends staticController_1.StaticController {
    constructor(req, res, next, route) {
        super();
        this.req = req;
        this.res = res;
        this.next = next;
        this.route = route;
    }
    send(statusCode, data) {
        super.send(this.res, statusCode, data);
    }
    sendOk(data) {
        super.sendOk(this.res, data);
    }
    sendCreated(data) {
        super.sendCreated(this.res, data);
    }
    sendNoContent() {
        super.sendNoContent(this.res);
    }
    sendError(error, code) {
        super.sendServerError(this.res, error, code);
    }
    sendBadRequest(error, code) {
        super.sendBadRequest(this.res, error, code);
    }
    sendUnauthorized(error, code) {
        super.sendUnauthorized(this.res, error, code);
    }
    sendNotFound(error, code) {
        super.sendNotFound(this.res, error, code);
    }
    getName() {
        return this.route.controller;
    }
    getModel() {
        return this.req.model;
    }
}
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map