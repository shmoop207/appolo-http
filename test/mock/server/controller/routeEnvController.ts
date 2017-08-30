"use strict";
import appolo = require('../../../../index');

import {define, inject} from '../../../../decorators';


@define()
class RouteEnvController extends appolo.Controller {

    test(req, res) {
        res.json({working: true, controllerName: this.route.controller})
    }

}


appolo.route<RouteEnvController>(RouteEnvController)
.path("/test/route/not_in_env/")
.action(c=>c.test)
.environment("test")


appolo.route<RouteEnvController>(RouteEnvController)
    .path("/test/route/env/")
    .action(c=>c.test)
    .environment("testing")