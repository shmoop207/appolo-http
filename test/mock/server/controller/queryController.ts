"use strict";
import appolo = require('../../../../index');

import {define, inject, path} from '../../../../decorators';


@define()
class QueryController extends appolo.Controller {

    @path("/test/query")
    test(req, res) {
        res.json(req.query);
    }

}
