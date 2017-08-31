"use strict";
import appolo = require('../../../../index');
import {define, inject} from '../../../../decorators';

@define()
export class RootController extends appolo.Controller {

    all(req, res) {
        res.json({name: this.route.actionName})
    }

    root(req, res) {
        res.json({name: this.route.actionName})
    }

}


//
// appolo.route<RouteStaticController>(RouteStaticController)
//     .path("*")
//     .method("get")
//     .action(c => c.all)

appolo.route<RootController>(RootController)
    .path("/")
    .method("get")
    .action(c => c.root)
