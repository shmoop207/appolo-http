"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let RouteEnvController = class RouteEnvController extends appolo.Controller {
    test(req, res) {
        res.json({ working: true, controllerName: this.route.controller });
    }
};
RouteEnvController = tslib_1.__decorate([
    decorators_1.define()
], RouteEnvController);
appolo.route(RouteEnvController)
    .path("/test/route/not_in_env/")
    .action(c => c.test)
    .environment("test");
appolo.route(RouteEnvController)
    .path("/test/route/env/")
    .action(c => c.test)
    .environment("testing");
//# sourceMappingURL=routeEnvController.js.map