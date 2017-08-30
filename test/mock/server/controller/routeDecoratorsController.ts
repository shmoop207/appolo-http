"use strict";
import appolo = require('../../../../index');
import {define, inject}  from '../../../../decorators';
import {Manager4} from "../manager/manager4";

@define()
class RouteDecoratorsController extends appolo.Controller {

    @inject() manager4: Manager4;

    test(req, res) {
        res.json({working: true, controllerName: this.route.controller, model: req.model, manager: this.manager4.name,name:req.params.name,name2:req.params.name2})
    }
}


appolo.route<RouteDecoratorsController>(RouteDecoratorsController)
    .path('/test/route/decorator/:name/:name2')
    .method('get')
    .action(c => c.test)
    .validations('user_name', appolo.validator.string().required())


