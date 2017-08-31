"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let GzipController = class GzipController extends appolo.Controller {
    gzip(req, res) {
        res.gzip().json({ working: true });
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], GzipController.prototype, "manager", void 0);
GzipController = tslib_1.__decorate([
    decorators_1.define()
], GzipController);
appolo.route(GzipController)
    .path('/test/gzip')
    .method('get')
    .action(c => c.gzip);
//# sourceMappingURL=gzipController.js.map