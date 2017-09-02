"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class StaticController {
    invoke(req, res, route, action) {
        let fnName = route.actionName;
        if (!fnName) {
            fnName = _.isString(action) ? action : action(this).name;
            if (!this[fnName]) {
                throw new Error(`failed to invoke ${this.constructor.name} fnName ${fnName}`);
            }
            route.actionName = fnName;
        }
        this[fnName](req, res, route);
    }
    static send(res, statusCode, data) {
        if (arguments.length === 1) {
            this.sendOk(arguments[0]);
        }
        else {
            res.status(statusCode).json(data);
        }
    }
    static sendOk(res, data) {
        res.status(200).json(data);
    }
    static sendCreated(res, data) {
        res.status(201).send(data);
    }
    static sendNoContent(res) {
        res.status(204).send();
    }
    static sendError(res, error, code) {
        res.status(500).json({
            status: 500,
            statusText: "Internal Server Error",
            error: error ? error.toString() : "",
            code: code
        });
    }
    static sendBadRequest(res, error, code) {
        res.status(400).json({
            status: 400,
            statusText: "Bad Request",
            error: (error instanceof Error) ? error.toString() : "",
            code: code
        });
    }
    static sendUnauthorized(res, error, code) {
        res.status(401).json({
            status: 401,
            statusText: "Unauthorized",
            error: error ? error.toString() : "",
            code: code
        });
    }
    static sendNotFound(res, error, code) {
        res.status(404).json({
            status: 404,
            statusText: "Not Found",
            error: error ? error.toString() : "",
            code: code
        });
    }
    static getModel(req) {
        return req.model;
    }
}
exports.StaticController = StaticController;
//# sourceMappingURL=staticController.js.map