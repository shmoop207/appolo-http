"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const appolo = require("../../index");
let should = chai.should();
describe('Appolo Express Unit', () => {
    describe("basic test", () => {
        beforeEach(async () => {
            return appolo.launcher.launch({
                paths: ['config', 'server'],
                environment: "testing",
                root: process.cwd() + '/test/mock',
                port: 8183
            });
        });
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
        it("should have manager with inherit", () => {
            let manager = appolo.container.getObject('manager4');
            should.exist(manager);
            should.exist(manager.env);
            should.exist(manager.logger);
            should.not.exist(manager.manager4);
            manager.env.test.should.be.eq("testing");
        });
        it("should have manager with valid inherit ", () => {
            let manager = appolo.container.getObject('manager6');
            should.exist(manager);
            should.exist(manager.env);
            should.exist(manager.logger);
            manager.env.test.should.be.eq("testing");
            should.not.exist(manager.manager3);
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
// import Benchmark = require('benchmark');
// import qs = require('qs');
//
// let suite = new Benchmark.Suite;
// suite.
// add('vanilla', function() {
//     Util.parseQsFast("aa[]=bb&aa[]=cc&a=1&b=2&c=3&c=3&ss=45&ss=46&dg=gfdgfd&dfdfdfds=2222&test[ggg]=bbb")
// }).add('qs', function() {
//    qs.parse("aa[]=bb&aa[]=cc&a=1&b=2&c=3&c=3&ss=45&ss=46&dg=gfdgfd&dfdfdfds=2222&test[ggg]=bbb",{allowDots:false,depth:0})
// }).add('node', function() {
//     let a = Util.parseQsFast2("aa[]=bb&aa[]=cc&a=1&b=2&c=3&c=3&ss=45&ss=46&dg=gfdgfd&dfdfdfds=2222&test[ggg]=bbb")
// })
// .add('url', function() {
//     let {query, pathName} = Util.parseUrlFast("/fdfdf/dfdfdfdgfgf/gfgdgf?aa[]=bb&aa[]=cc&a=1&b=2&c=3&c=3&ss=45&ss=46&dg=gfdgfd&dfdfdfds=2222&test[ggg]=bbb");
//     querystring.parse(query);
// })
// .add('url node', function() {
//     let a = Url.parse("/fdfdf/dfdfdfdgfgf/gfgdgf?aa[]=bb&aa[]=cc&a=1&b=2&c=3&c=3&ss=45&ss=46&dg=gfdgfd&dfdfdfds=2222&test[ggg]=bbb",true)
// })
//
//
//     .on('cycle', function(event) {
//     console.log(String(event.target));
// }).run(); 
//# sourceMappingURL=unitSpec.js.map