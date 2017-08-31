import    chai = require('chai');
import    request = require('supertest');
import   appolo = require('../../index');
import   chaiHttp = require('chai-http');

let should = chai.should()
chai.use(chaiHttp)


describe('Appolo Http e2e', () => {


    beforeEach(async () => {
        await appolo.launcher.launch({
            port: 8183,
            environment: "testing",
            root: process.cwd() + '/test/mock/',
            paths: ['config', 'server']
        });
    });

    afterEach(() => {
        appolo.launcher.reset();
    });

    describe('define', function () {

        it('should call define controller from  linq object', async () => {


            let res = await request(appolo.launcher.handleRequest)
                .get('/test/define/linq_object/?user_name=11')

            res.should.to.have.status(200);

            res.should.to.be.json;

            should.exist(res.body);

            res.body.working.should.be.ok;

            res.body.controllerName.should.be.eq('defineController')

            res.body.model.userName.should.ok;
        });

        it('should  call define controller from linq', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/define/linq/?user_name=11');

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.working.should.be.ok;

            res.body.controllerName.should.be.eq('defineController');

            res.body.model.userName.should.ok;
        });

        it('should  call define controller from  fluent method', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/define/fluent_method/?user_name=11');


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.working.should.be.ok;

            res.body.controllerName.should.be.eq('defineController');

            res.body.model.userName.should.ok;
        });

        it('should  call controller from linq fluent', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/define/fluent/?user_name=11')


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.working.should.be.ok;

            res.body.controllerName.should.be.eq('defineController');

            res.body.model.userName.should.ok;
        });
    });

    describe('env', function () {
        it('should not call route with env if not in environments', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/env/not_in_env/');


            res.should.to.have.status(404);
        });


        it('should call route with env', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/env/');


            res.should.to.have.status(200);
        });
    });

    describe('gzip', function () {
        it('should  call call controller with gzip', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/gzip/')


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok;
        });
    });

    describe('middleware', function () {
        it('should  call middleware with function before controller', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/middleware/function');


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok;
        });


        it('should  call auth middleware before controller', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/middleware/auth/');


            res.should.to.have.status(403);

            should.exist(res.text)

            res.text.should.be.eq("Error: NOT AUTHORIZED")


        });

        it('should  call middleware before controller with class', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/middleware/class')


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok;

            res.body.middleware.should.be.ok
            res.body.name.should.be.eq("Manager")
        });

        it('should  call middleware before controller with objectId', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/middleware/objectId');


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok;

            res.body.middleware.should.be.ok
            res.body.name.should.be.eq("Manager")
        });

    });

    describe('module', function () {
        it('should call controller with modules ', async () => {


            let res = await request(appolo.launcher.handleRequest)
                .get('/test/module/');

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.logger.should.be.ok;

            res.body.logger.should.be.eq("testinglogger2");
        });
    });

    describe('params', function () {
        it('should  call controller from with params', async () => {

            let res = await request(appolo.launcher.handleRequest)
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

        });

        it('should  call controller from with params middle', async () => {

            let res = await request(appolo.launcher.handleRequest)
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

        });
    });

    describe('root', function () {
        xit('should should call route *', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test222/')

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.name.should.be.eq("all")

        });

        it('should should call route /', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/');

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.name.should.be.eq("root")

        });

        it('should should call with route not found', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/route2222/?user2_name=11');

            res.should.to.have.status(404);

            should.exist(res.text);

            res.text.should.contain("/test/route2222/")
        });
    });

    describe('static controller', function () {
        it('should  call controller twice', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/static/controller/aaa/bbb/?user_name=11');

            let res2 = await request(appolo.launcher.handleRequest)
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

        });

        it('should call static controller ', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get(`/test/static/controller/aaa/bbb?test=${encodeURIComponent("http://www.cnn.com")}`);


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.model.test.should.be.eq("http://www.cnn.com");
            res.body.model.name.should.be.eq("aaa");
        });

        it('should call static post controller ', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .post(`/test/static/controller/aaa/bbb/post?test=${encodeURIComponent("http://www.cnn.com")}`)
                .send({"testPost": true});


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.model.test.should.be.eq("http://www.cnn.com");
            res.body.model.name.should.be.eq("aaa");
            res.body.model.testPost.should.be.eq(true);
        });
    });

    describe('validations', function () {
        it('should should call with validation error', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/validations/?user2_name=11');

            res.should.to.have.status(400);

            res.should.to.be.json;

            should.exist(res.body);

            res.body.error.should.contain("ValidationError: child \"user_name\"");
            res.body.statusText.should.contain("Bad Request")
        });

        it('should call validations error', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/validations/');


            res.should.to.have.status(400);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.error.should.be.ok;
        });

        it('should call validations with camelCase', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/validations/?user_name=test');


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.model.userName.should.be.ok;
        });


        it('should call validations ', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/validations/auth/?username=aaa&password=1111');


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.username.should.be.ok;
        });

    });

    describe('json', function () {
        it('should should call route and get json', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/json/?aaa=bbb&ccc=ddd');

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.query.should.be.ok;
            res.body.query.aaa.should.be.eq("bbb");
            res.body.query.ccc.should.be.eq("ddd");

        });

        it('should should call route and get json', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .post('/test/json/')
                .send({aaa:"bbb",ccc:"ddd"})

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.body.should.be.ok;
            res.body.body.aaa.should.be.eq("bbb");
            res.body.body.ccc.should.be.eq("ddd");

        });

    });




    describe('methods', function () {
        it('should  call controller Options', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .options('/test/params/aaa/bbb/?user_name=11');

            res.should.to.have.status(204);
            res.header["access-control-allow-origin"].should.be.eq('*');
            res.header["content-length"].should.be.eq('0');

            res.text.should.be.eq("")
        });

        it('should call controller Head', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .head('/test/params/aaa/bbb/?user_name=11');

            res.should.to.have.status(200);
            res.header["access-control-allow-origin"].should.be.eq('*');
            res.header["content-length"].should.be.eq('126');
            res.header["content-type"].should.be.eq('application/json; charset=utf-8');

            should.not.exist(res.text);
        });


        it('should call controller empty response', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/params/empty/aaa/bbb/?user_name=11');

            res.should.to.have.status(204);
            res.header["access-control-allow-origin"].should.be.eq('*');
            res.header["content-length"].should.be.eq('0');
            should.not.exist(res.header["content-type"]);

            res.text.should.be.eq("");
        });

    })







});