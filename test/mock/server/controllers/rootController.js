"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let RootController = class RootController extends appolo.StaticController {
    all(req, res, route) {
        res.json({ name: route.actionName });
    }
    root(req, res, route) {
        res.json({ name: route.actionName });
    }
    raw(req, res, route) {
        res.end(route.actionName);
    }
};
tslib_1.__decorate([
    decorators_1.pathGet("/raw")
], RootController.prototype, "raw", null);
RootController = tslib_1.__decorate([
    decorators_1.define()
], RootController);
exports.RootController = RootController;
//
// appolo.route<RouteStaticController>(RouteStaticController)
//     .path("*")
//     .method("get")
//     .action(c => c.all)
appolo.route(RootController)
    .path("/")
    .method("get")
    .action(c => c.root);
//# sourceMappingURL=rootController.js.map