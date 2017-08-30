"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let RouteLinqController = class RouteLinqController extends appolo.Controller {
    test(req, res) {
        res.json({ working: true, controllerName: this.route.controller, model: req.model });
    }
};
RouteLinqController = tslib_1.__decorate([
    decorators_1.define()
], RouteLinqController);
appolo.route('routeLinqController')
    .path('/test/route/linq_object')
    .method('get')
    .action(c => c.test)
    .validations('user_name', appolo.validator.string().required())
    .route('routeLinqController')
    .path('/test/route/linq')
    .action('test')
    .role("aaa")
    .validations({ 'user_name': appolo.validator.string().required() });
appolo.route('routeLinqController')
    .path('/test/route/fluent_method')
    .method('get')
    .action(c => c.test)
    .validations('user_name', appolo.validator.string().required())
    .route('routeLinqController')
    .path('/test/route/fluent')
    .action('test')
    .role("aaa")
    .validations({ 'user_name': appolo.validator.string().required() });
//# sourceMappingURL=routeLinqController.js.map