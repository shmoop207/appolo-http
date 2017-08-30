import    chai = require('chai');
import    request = require('supertest');
import   appolo = require('../../index');
import   chaiHttp = require('chai-http');

let should = chai.should()
chai.use(chaiHttp)


describe('Appolo Express', () => {

    describe('e2e', function () {

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


        it('should should call route and get json', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/')

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.working.should.be.ok

        });

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
                .get('/')

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.name.should.be.eq("root")

        });


        it('should should call route from controller', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/route/?user_name=11');

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.working.should.be.ok;

            res.body.controllerName.should.be.eq('testRouteController')

            res.body.model.userName.should.ok;
        });

        it('should should call with validation error', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/route/?user2_name=11');

            res.should.to.have.status(400);

            res.should.to.be.json;

            should.exist(res.body);

            res.body.error.should.contain("ValidationError: child \"user_name\"");
            res.body.statusText.should.contain("Bad Request")
        });

        it('should should call with route not found', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/route2222/?user2_name=11');

            res.should.to.have.status(404);

            should.exist(res.text);

            res.text.should.contain("/test/route2222/")
        });

        it('should  call controller from static $route', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/route/static/?user_name=11');


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.working.should.be.ok

            res.body.controllerName.should.be.eq('routeStaticController')

            res.body.model.userName.should.ok;
        });

        it('should  call controller from static linq', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/route/linq/?user_name=11');

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok

            res.body.controllerName.should.be.eq('routeLinqController')

            res.body.model.userName.should.ok;
        });

        it('should  call controller from static linq object', async () => {


            let res = await request(appolo.launcher.handleRequest)
                .get('/test/route/linq_object/?user_name=11')

            res.should.to.have.status(200);

            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok

            res.body.controllerName.should.be.eq('routeLinqController')

            res.body.model.userName.should.ok;
        });

        it('should  call controller from linq fluent', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/route/fluent/?user_name=11')


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.working.should.be.ok;

            res.body.controllerName.should.be.eq('routeLinqController');

            res.body.model.userName.should.ok;
        });

        it('should  call controller from linq fluent method', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/route/fluent_method/?user_name=11');


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.working.should.be.ok;

            res.body.controllerName.should.be.eq('routeLinqController')

            res.body.model.userName.should.ok;
        });

        it('should  call controller Options', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .options('/test/route/decorator/aaa/bbb/?user_name=11');

            res.should.to.have.status(204);
            res.header["access-control-allow-origin"].should.be.eq('*');
            res.header["content-length"].should.be.eq('0');

            res.text.should.be.eq("")
        });

        it('should  call controller Head', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .head('/test/route/decorator/aaa/bbb/?user_name=11');

            res.should.to.have.status(200);
            res.header["access-control-allow-origin"].should.be.eq('*');
            res.header["content-length"].should.be.eq('135');
            res.header["content-type"].should.be.eq('application/json; charset=utf-8');

            should.not.exist(res.text);
        });


        it('should  call controller from decorator', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/route/decorator/aaa/bbb/?user_name=11')


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.working.should.be.ok;

            res.body.controllerName.should.be.eq('routeDecoratorsController')

            res.body.model.userName.should.ok;
            res.body.manager.should.be.eq("Manager4");
            res.body.name.should.be.eq("aaa");
            res.body.name2.should.be.eq("bbb");

        });

        it('should  call controller twice', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/route/decorator/aaa/bbb/?user_name=11')

            let res2 = await request(appolo.launcher.handleRequest)
                .get('/test/route/decorator/aaa/bbb/?user_name=11')


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.working.should.be.ok;

            res.body.controllerName.should.be.eq('routeDecoratorsController')

            res.body.model.userName.should.ok;
            res.body.manager.should.be.eq("Manager4");
            res.body.name.should.be.eq("aaa");
            res.body.name2.should.be.eq("bbb");

            res2.body.model.userName.should.ok;
            res2.body.manager.should.be.eq("Manager4");
            res2.body.name.should.be.eq("aaa");
            res2.body.name2.should.be.eq("bbb");

        });


        it('should  call middleware before controller', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/middleware/')


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok;

            res.body.middleware.should.be.ok
        });

        it('should  call middleware before controller with class', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/middleware/')


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok;

            res.body.middleware.should.be.ok
            res.body.name.should.be.eq("Manager")
        });


        it.only('should  call call controller with gzip', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/gzip/')


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.working.should.be.ok;

            res.body.middleware.should.be.ok
            res.body.name.should.be.eq("Manager")
        });


        it('should call validations error', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/validations/')


            res.should.to.have.status(400);
            res.should.to.be.json;

            should.exist(res.body)

            res.body.error.should.be.ok;
        });


        it('should call validations ', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/validations/?username=aaa&password=1111');


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.username.should.be.ok;
        });


        it('should call static controller ', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get(`/test/static/controller/bbbb?test=${encodeURIComponent("http://www.cnn.com")}`);


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.model.test.should.be.eq("http://www.cnn.com");
            res.body.model.name.should.be.eq("bbbb");
        });

        it('should call static post controller ', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .post(`/test/static/controller/bbbb/post?test=${encodeURIComponent("http://www.cnn.com")}`)
                .send({"testPost": true});


            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.model.test.should.be.eq("http://www.cnn.com");
            res.body.model.name.should.be.eq("bbbb");
            res.body.model.testPost.should.be.eq(true);
        });

        it('should call controller with modules ', async () => {


            let res = await request(appolo.launcher.handleRequest)
                .get('/test/module/');

            res.should.to.have.status(200);
            res.should.to.be.json;

            should.exist(res.body);

            res.body.logger.should.be.ok;

            res.body.logger.should.be.eq("testinglogger2");
        });

        it('should not call route with env if not in environments', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/route/not_in_env/')


            res.should.to.have.status(404);
        });


        it('should call route with env', async () => {

            let res = await request(appolo.launcher.handleRequest)
                .get('/test/route/env/');


            res.should.to.have.status(200);
        });

    });


});