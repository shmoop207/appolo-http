"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app = require("../../../../index");
let IndexController = class IndexController extends app.StaticController {
    hello(req, res, route) {
        res.json({ hello: 'world' });
    }
};
tslib_1.__decorate([
    app.path("/test/")
], IndexController.prototype, "hello", null);
IndexController = tslib_1.__decorate([
    app.define(),
    app.singleton()
], IndexController);
exports.IndexController = IndexController;
//# sourceMappingURL=indexController.js.map