"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let RouteDecoratorsController = class RouteDecoratorsController extends appolo.Controller {
    test(req, res) {
        res.json({ working: true, controllerName: this.route.controller, model: req.model, manager: this.manager4.name, name: req.params.name, name2: req.params.name2 });
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], RouteDecoratorsController.prototype, "manager4", void 0);
RouteDecoratorsController = tslib_1.__decorate([
    decorators_1.define()
], RouteDecoratorsController);
appolo.route(RouteDecoratorsController)
    .path('/test/route/decorator/:name/:name2')
    .method('get')
    .action(c => c.test)
    .validations('user_name', appolo.validator.string().required());
//# sourceMappingURL=routeDecoratorsController.js.map