"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusEmpty = {
    204: true,
    205: true,
    304: true
};
exports.response = {
    status(code) {
        this.statusCode = code;
        return this;
    },
    contentType(type) {
        this.setHeader("Content-Type", type);
        return this;
    },
    json(obj) {
        this.setHeader('Content-Type', "application/json; charset=utf-8");
        this.send(JSON.stringify(obj));
    },
    header(key, value) {
        this.setHeader(key, value);
        return this;
    },
    send(data) {
        let contentType, len, statusCode = this.statusCode, isEmptyStatusCode = !!statusEmpty[statusCode], hasContentType = this.getHeader("Content-Type");
        if (data === undefined) {
            data = "";
        }
        if (typeof data === 'string') {
            contentType = "text/plain;charset=utf-8";
            len = Buffer.byteLength(data, 'utf8');
        }
        else if (Buffer.isBuffer(data)) {
            contentType = "application/octet-stream";
            len = data.length;
        }
        else {
            data = JSON.stringify(data);
            contentType = "application/json; charset=utf-8";
            len = Buffer.byteLength(data, 'utf8');
        }
        if (isEmptyStatusCode) {
            this.setHeader('Content-Length', '0');
            this.end();
            return;
        }
        if (!hasContentType) {
            this.setHeader("Content-Type", contentType);
        }
        this.setHeader('Content-Length', len);
        (this.req.method === 'HEAD') ? this.end() : this.end(data);
    }
};
exports.ResponseKeys = Object.keys(exports.response);
//# sourceMappingURL=response.js.map