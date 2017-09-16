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

        res.cookie('cookie', 'hey',{expires:new Date(new Date(2100,9,16,12,0).getTime())});

        res.json((req as any).cookies);
    }

}
