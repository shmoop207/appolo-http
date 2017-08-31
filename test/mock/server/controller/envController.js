"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let EnvController = class EnvController extends appolo.Controller {
    test(req, res) {
        res.json({ working: true, controllerName: this.route.controller });
    }
};
EnvController = tslib_1.__decorate([
    decorators_1.define()
], EnvController);
appolo.route(EnvController)
    .path("/test/env/not_in_env/")
    .action(c => c.test)
    .environment("test");
appolo.route(EnvController)
    .path("/test/env/")
    .action(c => c.test)
    .environment("testing");
//# sourceMappingURL=envController.js.map