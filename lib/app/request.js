"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const _ = require("lodash");
const typeis = require("type-is");
let proto = http.IncomingMessage.prototype;
proto.is = function (types) {
    return typeis.apply(typeis, [this].concat(_.toArray(arguments)));
};
proto.get = proto.header = function (name) {
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
function createRequest(request) {
    let req = request;
    return req;
}
exports.createRequest = createRequest;
//# sourceMappingURL=request.js.map