"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let QueryController = class QueryController extends appolo.Controller {
    test(req, res) {
        res.json(req.query);
    }
};
tslib_1.__decorate([
    decorators_1.path("/test/query")
], QueryController.prototype, "test", null);
QueryController = tslib_1.__decorate([
    decorators_1.define()
], QueryController);
//# sourceMappingURL=queryController.js.map