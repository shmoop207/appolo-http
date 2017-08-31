"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
let JsonController = class JsonController extends appolo.Controller {
    json(req, res) {
        res.gzip().json({ query: req.query });
    }
    jsonPost(req, res) {
        res.gzip().json({ body: req.body });
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], JsonController.prototype, "manager", void 0);
JsonController = tslib_1.__decorate([
    decorators_1.define()
], JsonController);
appolo.route(JsonController)
    .path('/test/json')
    .method('get')
    .action(c => c.json);
appolo.route(JsonController)
    .path('/test/json')
    .method('post')
    .action(c => c.jsonPost);
//# sourceMappingURL=jsonController.js.map