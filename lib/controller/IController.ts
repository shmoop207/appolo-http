import {Request} from "../app/request";
import {Response} from "../app/response";
import {NextFn} from "../app/app";
import {IRouteOptions} from "../interfaces/IRouteOptions";

export interface IController{
    invoke(req: Request, res: Response, next: NextFn,route: IRouteOptions, action: string | ((c: IController)=>Function))
}

export interface IControllerCtr {
    new (...args: any[]): IController
}