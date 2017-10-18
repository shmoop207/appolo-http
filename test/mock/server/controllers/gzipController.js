"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("../../../../index");
const decorators_1 = require("../../../../decorators");
const compression = require("compression");
let GzipController = class GzipController extends appolo.Controller {
    gzip(req, res) {
        res.gzip().json({ working: true });
    }
    compression(req, res) {
        res.json({ working: "dsadasnfkjdshfdhsfdgnfdkjgjfdbgjhbdjhbgjhfdbgbdfjhbgbdfbgjdsbgjbdjkhfgbkdfgkfiuthrehilhvbcdbvdsbjhbdsjfbjdsbfbdsbfhjdbfjhbdjsbfjdbfbdsafbjhdbsfjhgndfkgjlkdjgljdlsfjldksjflkdjsflkjdslkjfdjslfjdlksjfldsjlkfjdslkjflkdsjfljdslfjdsiroeiwrioewrejwcnvcnxvkjnckxjbkdbgkdskfdskfkdsfdsnfjdnsfldskfnkdsajfdksjnfjdksnfkjdsahfkjdhsfkdhsfkjhdksfhkjdsadbvcxmnvbdsbjhbdsjhfbdsbfhdfihiuhriehriuhewiuhshkbfkdshfkdksfhdsiuhfudshfdhskfhdkshfkdshfkhdsiufhdisuhfksgkdfhgkhdjkgdjhsgfjhsdjkfgsjkgfjhgdsakfgdjshgfjkdsgjfgsdjhgfdgjfgsdjhgfhjdsghjfgdshfjdhsjkfhkdsjhfkdhskfhkdshfjgdshhjfgdjshfvdsbcn sdmnvchjdsvfhsahjbfjhsdfbdsjbfjhdsb" });
    }
};
tslib_1.__decorate([
    decorators_1.inject()
], GzipController.prototype, "manager", void 0);
tslib_1.__decorate([
    decorators_1.pathGet('/test/compression'),
    decorators_1.middleware(compression({ threshold: 512 }))
], GzipController.prototype, "compression", null);
GzipController = tslib_1.__decorate([
    decorators_1.define()
], GzipController);
appolo.route(GzipController)
    .path('/test/gzip')
    .method('get')
    .action(c => c.gzip);
//# sourceMappingURL=gzipController.js.map