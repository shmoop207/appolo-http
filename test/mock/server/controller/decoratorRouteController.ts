"use strict";
import app = require('../../../../index');

@app.define()
@app.singleton()
@app.lazy()
class DecoratorRouteController extends app.StaticController {

    @app.inject() manager: any;

    @app.path("/test/decorator/route/:name/:name2")
    @app.validation("name2", app.validator.string())
    @app.validation("name", app.validator.string())
    @app.validation("test", app.validator.string())
    public test(req: app.IRequest, res: app.IResponse) {
        res.json({model: DecoratorRouteController.getModel(req)})
    }


    @app.path("/test/decorator2/route/:name/:name2")
    @app.validation("name2", app.validator.string())
    @app.validation("name", app.validator.string())
    @app.validation("test", app.validator.string())
    public test2(req: app.IRequest, res: app.IResponse) {
        res.json({model: DecoratorRouteController.getModel(req)})
    }

}






