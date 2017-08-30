"use strict";
import appolo = require('../../../../index');
import {define, inject}  from '../../../../decorators';

@define()
class TestController extends appolo.Controller {
        @inject() manager:any

    test(req, res) {
        res.json({working: true})
    }

    validaion(req, res) {
        res.json(req.model)
    }

}

appolo.route<TestController>(TestController).path('/test/').method('get').action('test').middleware(function(req,res,next){next()})
appolo.route<TestController>(TestController).path('/test/middleware/').method('get').action('test').middleware('testMiddleware')
appolo.route<TestController>(TestController).path('/test/validations/').method('get').action('validaion').validations({
    username: appolo.validator.string().alphanum().min(3).max(30).required(),
    password: appolo.validator.string().alphanum().min(3).max(30).required()
})
