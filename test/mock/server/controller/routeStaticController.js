"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let RouteStaticController = class RouteStaticController extends appolo.Controller {
    test(req, res) {
        res.json({ working: true, controllerName: this.route.controller, model: req.model });
    }
    all(req, res) {
        res.json({ name: this.route.actionName });
    }
    root(req, res) {
        res.json({ name: this.route.actionName });
    }
};
RouteStaticController = tslib_1.__decorate([
    decorators_1.define()
], RouteStaticController);
appolo.route(RouteStaticController)
    .path("/test/route/static")
    .method("get")
    .action(c => c.test)
    .validation("user_name", appolo.validator.string().required());
//
// appolo.route<RouteStaticController>(RouteStaticController)
//     .path("*")
//     .method("get")
//     .action(c => c.all)
appolo.route(RouteStaticController)
    .path("/")
    .method("get")
    .action(c => c.root);
//# sourceMappingURL=routeStaticController.js.map