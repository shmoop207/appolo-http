import {Request} from "../app/request";
import {Response} from "../app/response";
import {NextFn} from "../app/app";
import {IRouteInnerOptions, IRouteOptions} from "../interfaces/IRouteOptions";

export interface IController{
    invoke(req: Request, res: Response,route: IRouteInnerOptions, action: string | ((c: IController)=>Function))
}

export interface IControllerCtr {
    new (...args: any[]): IController
}