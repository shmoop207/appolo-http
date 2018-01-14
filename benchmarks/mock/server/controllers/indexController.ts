"use strict";
import app = require('../../../../index');

@app.define()
@app.singleton()
export class IndexController extends app.StaticController {

    @app.path("/test/")
    public hello(req: app.IRequest, res: app.IResponse, route) {
        res.send('hello world')
    }
}






