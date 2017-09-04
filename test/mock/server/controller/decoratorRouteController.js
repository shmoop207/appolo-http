"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app = require("../../../../index");
let DecoratorRouteController = DecoratorRouteController_1 = class DecoratorRouteController extends app.StaticController {
    test(req, res) {
        res.json({ model: DecoratorRouteController_1.getModel(req) });
    }
    test2(req, res) {
        res.json({ model: DecoratorRouteController_1.getModel(req) });
    }
};
tslib_1.__decorate([
    app.inject()
], DecoratorRouteController.prototype, "manager", void 0);
tslib_1.__decorate([
    app.path("/test/decorator/route/:name/:name2"),
    app.validation("name2", app.validator.string()),
    app.validation("name", app.validator.string()),
    app.validation("test", app.validator.string())
], DecoratorRouteController.prototype, "test", null);
tslib_1.__decorate([
    app.path("/test/decorator2/route/:name/:name2"),
    app.validation("name2", app.validator.string()),
    app.validation("name", app.validator.string()),
    app.validation("test", app.validator.string())
], DecoratorRouteController.prototype, "test2", null);
DecoratorRouteController = DecoratorRouteController_1 = tslib_1.__decorate([
    app.define(),
    app.singleton(),
    app.lazy()
], DecoratorRouteController);
var DecoratorRouteController_1;
//# sourceMappingURL=decoratorRouteController.js.map