"use strict";
import appolo = require('../../../../index');
import {define, inject} from '../../../../decorators';

@define()
class DefineController extends appolo.Controller {

    test(req, res) {
        res.json({working: true, controllerName: this.route.controller, model: req.model})
    }
}


appolo.route<DefineController>('defineController')
    .path('/test/define/linq_object')
    .method('get')
    .action(c => c.test)
    .validations('user_name', appolo.validator.string().required())
    .route<DefineController>(DefineController)

    .path('/test/define/linq')
    .action('test')
    .role("aaa")
    .validations({'user_name': appolo.validator.string().required()});


appolo.route<DefineController>('defineController')
    .path('/test/define/fluent_method')
    .method('get')
    .action(c => c.test)
    .validations('user_name', appolo.validator.string().required())
    .route<DefineController>('defineController')
    .path('/test/define/fluent')
    .action('test')
    .role("aaa")
    .validations({'user_name': appolo.validator.string().required()});

