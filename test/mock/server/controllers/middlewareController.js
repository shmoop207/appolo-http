"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
const middleware_1 = require("../middleware/middleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
let MiddlewareController = class MiddlewareController extends appolo.Controller {
    test(req, res) {
        res.json({ working: true });
    }
    fn(req, res) {
        res.json({ working: req.working });
    }
    testOrderMiddleware(req, res) {
        res.json({ working: req.working2 });
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], MiddlewareController.prototype, "manager", void 0);
tslib_1.__decorate([
    decorators_1.pathGet("/test/middleware/order"),
    decorators_1.middleware(function (req, res, next) {
        req.working = "working1";
        next();
    }),
    decorators_1.middleware(function (req, res, next) {
        (req).working2 = req.working + "working2";
        next();
    })
], MiddlewareController.prototype, "testOrderMiddleware", null);
MiddlewareController = tslib_1.__decorate([
    decorators_1.define()
], MiddlewareController);
appolo.route(MiddlewareController)
    .path('/test/middleware/function')
    .method('get')
    .action('fn')
    .middleware(function (req, res, next) {
    req.working = true;
    next();
});
appolo.route(MiddlewareController)
    .path('/test/middleware/objectId')
    .method('get')
    .action('test')
    .middleware('testMiddleware');
appolo.route(MiddlewareController)
    .path('/test/middleware/class')
    .method('get')
    .action('test')
    .middleware(middleware_1.TestMiddleware);
appolo.route(MiddlewareController)
    .path('/test/middleware/auth')
    .method('get')
    .action('test')
    .middleware(authMiddleware_1.AuthMiddleware);
//# sourceMappingURL=middlewareController.js.map