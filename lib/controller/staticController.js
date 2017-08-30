"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class StaticController {
    invoke(req, res, next, route, action) {
        let fnName = route.actionName;
        if (!fnName) {
            fnName = _.isString(action) ? action : action(this).name;
            if (!this[fnName]) {
                throw new Error(`failed to invoke ${this.constructor.name} fnName ${fnName}`);
            }
            route.actionName = fnName;
        }
        this[fnName](req, res, next, route);
    }
    send(res, statusCode, data) {
        if (arguments.length === 1) {
            this.sendOk(arguments[0]);
        }
        else {
            res.status(statusCode).json(data);
        }
    }
    sendOk(res, data) {
        res.status(200).json(data);
    }
    sendCreated(res, data) {
        res.status(201).send();
    }
    sendNoContent(res) {
        res.status(204).send();
    }
    sendError(res, error, code) {
        res.status(500).json({
            status: 500,
            statusText: "Internal Server Error",
            error: error ? error.toString() : "",
            code: code
        });
    }
    sendBadRequest(res, error, code) {
        res.status(400).json({
            status: 400,
            statusText: "Bad Request",
            error: (error instanceof Error) ? error.toString() : "",
            code: code
        });
    }
    sendUnauthorized(res, error, code) {
        res.status(401).json({
            status: 401,
            statusText: "Unauthorized",
            error: error ? error.toString() : "",
            code: code
        });
    }
    sendNotFound(res, error, code) {
        res.status(404).json({
            status: 404,
            statusText: "Not Found",
            error: error ? error.toString() : "",
            code: code
        });
    }
    getModel(req) {
        return req.model;
    }
}
exports.StaticController = StaticController;
//# sourceMappingURL=staticController.js.map