"use strict";
import appolo = require('../../../../index');
import {define, inject} from '../../../../decorators';

@define()
class JsonController extends appolo.Controller {
    @inject() manager: any;

    json(req, res) {
        res.gzip().json({query: req.query})
    }

    jsonPost(req, res) {
        res.gzip().json({body: req.body})
    }

}

appolo.route<JsonController>(JsonController)
    .path('/test/json')
    .method('get')
    .action(c => c.json);

appolo.route<JsonController>(JsonController)
    .path('/test/json')
    .method('post')
    .action(c => c.jsonPost);