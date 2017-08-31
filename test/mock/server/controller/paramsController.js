"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let ParamsController = class ParamsController extends appolo.Controller {
    test(req, res) {
        res.json({
            working: true,
            controllerName: this.route.controller,
            model: req.model,
            manager: this.manager4.name,
            name: req.params.name,
            name2: req.params.name2
        });
    }
    empty(req, res) {
        this.sendNoContent();
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], ParamsController.prototype, "manager4", void 0);
ParamsController = tslib_1.__decorate([
    decorators_1.define()
], ParamsController);
exports.ParamsController = ParamsController;
appolo.route(ParamsController)
    .path('/test/params/:name/:name2')
    .method('get')
    .action(c => c.test)
    .validations('user_name', appolo.validator.string().required());
appolo.route(ParamsController)
    .path('/test/params/:name/test/:name2')
    .method('get')
    .action(c => c.test)
    .validations('user_name', appolo.validator.string().required());
appolo.route(ParamsController)
    .path('/test/params/empty/:name/:name2')
    .method('get')
    .action(c => c.empty)
    .validations('user_name', appolo.validator.string().required());
//# sourceMappingURL=paramsController.js.map