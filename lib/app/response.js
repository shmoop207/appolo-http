"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zlib = require("zlib");
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
    gzip() {
        this.useGzip = true;
        return this;
    },
    send(data) {
        if (this.useGzip) {
            gzipResponse(this, data);
            return;
        }
        let contentType, statusCode = this.statusCode || (this.statusCode = 200), isEmptyStatusCode = !!statusEmpty[statusCode], hasContentType = this.getHeader("Content-Type"), isBuffer = Buffer.isBuffer(data);
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
    }
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
exports.ResponseKeys = Object.keys(exports.response);
//# sourceMappingURL=response.js.map