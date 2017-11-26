"use strict";
import appolo = require('../../../../index');
import {define, inject,pathGet} from '../../../../decorators';

@define()
export class RedirectController extends appolo.StaticController {

    @pathGet("/test/redirect")
    redirect(req:appolo.IRequest, res:appolo.IResponse) {
        res.redirect("/test/redirectTo");
    }
    @pathGet("/test/redirectTo")
    redirectTo(req, res,route) {
        res.json({name: route.actionName})
    }
}