"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app = require("../../../../index");
const userMiddleware_1 = require("../middleware/userMiddleware");
let DecoratorParamsController = class DecoratorParamsController extends app.StaticController {
    constructor(manager) {
        super();
        this.name = manager.name;
    }
    test(req, res, route, aaa, env) {
        res.json({ model: env.test, name: this.name, user: req.user });
    }
};
tslib_1.__decorate([
    app.inject()
], DecoratorParamsController.prototype, "manager", void 0);
tslib_1.__decorate([
    app.path("/test/decorator/param/:name/:name2"),
    app.validation("name2", app.validator.string()),
    app.validation("name", app.validator.string()),
    app.abstract({ middleware: [userMiddleware_1.UserMiddleware] }),
    tslib_1.__param(4, app.injectParam())
], DecoratorParamsController.prototype, "test", null);
DecoratorParamsController = tslib_1.__decorate([
    app.define(),
    app.singleton(),
    app.lazy(),
    tslib_1.__param(0, app.injectParam())
], DecoratorParamsController);
//# sourceMappingURL=decoratorParamsController.js.map