"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let TestController = class TestController extends appolo.Controller {
    test(req, res) {
        res.json({ working: true });
    }
    validaion(req, res) {
        res.json(req.model);
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], TestController.prototype, "manager", void 0);
TestController = tslib_1.__decorate([
    decorators_1.define()
], TestController);
appolo.route(TestController).path('/test/').method('get').action('test').middleware(function (req, res, next) { next(); });
appolo.route(TestController).path('/test/middleware/').method('get').action('test').middleware('testMiddleware');
appolo.route(TestController).path('/test/validations/').method('get').action('validaion').validations({
    username: appolo.validator.string().alphanum().min(3).max(30).required(),
    password: appolo.validator.string().alphanum().min(3).max(30).required()
});
//# sourceMappingURL=testController.js.map