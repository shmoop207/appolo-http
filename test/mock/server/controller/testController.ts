"use strict";
import appolo = require('../../../../index');
import {define, inject} from '../../../../decorators';
import {TestMiddleware} from "../middleware/middleware";

@define()
class TestController extends appolo.Controller {
    @inject() manager: any

    test(req, res) {
        res.json({working: true})
    }

    validaion(req, res) {
        res.json(req.model)
    }

    gzip(req, res) {
        res.gzip().json({working: true})
    }

}

appolo.route<TestController>(TestController)
    .path('/test/').method('get')
    .action('test')
    .middleware(function (req, res, next) {
        next()
    });

appolo.route<TestController>(TestController)
    .path('/test/middleware/')
    .method('get')
    .action('test')
    .middleware('testMiddleware')

appolo.route<TestController>(TestController).path('/test/validations/')
    .method('get')
    .action('validaion')
    .validations({
        username: appolo.validator.string().alphanum().min(3).max(30).required(),
        password: appolo.validator.string().alphanum().min(3).max(30).required()
    });

appolo.route<TestController>(TestController)
    .path('/test/middleware/class')
    .method('get')
    .action('test')
    .middleware(TestMiddleware)


appolo.route<TestController>(TestController)
    .path('/test/gzip')
    .method('get')
    .action(c => c.gzip)