"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let QueryController = class QueryController extends appolo.Controller {
    test(req, res) {
        res.json(req.query);
    }
    cooker(req, res) {
        let date = new Date();
        date.setUTCFullYear(2100, 1, 1);
        date.setUTCHours(0, 0, 0, 0);
        res.cookie('cookie', 'hey', { expires: date });
        res.json(req.cookies);
    }
};
tslib_1.__decorate([
    decorators_1.path("/test/query")
], QueryController.prototype, "test", null);
tslib_1.__decorate([
    decorators_1.path("/test/cookie")
], QueryController.prototype, "cooker", null);
QueryController = tslib_1.__decorate([
    decorators_1.define()
], QueryController);
//# sourceMappingURL=queryController.js.map