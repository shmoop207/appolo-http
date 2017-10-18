"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
let DefineController = class DefineController extends appolo.Controller {
    test(req, res) {
        res.json({ working: true, controllerName: this.route.controller, model: req.model, manager5: this.manager5.name });
    }
};
tslib_1.__decorate([
    appolo.inject()
], DefineController.prototype, "manager5", void 0);
DefineController = tslib_1.__decorate([
    appolo.define()
], DefineController);
appolo.route('defineController')
    .path('/test/define/linq_object')
    .method(appolo.Methods.GET)
    .action(c => c.test)
    .validations('user_name', appolo.validator.string().required())
    .route(DefineController)
    .path('/test/define/linq')
    .action('test')
    .role("aaa")
    .validations({ 'user_name': appolo.validator.string().required() });
appolo.route('defineController')
    .path('/test/define/fluent_method')
    .method('get')
    .action(c => c.test)
    .validations('user_name', appolo.validator.string().required())
    .route('defineController')
    .path('/test/define/fluent')
    .action('test')
    .role("aaa")
    .validations({ 'user_name': appolo.validator.string().required() });
//# sourceMappingURL=defineController.js.map