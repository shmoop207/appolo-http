"use strict";
import appolo = require('../../../../index');
import {define, inject} from '../../../../decorators';

@define()
class RouteLinqController extends appolo.Controller {

    test(req, res) {
        res.json({working: true, controllerName: this.route.controller, model: req.model})
    }
}


appolo.route<RouteLinqController>('routeLinqController')
    .path('/test/route/linq_object')
    .method('get')
    .action(c => c.test)
    .validations('user_name', appolo.validator.string().required())
    .route<RouteLinqController>('routeLinqController')

    .path('/test/route/linq')
    .action('test')
    .role("aaa")
    .validations({'user_name': appolo.validator.string().required()});


appolo.route<RouteLinqController>('routeLinqController')
    .path('/test/route/fluent_method')
    .method('get')
    .action(c => c.test)
    .validations('user_name', appolo.validator.string().required())
    .route<RouteLinqController>('routeLinqController')
    .path('/test/route/fluent')
    .action('test')
    .role("aaa")
    .validations({'user_name': appolo.validator.string().required()});

