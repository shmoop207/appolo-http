"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai = require("chai");
const appolo = require("../../index");
let should = chai.should();
describe('Appolo Express Unit', () => {
    describe("basic test", () => {
        beforeEach(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return appolo.launcher.launch({
                paths: ['config', 'server'],
                environment: "testing",
                root: process.cwd() + '/test/mock',
                port: 8183
            });
        }));
        afterEach(() => {
            appolo.launcher.reset();
        });
        it("should have app", () => {
            let app = appolo.injector.getObject('app');
            should.exist(app);
            should.exist(appolo.launcher.handleRequest);
        });
        it("should have managers", () => {
            let manager = appolo.container.getObject('manager');
            should.exist(manager);
            should.exist(manager.manager2);
            should.exist(manager.manager3);
            should.exist(manager.manager3.manager2);
        });
        it("should have manager with inherit inherit", () => {
            let manager = appolo.container.getObject('manager4');
            should.exist(manager);
            should.exist(manager.env);
            should.exist(manager.logger);
            manager.env.test.should.be.eq("testing");
        });
        it("should have manager statics", function () {
            let manager = appolo.container.getObject('manager3');
            manager.TEST.should.be.eq(1);
        });
        it("should have manager singleton", function () {
            let manager = appolo.container.getObject('manager4');
            let manager2 = appolo.container.getObject('manager4');
            (manager === manager2).should.be.ok;
        });
        it("should have manager namespace", function () {
            should.exist(global.TEST.Manager3);
        });
        it("should have valid env", function () {
            let env = appolo.container.getObject('env');
            (env === appolo.environment).should.be.ok;
            env.type.should.be.eq("testing");
        });
    });
});
//# sourceMappingURL=unitSpec.js.map