"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const appolo_1 = require("appolo");
const appolo = require("appolo");
class Register extends appolo_1.Define {
}
exports.Register = Register;
function register($config, klass) {
    if (_.isString($config) || _.isFunction($config)) {
        return new Register($config, klass);
    }
    appolo.define($config, klass);
}
exports.register = register;
//# sourceMappingURL=register.js.map