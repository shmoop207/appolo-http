"use strict";
import appolo = require('../../../../index');

import {define, inject, path} from '../../../../decorators';


@define()
class QueryController extends appolo.Controller {

    @path("/test/query")
    test(req, res) {
        res.json(req.query);
    }

    @path("/test/cookie")
    cooker(req:appolo.IRequest, res:appolo.IResponse) {

        let date = new Date()
        date.setUTCFullYear(2100,1,1)
        date.setUTCHours(0,0,0,0)
        res.cookie('cookie', 'hey',{expires:date});

        res.json((req as any).cookies);
    }

}
