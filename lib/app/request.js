"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const _ = require("lodash");
const typeis = require("type-is");
http.IncomingMessage.prototype.is = function (types) {
    return typeis.apply(typeis, [this].concat(_.toArray(arguments)));
};
http.IncomingMessage.prototype.get = http.IncomingMessage.prototype.header = function (name) {
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
//# sourceMappingURL=request.js.map