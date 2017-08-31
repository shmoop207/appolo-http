"use strict";
import appolo = require('../../../../index');

import {define, inject} from '../../../../decorators';


@define()
class EnvController extends appolo.Controller {

    test(req, res) {
        res.json({working: true, controllerName: this.route.controller})
    }

}


appolo.route<EnvController>(EnvController)
.path("/test/env/not_in_env/")
.action(c=>c.test)
.environment("test");


appolo.route<EnvController>(EnvController)
    .path("/test/env/")
    .action(c=>c.test)
    .environment("testing");