"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("../../../../decorators");
const manager7_1 = require("./manager7");
let Manager8 = class Manager8 extends manager7_1.Manager7 {
    get name() {
        return this.constructor.name;
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], Manager8.prototype, "manager6", void 0);
Manager8 = tslib_1.__decorate([
    decorators_1.define(),
    decorators_1.singleton()
], Manager8);
exports.Manager8 = Manager8;
//# sourceMappingURL=manager8.js.map