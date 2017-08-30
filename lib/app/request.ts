import    http = require('http');
import {IRouteOptions} from "../interfaces/IRouteOptions";
import {Url} from "url";


export interface Request extends http.IncomingMessage{
    query?:{[index:string]:any}
    params?:{[index:string]:any}
    model?:{[index:string]:any}
    $route?:IRouteOptions
    urlParse?:Url
}

export let request = <Partial<Request>>{


};

export let RequestKeys = Object.keys(request);


