"use strict";
import appolo = require('../../../../index');

@appolo.define()
@appolo.singleton()
@appolo.lazy()
class DecoratorRouteController extends appolo.StaticController {
    @appolo.inject() manager: any;

    @appolo.path("/test/decorator/route/:name/:name2")
    @appolo.validation("name2", appolo.validator.string())
    @appolo.validation("name", appolo.validator.string())
    @appolo.validation("test", appolo.validator.string())
    public test(req:appolo.Request, res:appolo.Response) {
        res.json({model: DecoratorRouteController.getModel(req)})
    }


}






