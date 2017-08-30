import    http = require('http');
import {Request} from "./request";

const statusEmpty = {
    204: true,
    205: true,
    304: true
};


export interface Response extends http.ServerResponse {
    req: Request

    status(code: number): Response

    contentType(type: string): Response

    header(key: string, value: string): Response

    json(obj: object)

    send(data?: string | Buffer)

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

    send(data?: string | Buffer) {
        let contentType: string, len: number, statusCode = this.statusCode,
            isEmptyStatusCode = !!statusEmpty[statusCode],
            hasContentType = this.getHeader("Content-Type");

        if (data === undefined) {
            data = "";
        }

        if (typeof data === 'string') {

            contentType = "text/plain;charset=utf-8";

            len = Buffer.byteLength(data, 'utf8');

        } else if (Buffer.isBuffer(data)) {
            contentType = "application/octet-stream";

            len = data.length;

        } else {
            data = JSON.stringify(data);

            contentType = "application/json; charset=utf-8";

            len = Buffer.byteLength(data, 'utf8');
        }

        if (isEmptyStatusCode) {
            this.setHeader('Content-Length', '0');
            this.end();
            return
        }

        if (!hasContentType) {
            this.setHeader("Content-Type", contentType);
        }

        this.setHeader('Content-Length', len);


        (this.req.method === 'HEAD') ? this.end() : this.end(data);


    }
}

export let ResponseKeys = Object.keys(response);

