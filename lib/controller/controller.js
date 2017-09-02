"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const staticController_1 = require("./staticController");
class Controller extends staticController_1.StaticController {
    constructor(req, res, route) {
        super();
        this.req = req;
        this.res = res;
        this.route = route;
    }
    send(statusCode, data) {
        Controller.send(this.res, statusCode, data);
    }
    sendOk(data) {
        Controller.sendOk(this.res, data);
    }
    sendCreated(data) {
        Controller.sendCreated(this.res, data);
    }
    sendNoContent() {
        Controller.sendNoContent(this.res);
    }
    sendError(error, code) {
        Controller.sendError(this.res, error, code);
    }
    sendBadRequest(error, code) {
        Controller.sendBadRequest(this.res, error, code);
    }
    sendUnauthorized(error, code) {
        Controller.sendUnauthorized(this.res, error, code);
    }
    sendNotFound(error, code) {
        Controller.sendNotFound(this.res, error, code);
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