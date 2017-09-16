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

        res.cookie('cookie', 'hey',{expires:new Date(2317,9,16)});

        res.json((req as any).cookies);
    }

}
