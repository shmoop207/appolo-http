"use strict";
import appolo = require('../../../../index');
import {Manager3} from "./manager3";
import {Manager2} from "./manager2";


export class BaseManager {
    @appolo.inject() logger: any;
    @appolo.inject() env: any

}
