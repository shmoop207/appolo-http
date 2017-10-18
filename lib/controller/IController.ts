import {IRequest} from "../app/request";
import {IResponse} from "../app/response";
import {NextFn} from "../app/app";
import {IRouteInnerOptions, IRouteOptions} from "../interfaces/IRouteOptions";

export interface IController{

}

export interface IControllerCtr {
    new (...args: any[]): IController
}