"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo = require("../../../../index");
class Controller extends appolo.Controller {
    test(req, res) {
        res.json({ working: true, controllerName: this.route.controller, model: req.model });
    }
}
appolo.define('testRouteController').type(Controller);
appolo.route('testRouteController')
    .path("/test/route/")
    .action(c => c.test)
    .validation('user_name', appolo.validator.string().required());
//# sourceMappingURL=routeController.js.map