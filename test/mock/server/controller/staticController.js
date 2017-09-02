"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let StaticController = StaticController_1 = class StaticController extends appolo.StaticController {
    test(req, res) {
        res.json({ model: StaticController_1.getModel(req) });
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], StaticController.prototype, "manager", void 0);
StaticController = StaticController_1 = tslib_1.__decorate([
    decorators_1.define(),
    decorators_1.singleton(),
    decorators_1.lazy()
], StaticController);
appolo.route(StaticController)
    .path('/test/static/controller/:name/:name2')
    .method('get')
    .action('test')
    .validation("test", appolo.validator.string())
    .validation("name", appolo.validator.string())
    .validation("user_name", appolo.validator.string())
    .validation("name2", appolo.validator.string())
    .validation("name", appolo.validator.string());
appolo.route(StaticController)
    .path('/test/static/controller/:name/:bbb/post')
    .method('post')
    .action('test')
    .validation("test", appolo.validator.string())
    .validation("name", appolo.validator.string())
    .validation("testPost", appolo.validator.boolean().required());
var StaticController_1;
//# sourceMappingURL=staticController.js.map