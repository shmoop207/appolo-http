"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const _ = require("lodash");
const url_1 = require("url");
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
defineGetter(proto, 'protocol', function () {
    let protocol = this.connection.encrypted
        ? 'https'
        : 'http';
    let header = this.headers['x-forwarded-proto'] || protocol;
    let headerArr = header.split(',');
    return headerArr[0].trim();
});
defineGetter(proto, 'secure', function () {
    return this.protocol === 'https';
});
defineGetter(proto, 'path', function () {
    return url_1.parse(this.url).pathname;
});
defineGetter(proto, 'hostname', function () {
    let host = this.headers['x-forwarded-host'];
    if (!host) {
        host = this.headers['host'];
    }
    if (!host) {
        return "";
    }
    return host.split(",")[0].trim();
});
function defineGetter(obj, name, getter) {
    Object.defineProperty(obj, name, {
        configurable: true,
        enumerable: true,
        get: getter
    });
}
function createRequest(request) {
    let req = request;
    return req;
}
exports.createRequest = createRequest;
//# sourceMappingURL=request.js.map