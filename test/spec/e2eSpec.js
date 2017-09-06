"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai = require("chai");
const request = require("supertest");
const appolo = require("../../index");
const chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);
describe('Appolo Http e2e', () => {
    beforeEach(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield appolo.launcher.launch({
            port: 8183,
            environment: "testing",
            root: process.cwd() + '/test/mock/',
            paths: ['config', 'server']
        });
    }));
    afterEach(() => {
        appolo.launcher.reset();
    });
    describe('define', function () {
        it('should call define controller from  linq object', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/define/linq_object/?user_name=11');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.working.should.be.ok;
            res.body.controllerName.should.be.eq('defineController');
            res.body.model.userName.should.ok;
            res.body.manager5.should.be.eq("Manager53");
        }));
        it('should  call define controller from linq', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/define/linq/?user_name=11');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.working.should.be.ok;
            res.body.controllerName.should.be.eq('defineController');
            res.body.model.userName.should.ok;
        }));
        it('should  call define controller from  fluent method', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/define/fluent_method/?user_name=11');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.working.should.be.ok;
            res.body.controllerName.should.be.eq('defineController');
            res.body.model.userName.should.ok;
        }));
        it('should  call controller from linq fluent', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/define/fluent/?user_name=11');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.working.should.be.ok;
            res.body.controllerName.should.be.eq('defineController');
            res.body.model.userName.should.ok;
        }));
    });
    describe('env', function () {
        it('should not call route with env if not in environments', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/env/not_in_env/');
            res.should.to.have.status(404);
        }));
        it('should call route with env', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/env/');
            res.should.to.have.status(200);
        }));
    });
    describe('gzip', function () {
        it('should  call call controller with gzip', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/gzip/');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.working.should.be.ok;
        }));
    });
    describe('middleware', function () {
        it('should  call middleware with function before controller', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/middleware/function');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.working.should.be.ok;
        }));
        it('should  call auth middleware before controller', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/middleware/auth/');
            res.should.to.have.status(403);
            should.exist(res.text);
            res.text.should.be.eq('{"status":403,"statusText":"Unauthorized","error":"NOT AUTHORIZED","code":11}');
        }));
        it('should  call middleware before controller with class', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/middleware/class');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.working.should.be.ok;
            res.body.middleware.should.be.ok;
            res.body.name.should.be.eq("Manager");
        }));
        it('should  call middleware before controller with objectId', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/middleware/objectId');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.working.should.be.ok;
            res.body.middleware.should.be.ok;
            res.body.name.should.be.eq("Manager");
        }));
    });
    describe('module', function () {
        it('should call controller with modules ', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/module/');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.logger.should.be.ok;
            res.body.logger.should.be.eq("testinglogger2");
        }));
    });
    describe('params', function () {
        it('should  call controller from with params', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/params/aaa/bbb/?user_name=11');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.working.should.be.ok;
            res.body.controllerName.should.be.eq('paramsController');
            res.body.model.userName.should.ok;
            res.body.manager.should.be.eq("Manager4");
            res.body.name.should.be.eq("aaa");
            res.body.name2.should.be.eq("bbb");
        }));
        it('should  call controller from with params middle', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/params/aaa/test/bbb/?user_name=11');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.working.should.be.ok;
            res.body.controllerName.should.be.eq('paramsController');
            res.body.model.userName.should.ok;
            res.body.manager.should.be.eq("Manager4");
            res.body.name.should.be.eq("aaa");
            res.body.name2.should.be.eq("bbb");
        }));
    });
    describe('static', function () {
        it('should should serve static', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test.html');
            res.should.to.have.status(200);
            res.text.should.be.match(/aaa/);
            res.type.should.be.match(/text\/html/);
        }));
    });
    describe('root', function () {
        xit('should should call route *', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test222/');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.name.should.be.eq("all");
        }));
        it('should should call route /', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.name.should.be.eq("root");
        }));
        it('should should call with route not found', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/route2222/?user2_name=11');
            res.should.to.have.status(404);
            should.exist(res.text);
            res.text.should.contain("/test/route2222/");
        }));
    });
    describe('decorator route controller', function () {
        it('should call decorator route controller ', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get(`/test/decorator/route/aaa/bbb?test=${encodeURIComponent("http://www.cnn.com")}`);
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.model.test.should.be.eq("http://www.cnn.com");
            res.body.model.name.should.be.eq("aaa");
        }));
        it('should call decorator2 route controller ', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get(`/test/decorator2/route/aaa/bbb?test=${encodeURIComponent("http://www.cnn.com")}`);
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.model.test.should.be.eq("http://www.cnn.com");
            res.body.model.name.should.be.eq("aaa");
        }));
    });
    describe('decorator param controller', function () {
        it('should call decorator param controller ', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get(`/test/decorator/param/aaa/bbb?test=${encodeURIComponent("http://www.cnn.com")}`);
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.name.should.be.eq("Manager");
            res.body.model.should.be.eq("testing");
            res.body.user.should.be.eq("user");
        }));
    });
    describe('static controller', function () {
        it('should  call controller twice', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/static/controller/aaa/bbb/?user_name=11');
            let res2 = yield request(appolo.launcher.handleRequest)
                .get('/test/static/controller/aaa/bbb/?user_name=11');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.model.should.be.ok;
            res.body.model.userName.should.ok;
            res.body.model.name.should.be.eq("aaa");
            res.body.model.name2.should.be.eq("bbb");
            res.body.model.userName.should.be.eq("11");
            res2.body.model.userName.should.ok;
            res2.body.model.name.should.be.eq("aaa");
            res2.body.model.userName.should.be.eq("11");
        }));
        it('should call static controller ', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get(`/test/static/controller/aaa/bbb?test=${encodeURIComponent("http://www.cnn.com")}`);
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.model.test.should.be.eq("http://www.cnn.com");
            res.body.model.name.should.be.eq("aaa");
        }));
        it('should call static post controller ', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .post(`/test/static/controller/aaa/bbb/post?test=${encodeURIComponent("http://www.cnn.com")}`)
                .send({ "testPost": true });
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.model.test.should.be.eq("http://www.cnn.com");
            res.body.model.name.should.be.eq("aaa");
            res.body.model.testPost.should.be.eq(true);
        }));
    });
    describe('validations', function () {
        it('should should call with validation error', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/validations/?user2_name=11');
            res.should.to.have.status(400);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.error.should.contain("ValidationError: child \"user_name\"");
            res.body.statusText.should.contain("Bad Request");
        }));
        it('should call validations error', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/validations/');
            res.should.to.have.status(400);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.error.should.be.ok;
        }));
        it('should call validations with camelCase', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/validations/?user_name=test');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.model.userName.should.be.ok;
        }));
        it('should call validations ', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/validations/auth/?username=aaa&password=1111');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.username.should.be.ok;
        }));
    });
    describe('json', function () {
        it('should should call route and get json', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/json/?aaa=bbb&ccc=ddd');
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.query.should.be.ok;
            res.body.query.aaa.should.be.eq("bbb");
            res.body.query.ccc.should.be.eq("ddd");
        }));
        it('should should call route and get json', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .post('/test/json/')
                .send({ aaa: "bbb", ccc: "ddd" });
            res.should.to.have.status(200);
            res.should.to.be.json;
            should.exist(res.body);
            res.body.body.should.be.ok;
            res.body.body.aaa.should.be.eq("bbb");
            res.body.body.ccc.should.be.eq("ddd");
        }));
    });
    describe('methods', function () {
        it('should  call controller Options', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .options('/test/params/aaa/bbb/?user_name=11');
            res.should.to.have.status(204);
            res.header["access-control-allow-origin"].should.be.eq('*');
            res.header["content-length"].should.be.eq('0');
            res.text.should.be.eq("");
        }));
        it('should call controller Head', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .head('/test/params/aaa/bbb/?user_name=11');
            res.should.to.have.status(200);
            res.header["access-control-allow-origin"].should.be.eq('*');
            res.header["content-length"].should.be.eq('126');
            res.header["content-type"].should.be.eq('application/json; charset=utf-8');
            should.not.exist(res.text);
        }));
        it('should call controller empty response', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            let res = yield request(appolo.launcher.handleRequest)
                .get('/test/params/empty/aaa/bbb/?user_name=11');
            res.should.to.have.status(204);
            res.header["access-control-allow-origin"].should.be.eq('*');
            res.header["content-length"].should.be.eq('0');
            should.not.exist(res.header["content-type"]);
            res.text.should.be.eq("");
        }));
    });
});
//# sourceMappingURL=e2eSpec.js.map