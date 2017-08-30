"use strict";
import appolo = require('../../../../index');
import {IDefinition} from "../../../../lib/interfaces/IDefinition";


export class Controller extends appolo.Controller {
    logger2: any

    test(req, res) {
        res.json({working: true, controllerName: this.route.controller, logger: this.logger2.getName()})
    }

}

appolo.define('moduleController', Controller).inject("logger2");


appolo.route('moduleController').path("/test/module/").action("test")
