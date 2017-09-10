Appolo HTTP 
=======

![appolo](https://www.dropbox.com/s/pwdvd6ohb74t7r7/appollo.png?raw=1)

Appolo HTTP is an light MVC Framework for Node.js written in Typescript<br>
Build with [appolo][2] framework and [appolo-inject][3] dependency injection module.<br>
Appolo architecture follows common patten of MVC and dependency injection which makes it easy to build better performance, flexibility and easy maintenance server side in nodejs.


## Features
  * super fast
  * MVC Architecture
  * full support for [express][4] middlewares
  * dependency injection system
  * simple routing system
  * routes validation
  * Manage easily configurations and environments 
  * Simple folder structures
  * Easy integrate third party modules
  * Easy to get started
      
## Installation
```javascript
npm install appolo-http --save
```
## Typescript
Also make sure you are using TypeScript compiler version > 2.1 and you have enabled following settings in `tsconfig.json`
```javascript
{
    "experimentalDecorators": true
}
```
## Quick Start 
in your app.js file
```javascript
var appolo  = require('appolo-http');
appolo.launch();
```

<!---## Appolo Http Boilerplate
small example project to get you started with appolo.<br>
source code : [https://github.com/shmoop207/appolo-express-boilerplate][8]
```bash
git clone https://github.com/shmoop207/appolo-express-boilerplate.git
```
-->


## Recommended Directory Structure
the environments folder must to exist every thing else is optional appolo will require all files in the config and server folders but the environments folder will be loaded first.
```javascript
|- config
  |- environments
    |- all.ts
    |- development.ts
    |- production.ts
  |- express
    |- all.ts
  |- modules
    |- logger.ts
    |- redis.ts
    |- mongo.ts
    |- modules.ts
    ...
|- server
    |- controllers
    |- managers
    |- middleware
    |- services
    |- bootstrap.ts
    ...
|- app.ts
   
```

## Configuration
appolo launch configuration options, all options are optional

| key | Description | Type | Default
| --- | --- | --- | --- |
| `paths` | folder will be required and loaded on appolo launch | `array`|  `['config', 'server']`| 
| `root` | the root folder of the paths option | `string` | `process.cwd()` |
| `environment` | environment file name that  | `string` | `(process.env.NODE_ENV || 'development')` |
| `startMessage` | the message that will be written to console log the the server starts | `string` | `'Appolo Server listening on port: {port} version:{version} environment: {environment}'` |
| `startServer` | if true the server will start immediately to listen to port else you will have to start in manually. | `boolean` | `true` |
| `port` | the port that the app will listen to. | `number` | `process.env.PORT || this._options.port || appolo.environment.port || 8080)`` |
| `errorStack` | print route http stack error when env is not development | `boolen` | `false` |
| `errorMessage` | print route http error.toString() | `boolen` | `true` |
| `maxRouteCache` | the max size of route lookup lru cache | `number` | `10000` |

#### usage example:
```javascript
let appolo  = require('appolo-http');

appolo.launcher.launch( {
    paths:['config', 'server'],
    root : process.cwd()+'/app',
    environment : 'testing',
    port:8182,    
});
```

## Environments
With environments you can define different set of configurations depending on the environment type your app is currently running.
it is recommended to have 4 types of environments : `development`, `testing`, `staging`, `production`.
after `appolo.launch` you can always to access to current environment vars via `appolo.environment`.
```javascript
//all.ts
export = {
    name:'all',
    someVar:'someVar'
}
//development.ts
export = {
    name:'develpment',
    db:'monog://development-url'
}
//development.ts
export = {
    name:'testing',
    db:'monog://testing-url'
}

```
if we launch our app.js with `NODE_ENV = testing`
```javascript
var appolo  = require('appolo-http');
appolo.launcher.launch();
var env = appolo.environment;
console.log(env.name,env.someVar,env.db) // 'testing someVar monog:://testing-url'
```

## Express modules
you can configure express modules or  add custom middleware by adding configuration file to the express folder.
the express configuration file is called after the environments loaded
```javascript
//express/all.ts
import favicon = require('static-favicon');
import bodyParser = require("body-parser");

export = function (app: appolo.App) {
    app.use(bodyParser.json());
    
    app.use(function (req: appolo.IRequest, res: appolo.IResponse, next: appolo.NextFn) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        next();
    });
    app.use(favicon());
}
```
## Routes
you can easily  bind route path to a controller method 
the routes path are the same as you defined in [expressjs][10] router

each route class has the following methods:

 - `path` - same as you define in expressjs
 - `method` - one of `get`,`post`,`patch`,`delete`,`put`. default `get`
 - `action` - the action function the will be invoked to handle the route
 - `middleware` - middleware function the will be invoked be before the controller if the next function is not called or called with error the controller won`t be created.
 - `validation` - validations object as define in [joi][11].

```javascript
import {define,singleton,initMethod,inject} from 'appolo-http';

@define()
export class TestController extends appolo.Controller{
    @inject() dataManager:DataManager
    
    @path("/test/:userId")
    @method(appolo.Methods.POST)
    public test (req:appolo.IRequest, res:appolo.IResponse) {
       res.send(this.dataManager.getData(req.params.userId));
    }
}

@define()
export class Test2Controller extends appolo.Controller{
    @inject() dataManager:DataManager
    
    @pathPost("/test2/:userId")
    @validations("userId",validator.string().required())
    public test (req:appolo.IRequest, res:appolo.IResponse) {
       res.send(this.dataManager.getData(req.params.userId));
    }
}
```
or you can define route using appolo.route method

```javascript
import {define,singleton,initMethod,inject} from 'appolo-http';

@define()
export class TestController extends appolo.Controller{
    @inject() dataManager:DataManager
    
    public test (req:appolo.IRequest, res:appolo.IResponse) {
       res.send(this.dataManager.getData());
    }
}

appolo.route<TestController>(TestController)
    .path("/test/")
    .method(appolo.Methods.GET)
    .action(c=>c.test)
```

## Routes Validation 
you can add validations to your routes the action controller will be called only if the route params are valid.<br>
validations syntax is done by using [joi module][11] .<br>
the validator takes request params from `req.param` , `req.query` and `req.body`, after validation the request params will be on `req.model`.

```javascript
import {define,singleton,initMethod,inject} from 'appolo-http';
let validator = appolo.validator;

@define()
export class TestController extends appolo.Controller{
    
    @inject() dataManager:DataManager
    
    public async search (req:appolo.IRequest, res:appolo.IResponse) {
       try{
           let model = req.model;
           let result = await this.dataManager.getSearchResults(model.search,model.page,model.pageSize)
            this.sendOk(result)
       }catch(e){
           this.sendError(e)
       } 
    }
}

appolo.route<TestController>(TestController)
    .path('/search/')
    .action(c=>c.search)
    .validations({
        search:validator.string().required(),
        pageSize:validator.number().default(20),
        page:validator.number().default(1)
    })
```

if the request params are not valid `400 Bad Request` will be sent and json with validation error.
```javascript
{
    status: 400,
    statusText: "Bad Request",
    error: "userId is required"
    
}
```

## Controllers
Controllers are classes that handled the routes request.
for every request an new controller will be created, it can not be singleton.
in order the router will be able to handle to request the controller class must inherit from `appolo.Controller`
each controller action will be called with [request][12] and [response][13] objects.

```javascript
import {define,singleton,initMethod,inject,lazy,mehtod,path,validation} from 'appolo-http';

@define()
export class LoginController extends appolo.Controller{
    
    @inject() authManager:AuthManager;
    
    @path("/login/")
    @mehtod(appolo.Methods.POST)
    @validation("username", appolo.validator.string())
    @validation("password", appolo.validator.string())
    public aynsc loginUser(req:appolo.IRequest,res:appolo.IResponse,route:appolo.IRouteOptions){
        try{
            let result =  await this.authManager.validateUser(req.model.username,req.model.password)
            this.send(result)

        }catch (e){
            this.sendError(e)
        }
    }
}
```
if do not need a new controller instance for evey request you can inherit from StaticController that is singleton and created only once 
```javascript
import {define,singleton,initMethod,inject,lazy,mehtod,path,validation} from 'appolo-http';
@define()
@singleton()
@lazy()
export class LoginController extends appolo.StaticController{
    @inject() authManager:AuthManager;
    
    @path("/login/")
    @mehtod(appolo.Methods.POST)
    @validation("username", appolo.validator.string().required())
    @validation("password", appolo.validator.string().required())
    public aynsc loginUser(req:appolo.IRequest,res:appolo.IResponse,route:appolo.IRouteOptions){
        try{
            let result = await this.authManager.validateUser(req.model.username,req.model.password)
            this.send(result)
        
        }catch (e){
            this.sendError(e)
        }
    }
}
```
### appolo.Controller
 - `this.req` -   request object
 - `this.res` -   response object
 - `this.route` - the route object of the current action 

### json success helper methods

 - `this.send([statusCode?:number?,data?:any])` - send json response with status code 
 - `this.sendOk([data?:any])` - send json with statusCode 200
 - `this.sendCreated([data?:any])` - send json with statusCode 201
 - `this.sendNoContent()` send empty response with statusCode 204

### json server error helper methods
 - `controller.sendError([error?:Error,code?:number])` send Error with statusCode 500
 - `controller.sendBadRequest([error?:Error,code?:number])` send Error with statusCode 400
 - `controller.sendUnauthorized([error?:Error,code?:number])` send Error with statusCode 403
 - `controller.sendNotFound([error?:Error,code?:number])` send Error with statusCode 404

send json error response with optional message

 - `error` - the error object that will be passed to the response
 - `code` - the error code object that will be passed to the response


```javascript
{
     "status": 500,
     "statusText": "Internal Server Error",
     "error":"something is wrong",
     "code":1001
}
```

## Middleware 
middleware class will run before the action of the controller is invoked.
you must and declare the middleware `id` in the route and call `next` function in order to continue the request.
the middleware must implement the `run` method and inherit from `appolo.Middleware`

example : in routes file
```javascript
    appolo.route("someController").path("somePath").middleware(AuthMiddleware)
```
in middleware file
```javascript
import {define,singleton,initMethod,inject} from 'appolo-http';
@define()
export class AuthMiddleware extends appolo.Middleware {
    
    @inject() authManager:AuthManager;
    
    public async run(req:appolo.IRequest,res:appolo.IResponse,next:appolo.NextFn,route:appolo.IRouteOptions){
        try{
            let result =  await this.authManager.validateToken(req.headers.authorization)     
            req.user = user;
            next();
            
        }catch(e){
            this.sendUnauthorized();
        } 
    }
}
```

## Dependency Injection System
appolo have powerful [Dependency Injection][22] system based on [appolo-inject][23].
enables you to organize your code in [loose coupling][24] classes.
you can always access to injector via `appolo.injector`.

### class decorators 
 - `define`
 - `singleton`
 - `lazy`
 - `alias`
 - `aliasFactory`
### property and methods decorators  
 - `initMethod`
 - `inject`
 - `injectFactoryMethod`
 - `injectAlias`
 - `injectAliasFactory`
 - `injectArray`
 - `injectDictionary`
 - `injectAliasFactory`
 - `injectFactory`
 - `injectObjectProperty`
 - `injectValue`
###  method parameter decorators
 - `injectParam`
```javascript
//dataManager.ts
import {define,singleton,initMethod,inject} from 'appolo-http';
@define()
@singleton()
export class DataManager {
    getData(){
        ...
    }
}
//fooController.ts
@define()
export class FooController{
   
    @inject() dataManager:DataManager
    
    constructor() {
        this.data = null
    }
    @initMethod()
    initialize(){
        this.data =  this.dataManager.getData();
        //do something
    }
}
//app.ts
let fooController = appolo.inject.getObject('fooController');
console.log(fooController.data)
```
you can also `use appolo.register`
```javascript
appolo.register('dataManager')
    .type(DataManager)
    .singleton()

class FooController{
    constructor() {
        this.data = null
    }
    initialize(){
        this.data =  this.dataManager.getData();
        //do something
    }
}

appolo.register('fooController')
    .type(FooController)
    .singleton()
    .initMethod('initialize')
    .inject('dataManager');

let fooController = appolo.inject.getObject('fooController');
console.log(fooController.data)
```

you can also use constructor injection or method parameter injection 
```javascript
import {define,singleton,injectParam,initMethod,inject} from 'appolo-http';
@define()
@singleton()
export class DataManager {
    getData(){
        ...
    }
}
@define()
class FooController{
    constructor(@injectParam() dataManager:DataManager) {
       this.dataManager = dataManager;
    }
    @initMethod()
    public initialize(){
        this.data =  this.dataManager.getData();
    }
    
    public test(@injectParam() logger:Logger){
        //...
    }
}

```

### Inherited injections
inherited injections are supported as well
you can inject to base class and the child call will be injected as well.
remember not use `@define` on the parent class
```javascript
import {define,singleton,injectParam,initMethod,inject} from 'appolo-http';

export class BaseManager {
    @inject() protected env:any
    private getData(){
        ...
    }
}
@define()
class FooManager extends BaseManager{
    
    @initMethod()
    public initialize(){
        //the env object in injected from the base class
        console.log(this.env.test) 
    }
    
}

``` 

## Event Dispatcher
appolo have built in event dispatcher to enable classes to listen and fire events
Event Dispatcher has the following methods:

- `eventDispatcher.on(event,callback,[scope])` add event listener
   - `event` - event name.
   - `callback` - callback function that will triggered on event name.
   - `scope` - optional, the scope of the `callback` function default: `this`.

- `eventDispatcher.un(event,callback,[scope])` - remove event listener all the arguments must be `===` to on method else it won`t be removed.
   -  `event` - event name.
   -  `callback` - callback function.
   -  `scope` - optional, the scope of the callback function.
 
- `eventDispatcher.fireEvent(event,[arguments])` fireEvent - triggers the callback functions on given event name
   - `eventName` - name of the event
   - `arguments` -  all the rest `arguments` will be applied on the `callback` function

```javascript
import {define,singleton,injectParam,initMethod,inject} from 'appolo-http';
@define()
@singleton()
export class FooManager extends appolo.EventDispatcher{
    public notifyUsers(){
        this.fireEvent('someEventName',{someData:'someData'})
    }
}
@define()
export class FooController {
    
    @inject() fooManager:FooManager;
    
    @initMethod()
    public initialize(){
        this.fooManager.on('someEventName',(data)=>{
            this.doSomething(data.someData)
        },this);
    }
    doSomething(data){
        ///    
    }
}
```


## Modules
third party modules can be easily loaded to appolo inject and used in the inject container.
each module must call `appolo.use` before it can be used by `appolo launcher`.
the modules loaded in series so the module must call the `next` function or return a `promise`  in order to continue the lunch process.
you can inject the `appolo.use` function any object that is already exists in the injector 

the default injectable objects:

 - `env` - environment object,
 - `inject` - injector  - to add objects to the injector,

the last argument must be the `next` function 

```javascript
import appolo = require('appolo-http');

//my custom module 
appolo.use(function(env:any,inject:appolo.Injector,next:appolo.NextFn){
    let myModuleObject = {data:'test'};	
    inject.addObject('myModuleObject',myModuleObject);
    next();
}); 
//or with promise
appolo.use(async function(env:any,inject:appolo.Injector){
    let myModuleObject = {data:'test'};	
    inject.addObject('myModuleObject',myModuleObject);
});
	
```
now I can inject `myModuleObject` to any class
```javascript
import {define,singleton,injectParam,initMethod,inject} from 'appolo-http';
@define()
export  class AuthMiddleware{
	
    @inject('myModuleObject') testObject:any
    
    public doSomeThing() {
        return this.testObject.data; //return 'test'
    }
}
```

### Logger module example
logger module example with [winston][19]

loggerModule.js file
```javascript
import winston = require('winston');
import appolo = require('appolo');

appolo.use(async function(env:any,inject:appolo.Injector){
    
    transports.push(new (winston.transports.Console)({
        json: false,
        timestamp: true,
        handleExceptions: true
    }));

    let logger = new (winston.Logger)({
        transports: transports,
        exitOnError: false
    });

    inject.addObject('logger', logger);
});
```
now you you inject logger anywhere you want
```javascript
import {define,singleton,initMethod,inject} from 'appolo-http';
@define()
export class DataManager{
    @inject() logger:Logger
    public initialize(){
        this.logger.info("dataManager initialized",{someData:'someData'})
    }
}
```

## Appolo Bootstrap

once it launched appolo try to find appolo `bootstrap` class and call it's `run` method. only when the bootstrap if finished the server will start
```javascript
import {define,singleton,injectParam,initMethod,inject,bootstrap} from 'appolo-http';
@define()
@bootstrap()
export class Bootstrap implements appolo.IBootstrap{
    
    @inject() someManager1:SomeManager1
    public async run(){
        //start your application logic here
        await this.someManager1.doSomeThing();
    }
}

```


## Appolo Reset ##
you can reset appolo sever by calling `appolo.reset()` this will clean all environments, config, injector and close the server  

    
## Tests ##
```javascript
    grunt test
```

## License ##

The `appolo` library is released under the MIT license. So feel free to modify and distribute it as you wish.


  [1]: http://expressjs.com/
  [2]: https://www.github.com/shmoop207/appolo
  [3]: https://www.github.com/shmoop207/appolo-inject
  [4]: http://expressjs.com/en/resources/middleware.html
  [10]:http://expressjs.com/en/guide/routing.html
  [11]: https://github.com/hapijs/joi
  [12]: http://expressjs.com/en/4x/api.html#req
  [13]: http://expressjs.com/en/4x/api.html#res
  [19]: https://github.com/flatiron/winston
  [22]: http://en.wikipedia.org/wiki/Dependency_injection
  [23]: https://github.com/shmoop207/appolo-inject
  [24]: http://en.wikipedia.org/wiki/Loose_coupling