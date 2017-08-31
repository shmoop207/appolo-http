"use strict";
import appolo = require('../../../../index');
import {define, inject} from '../../../../decorators';
import {TestMiddleware} from "../middleware/middleware";
import {AuthMiddleware} from "../middleware/authMiddleware";

@define()
class GzipController extends appolo.Controller {
    @inject() manager: any;

    gzip(req, res) {
        res.gzip().json({working: true})
    }

}

appolo.route<GzipController>(GzipController)
    .path('/test/gzip')
    .method('get')
    .action(c => c.gzip);