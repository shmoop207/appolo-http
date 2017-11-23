"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const zlib = require("zlib");
const cookie = require("cookie");
const _ = require("lodash");
const view_1 = require("../app/view");
const statusEmpty = {
    204: true,
    205: true,
    304: true
};
let proto = http.ServerResponse.prototype;
proto.status = function (code) {
    this.statusCode = code;
    return this;
};
proto.contentType = function (type) {
    this.setHeader("Content-Type", type);
    return this;
};
proto.json = function (obj) {
    this.setHeader('Content-Type', "application/json; charset=utf-8");
    this.send(JSON.stringify(obj));
};
proto.render = function (path, params) {
    if (arguments.length == 1 && typeof path !== "string") {
        params = path;
        path = "";
    }
    if (!this.hasHeader("Content-Type")) {
        this.setHeader("Content-Type", "text/html;charset=utf-8");
    }
    view_1.default.render(this.req.$route.route.controllerName, this.req.$route.route.actionName, path, params)
        .then((str) => this.send(str))
        .catch((e) => this.req.next(e));
};
proto.set = proto.header = function (field, value) {
    if (arguments.length === 2) {
        this.setHeader(field, value);
    }
    else {
        let keys = Object.keys(field);
        for (let i = 0, length = keys.length; i < length; i++) {
            let key = keys[i];
            this.setHeader(key, field[key]);
        }
    }
    return this;
};
proto.cookie = function (name, value, options) {
    let opts = options || {};
    let val = _.isObject(value) ? 'j:' + JSON.stringify(value) : String(value);
    if ('maxAge' in opts) {
        opts.expires = new Date(Date.now() + opts.maxAge);
        opts.maxAge /= 1000;
    }
    if (opts.path == null) {
        opts.path = '/';
    }
    this.append('Set-Cookie', cookie.serialize(name, val, opts));
    return this;
};
proto.get = function (field) {
    return this.getHeader(field);
};
proto.append = function (field, value) {
    let current = this.getHeader(field);
    if (!current) {
        return this.setHeader(field, value);
    }
    let val = _.isArray(current)
        ? current.concat(value)
        : (_.isArray(value) ? [current].concat(value) : [current, value]);
    return this.setHeader(field, val);
};
proto.gzip = function () {
    this.useGzip = true;
    return this;
};
proto.jsonp = function (data) {
    let body = data;
    if (this.method == "GET" && this.query["callback"]) {
        if (!this.getHeader('Content-Type')) {
            this.setHeader('X-Content-Type-Options', 'nosniff');
            this.setHeader('Content-Type', 'application/json');
        }
        let callback = this.query["callback"].replace(/[^\[\]\w$.]/g, '');
        let body = JSON.stringify(data)
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029');
        body = `/**/ typeof ${callback} === 'function' && ${callback}(${body});`;
    }
    this.send(body);
};
proto.send = function (data) {
    //check if need to gzip
    if (this.useGzip) {
        gzipResponse(this, data);
        return;
    }
    let statusCode = this.statusCode || (this.statusCode = 200), isEmptyStatusCode = !!statusEmpty[statusCode], hasContentType = this.hasHeader("Content-Type"), isBuffer = Buffer.isBuffer(data);
    //send empty
    if (isEmptyStatusCode || data == undefined) {
        this.setHeader('Content-Length', '0');
        setImmediate(() => this.end());
        return;
    }
    if (!hasContentType) {
        if (typeof data === 'string' || this.getHeader("Content-Encoding") == "gzip") {
            this.setHeader("Content-Type", "text/plain;charset=utf-8");
        }
        else if (isBuffer) {
            this.setHeader("Content-Type", "application/octet-stream");
        }
        else {
            data = JSON.stringify(data);
            this.setHeader("Content-Type", "application/json; charset=utf-8");
        }
    }
    this.setHeader('Content-Length', isBuffer ? data.length : Buffer.byteLength(data, 'utf8'));
    setImmediate(() => this.req.method === 'HEAD' ? this.end() : this.end(data));
};
function gzipResponse(res, data) {
    zlib.gzip(data, (err, gziped) => {
        res.useGzip = false;
        if (err) {
            res.send(data);
            return;
        }
        res.setHeader('Content-Encoding', "gzip");
        res.send(gziped);
    });
}
function createResponse(request, response) {
    let res = response;
    res.req = request;
    return res;
}
exports.createResponse = createResponse;
//# sourceMappingURL=response.js.map