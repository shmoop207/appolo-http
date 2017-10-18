"use strict";
import appolo = require('../../../../index');
import {define, inject} from '../../../../decorators';
import {Manager4} from "../manager/manager4";

@define()
export class ParamsController extends appolo.Controller {

    @inject() manager4: Manager4;

    test(req, res) {
        res.json({
            working: true,
            controllerName: this.route.controller,
            model: req.model,
            manager: this.manager4.name,
            name: req.params.name,
            name2: req.params.name2
        })
    }

    empty(req, res) {
        this.sendNoContent()
    }
}


appolo.route<ParamsController>(ParamsController)
    .path('/test/params/:name/:name2')
    .method('get')
    .action(c => c.test)
    .validations('user_name', appolo.validator.string().required());

appolo.route<ParamsController>(ParamsController)
    .path('/test/params/:name/test/:name2')
    .method('get')
    .action(c => c.test)
    .validations('user_name', appolo.validator.string().required());

appolo.route<ParamsController>(ParamsController)
    .path('/test/params/empty/:name/:name2')
    .method('get')
    .action(c => c.empty)
    .validations('user_name', appolo.validator.string().required());


