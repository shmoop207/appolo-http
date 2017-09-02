"use strict";
import appolo = require('../../../../index');
import {define,singleton,inject,lazy}  from '../../../../decorators' ;
import {Manager3} from "./manager3";
import {IHandler} from "../handlers/IHandler";
import _ =require('lodash')



@define()
@singleton()
@lazy()
export class Manager5 {

    @inject() manager3:Manager3
    @appolo.injectAlias("IHandler") handlers:IHandler[]

    public get name():string{
        return this.constructor.name + _.sumBy(this.handlers,h=>h.handle()).toString()
    }
}

