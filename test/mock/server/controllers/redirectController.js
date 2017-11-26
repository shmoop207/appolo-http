"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let RedirectController = class RedirectController extends appolo.StaticController {
    redirect(req, res) {
        res.redirect("/test/redirectTo");
    }
    redirectTo(req, res, route) {
        res.json({ name: route.actionName });
    }
};
tslib_1.__decorate([
    decorators_1.pathGet("/test/redirect")
], RedirectController.prototype, "redirect", null);
tslib_1.__decorate([
    decorators_1.pathGet("/test/redirectTo")
], RedirectController.prototype, "redirectTo", null);
RedirectController = tslib_1.__decorate([
    decorators_1.define()
], RedirectController);
exports.RedirectController = RedirectController;
//# sourceMappingURL=redirectController.js.map