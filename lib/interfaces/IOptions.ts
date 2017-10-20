import appolo = require('appolo');

export interface IOptions extends appolo.IOptions {
    startMessage?: string,
    startServer?: boolean,
    root?: string
    port?: number,
    environment?: string
    paths?: string[]
    errorStack?: boolean
    errorMessage?: boolean
    maxRouteCache?: number
    bootStrapClassId?: string,
    qsParser?: "qs" | "querystring"
    urlParser?: "url" | "fast"
    viewFolder?: string
    viewEngine?: (path: string, options?: { cache?: boolean, [otherOptions: string]: any }) => Promise<string>;
    viewExt?: string
    ssl?: {
        key: string
        cert: string
    }
}