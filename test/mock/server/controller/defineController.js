"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let DefineController = class DefineController extends appolo.Controller {
    test(req, res) {
        res.json({ working: true, controllerName: this.route.controller, model: req.model });
    }
};
DefineController = tslib_1.__decorate([
    decorators_1.define()
], DefineController);
appolo.route('defineController')
    .path('/test/define/linq_object')
    .method('get')
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