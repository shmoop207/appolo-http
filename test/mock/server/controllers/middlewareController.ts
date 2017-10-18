"use strict";
import appolo = require('../../../../index');
import {define, inject} from '../../../../decorators';
import {TestMiddleware} from "../middleware/middleware";
import {AuthMiddleware} from "../middleware/authMiddleware";

@define()
class MiddlewareController extends appolo.Controller {
    @inject() manager: any;

    test(req, res) {
        res.json({working: true})
    }

    fn(req, res) {
        res.json({working: req.working})
    }


}

appolo.route<MiddlewareController>(MiddlewareController)
    .path('/test/middleware/function')
    .method('get')
    .action('fn')
    .middleware(function (req, res, next) {
        (req as any).working = true
        next()
    });

appolo.route<MiddlewareController>(MiddlewareController)
    .path('/test/middleware/objectId')
    .method('get')
    .action('test')
    .middleware('testMiddleware');


appolo.route<MiddlewareController>(MiddlewareController)
    .path('/test/middleware/class')
    .method('get')
    .action('test')
    .middleware(TestMiddleware);

appolo.route<MiddlewareController>(MiddlewareController)
    .path('/test/middleware/auth')
    .method('get')
    .action('test')
    .middleware(AuthMiddleware);

