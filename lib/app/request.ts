import    http = require('http');
import    _ = require('lodash');
import {IRouteInnerOptions, IRouteOptions} from "../interfaces/IRouteOptions";
import {Url} from "url";
import typeis = require('type-is');


export interface Request extends http.IncomingMessage {
    query?: { [index: string]: any }
    body?: { [index: string]: any }
    params?: { [index: string]: any }
    model?: { [index: string]: any }
    $route?: IRouteInnerOptions
    urlParse?: Url
}


(http.IncomingMessage.prototype as any).is = function (types: string | string[]) {
    return typeis.apply(typeis, [this].concat(_.toArray(arguments)));
};

(http.IncomingMessage.prototype as any).get = (http.IncomingMessage.prototype as any).header = function (name: string) {

    let nameLower = name.toLowerCase();

    switch (nameLower) {
        case 'referer':
        case 'referrer':
            return this.headers.referrer
                || this.headers.referer;
        default:
            return this.headers[nameLower];
    }
};



