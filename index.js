"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const launcher_1 = require("./lib/launcher/launcher");
var appolo_1 = require("appolo");
exports.EventDispatcher = appolo_1.EventDispatcher;
exports.Util = appolo_1.Util;
exports.module = appolo_1.module;
exports.inject = appolo_1.inject;
exports.loader = appolo_1.loader;
exports.environment = appolo_1.environment;
exports.use = appolo_1.use;
exports.Injector = appolo_1.Injector;
var define_1 = require("./lib/define/define");
exports.Define = define_1.Define;
var defineFn_1 = require("./lib/define/defineFn");
exports.define = defineFn_1.define;
var route_1 = require("./lib/routes/route");
exports.route = route_1.default;
exports.Route = route_1.Route;
var controller_1 = require("./lib/controller/controller");
exports.Controller = controller_1.Controller;
var staticController_1 = require("./lib/controller/staticController");
exports.StaticController = staticController_1.StaticController;
var middleware_1 = require("./lib/middleware/middleware");
exports.Middleware = middleware_1.Middleware;
var router_1 = require("./lib/routes/router");
exports.router = router_1.default;
exports.Router = router_1.Router;
var launcher_2 = require("./lib/launcher/launcher");
exports.launcher = launcher_2.default;
exports.validator = require("joi");
var app_1 = require("./lib/app/app");
exports.App = app_1.App;
exports.launch = function (config, callback) {
    return launcher_1.default.launch(config, callback);
};
//# sourceMappingURL=index.js.map