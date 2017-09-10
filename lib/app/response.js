"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const zlib = require("zlib");
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
proto.set = proto.header = function (key, value) {
    this.setHeader(key, value);
    return this;
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
    if (this.useGzip) {
        gzipResponse(this, data);
        return;
    }
    let statusCode = this.statusCode || (this.statusCode = 200), isEmptyStatusCode = !!statusEmpty[statusCode], hasContentType = this.hasHeader("Content-Type"), isBuffer = Buffer.isBuffer(data);
    //send empty
    if (isEmptyStatusCode) {
        this.setHeader('Content-Length', '0');
        this.end();
        return;
    }
    if (data === undefined) {
        data = "";
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
    (this.req.method === 'HEAD') ? this.end() : this.end(data);
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