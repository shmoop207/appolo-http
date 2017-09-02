"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
let DecoratorRouteController = DecoratorRouteController_1 = class DecoratorRouteController extends appolo.StaticController {
    test(req, res) {
        res.json({ model: DecoratorRouteController_1.getModel(req) });
    }
};
tslib_1.__decorate([
    appolo.inject()
], DecoratorRouteController.prototype, "manager", void 0);
tslib_1.__decorate([
    appolo.path("/test/decorator/route/:name/:name2"),
    appolo.validation("name2", appolo.validator.string()),
    appolo.validation("name", appolo.validator.string()),
    appolo.validation("test", appolo.validator.string())
], DecoratorRouteController.prototype, "test", null);
DecoratorRouteController = DecoratorRouteController_1 = tslib_1.__decorate([
    appolo.define(),
    appolo.singleton(),
    appolo.lazy()
], DecoratorRouteController);
var DecoratorRouteController_1;
//# sourceMappingURL=decoratorRouteController.js.map