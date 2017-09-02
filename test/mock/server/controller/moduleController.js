"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo = require("../../../../index");
class ModuleController extends appolo.Controller {
    test(req, res) {
        res.json({ working: true, controllerName: this.route.controller, logger: this.logger2.getName() });
    }
}
exports.ModuleController = ModuleController;
appolo.register('moduleController', ModuleController)
    .inject("logger2");
appolo.route('moduleController')
    .path("/test/module/")
    .action("test");
//# sourceMappingURL=moduleController.js.map