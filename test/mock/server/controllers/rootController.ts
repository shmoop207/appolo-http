"use strict";
import appolo = require('../../../../index');
import {define, inject,pathGet} from '../../../../decorators';

@define()
export class RootController extends appolo.StaticController {

    all(req, res,route) {
        res.json({name: route.actionName})
    }

    root(req, res,route) {
        res.json({name: route.actionName})
    }
    @pathGet("/raw")
    raw(req, res,route) {
        res.end(route.actionName)
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
