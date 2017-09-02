import appolo = require('../../../../index');
import {IHandler} from "./IHandler";

@appolo.define()
@appolo.singleton()
@appolo.alias("IHandler")
export class Handler2 implements IHandler{
    public handle(){
        return 2
    }
}