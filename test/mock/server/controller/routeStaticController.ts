"use strict";
import appolo = require('../../../../index');
import {define, inject} from '../../../../decorators';

@define()
class RouteStaticController extends appolo.Controller {


    test(req, res) {
        res.json({working: true, controllerName: this.route.controller, model: req.model})
    }

    all(req, res) {
        res.json({name: this.route.actionName})
    }

    root(req, res) {
        res.json({name: this.route.actionName})
    }

}

appolo.route<RouteStaticController>(RouteStaticController)
    .path("/test/route/static")
    .method("get")
    .action(c => c.test)
    .validation("user_name",appolo.validator.string().required())



//
// appolo.route<RouteStaticController>(RouteStaticController)
//     .path("*")
//     .method("get")
//     .action(c => c.all)

appolo.route<RouteStaticController>(RouteStaticController)
    .path("/")
    .method("get")
    .action(c => c.root)
