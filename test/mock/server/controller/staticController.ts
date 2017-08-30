"use strict";
import appolo = require('../../../../index');
import {define, inject, singleton, lazy} from '../../../../decorators';

@define()
@singleton()
@lazy()
class StaticController extends appolo.StaticController {
    @inject() manager: any

    test(req, res) {
        res.json({model: this.getModel(req)})
    }


}

appolo.route<StaticController>(StaticController)
    .path('/test/static/controller/:name')
    .method('get')
    .action('test')
    .validation("test", appolo.validator.string())
    .validation("name", appolo.validator.string())

appolo.route<StaticController>(StaticController)
    .path('/test/static/controller/:name/post')
    .method('post')
    .action('test')
    .validation("test", appolo.validator.string())
    .validation("name", appolo.validator.string())
    .validation("testPost", appolo.validator.boolean().required())



