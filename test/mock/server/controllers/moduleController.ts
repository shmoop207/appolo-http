"use strict";
import appolo = require('../../../../index');
import {IDefinition} from "../../../../lib/interfaces/IDefinition";


export class ModuleController extends appolo.Controller {
    logger2: any;
    logger3: any;

    test(req, res) {
        res.json({
            working: true,
            controllerName: this.route.controller,
            logger: this.logger2.getName() + this.logger3.getName()
        })
    }

}

appolo.register('moduleController', ModuleController)
    .inject("logger2")
    .inject("logger3");


appolo.route('moduleController')
    .path("/test/module/")
    .action("test");
