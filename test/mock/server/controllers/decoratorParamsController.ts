"use strict";
import app = require('../../../../index');
import {Manager} from "../manager/manager";
import {UserMiddleware} from "../middleware/userMiddleware";
import set = Reflect.set;

@app.define()
@app.singleton()
@app.lazy()
class DecoratorParamsController extends app.StaticController {

   private name:string;

    constructor(@app.injectParam() manager:Manager) {
        super();

        this.name = manager.name
    }

    @app.inject() manager: any;

    @app.path("/test/decorator/param/:name/:name2")
    @app.validation("name2", app.validator.string())
    @app.validation("name", app.validator.string())
    @app.abstract({middleware:[UserMiddleware]})
    public test(req: app.IRequest, res: app.IResponse, route, aaa, @app.injectParam() env: any) {
        this.sendOk(res,{model: env.test,name:this.name,user:(req as any).user})
    }

    @app.path("/test/hello")
    public hello(req: app.IRequest, res: app.IResponse, route) {
        res.json({ hello: 'world' })
    }


}






