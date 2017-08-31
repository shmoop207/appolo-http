import    http = require('http');
import    zlib = require('zlib');

import {Request} from "./request";

const statusEmpty = {
    204: true,
    205: true,
    304: true
};


export interface Response extends http.ServerResponse {
    req: Request
    useGzip: boolean;

    status(code: number): Response

    contentType(type: string): Response

    header(key: string, value: string): Response

    json(obj: object)

    send(data?: string | Buffer)

    gzip(): Response

}

export let response = <Partial<Response>>{

    status(code: number): Response {
        this.statusCode = code;
        return this
    },

    contentType(type: string): Response {
        this.setHeader("Content-Type", type);
        return this;
    },

    json(obj: object) {

        this.setHeader('Content-Type', "application/json; charset=utf-8");


        this.send(JSON.stringify(obj))


    },
    header(key: string, value: string): Response {
        this.setHeader(key, value);
        return this
    },

    gzip(): Response {
        this.useGzip = true;
        return this;
    },

    send(data?: string | Buffer) {

        if (this.useGzip) {
            gzipResponse(this, data);
            return;
        }

        let  statusCode = this.statusCode || (this.statusCode = 200),
            isEmptyStatusCode = !!statusEmpty[statusCode],
            hasContentType = this.getHeader("Content-Type"), isBuffer = Buffer.isBuffer(data);

        //send empty
        if (isEmptyStatusCode) {
            this.setHeader('Content-Length', '0');
            this.end();
            return
        }

        if (data === undefined) {
            data = "";
        }

        if (!hasContentType) {
            if (typeof data === 'string' || this.getHeader("Content-Encoding") == "gzip") {
                this.setHeader("Content-Type", "text/plain;charset=utf-8");
            } else if (isBuffer) {
                this.setHeader("Content-Type", "application/octet-stream");
            } else {
                data = JSON.stringify(data);
                this.setHeader("Content-Type", "application/json; charset=utf-8");
            }
        }

        this.setHeader('Content-Length', isBuffer ? data.length : Buffer.byteLength(data as string, 'utf8'));

        (this.req.method === 'HEAD') ? this.end() : this.end(data);
    }
};

function gzipResponse(res: Response, data: any) {
    zlib.gzip(data, (err, gziped) => {
        res.useGzip = false;

        if (err) {
            res.send(data);
            return;
        }

        res.setHeader('Content-Encoding', "gzip");
        res.send(gziped)
    });
}

export let ResponseKeys = Object.keys(response);

