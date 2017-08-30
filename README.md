Appolo Express  [![Build Status](https://travis-ci.org/shmoop207/appolo-express.png?branch=master)](https://travis-ci.org/shmoop207/appolo-express) [![Dependencies status](https://david-dm.org/shmoop207/appolo-express.png)](https://david-dm.org/shmoop207/appolo-express) [![NPM version](https://badge.fury.io/js/appolo-express.svg)](https://badge.fury.io/js/appolo-express)
=======

![appolo](https://dl.dropboxusercontent.com/u/19179794/appollo.png)

Appolo Express is an MVC Framework for Node.js build on top [expressjs][1] 4. <br>
Build with [appolo-class][2] class system and [appolo-inject][3] dependency injection system.<br>
Appolo architecture follows common patten of MVC and dependency injection which makes it easy to build better performance, flexibility and easy maintenance server side in nodejs.


## Features
  * MVC Architecture
  * Powerful class system
  * dependency injection system
  * simple routing system
  * routes validation
  * Manage easily configurations and environments 
  * Simple folder structures
  * Easy integrate third party modules
  * Easy to get started
  
##Live Demo
#### Multi room chat 
 * build with `appolo-express` `socket.io` and `redis`.
 * live demo: [http://appolo-chat-example.herokuapp.com][4].
 * source code: [https://github.com/shmoop207/appolo-chat-example][5].

#### Real-time Stocks data
  * build with `appolo-express` `socket.io` and `angularjs`.
  * live demo: [http://appolo-express-quotes-example.herokuapp.com][6]. 
  * source code: [https://github.com/shmoop207/appolo-express-quotes-example][7].

#### Polls
  * build with `appolo-express` `mongoDB` and `angularjs`.
  * live demo: [http://appolo-express-poll-example.herokuapp.com](http://appolo-express-poll-example.herokuapp.com/). 
  * source code: [https://github.com/shmoop207/appolo-express-polls-example](https://github.com/shmoop207/appolo-express-polls-example).
    
## Installation
```javascript
npm install appolo-express --save
```

##Quick Start 
in your app.js file
```javascript
var appolo  = require('appolo-express');
appolo.launcher.launch();
```

##Appolo Express Boilerplate
small example project to get you started with appolo.<br>
source code : [https://github.com/shmoop207/appolo-express-boilerplate][8]
```bash
git clone https://github.com/shmoop207/appolo-express-boilerplate.git
```


##Recommended Directory Structure ##
the environments folder must to exist every thing else is optional appolo will require all files in the config and server folders but the environments folder will be loaded first.
```javascript
|- config
    |- environments
        |- all.js
        |- development.js
        |- production.js
    |- express
        |- express.js
    |- modules
		|- logger.js	    
	    |- redis.js 
	    |- mongo.js
        |- modules.js
    |- routes
        |- routes.js
    
    ...
|- public_folder
|- server
    |- controllers
    |- managers
    |- middleware
    |- services
    |- views
    |- bootstrap.js
    ...
|- app.js
   
```

## Configuration
appolo launch configuration options

#### options.paths
Type :`array`, Default: `['config', 'server']`
The folder will be required and loaded on appolo launch

#### options.root
Type :`string`, Default: process.cwd()
the root folder of the paths option

#### options.environment 
Type :`string`, Default: `(process.env.NODE_ENV || 'development')`
environment file name that will override the environment all.js file
default is the NODE_ENV or if not defined it will be `development`

#### options.bootStrapClassId
Type :`string`, Default: `appolo-bootstrap`
appolo will try to find the bootstrap class after it launched and run it.
this is optional if the class is not defined nothing will happen.

#### options.templateEngine 
Type :`string`, Default: 'swig'
the template engine that will used to render the views
the template engine using the [consolidate][9] module

#### options.viewsFolder
Type :`string`, Default: '/server/views'
the folder where your view templates located

#### options.public
Type :`string`, Default: 'public'
the public folder where all your assets and static files will be located

#### options.loadDefaultConfigurations
Type :`boolean`, Default: 'true'
true to load all  express default middleware and express options. false to load custom middleware by yourself
```javascript
app.locals.pretty = true;
app.locals.cache = 'memory';
app.set('showStackError', true);
app.use(compression({ level: 9 }));
app.enable('jsonp callback');
app.use(expressValidator());
app.use(bodyParser());
app.use(multer({ dest: './uploads/'}));
app.use(methodOverride());
app.use(cookieParser());
app.use(flash());
app.use(favicon());
app.use(express.static);
```
#### options.startMessage
Type :`string`, Default: 'Appolo Server listening on port: {port} version:{version} environment: {environment}'
the message that will be written to console log the the server starts
#### options.startServer
Type :`boolean`, Default: 'true'
if true the server will start immediately to listen to port else you will have to start in manually.
#### options.port
Type :`number`, Default: `process.env.PORT || this._options.port || appolo.environment.port || 8080)`
the port that the app will listen to.
the port will be determined in the following order if defined: `process.env.PORT`, `options.port`,`appolo.environment.port`, `8080`
#### usage example:
```javascript
var appolo  = require('appolo-express');

appolo.launcher.launch( {
    paths:['config', 'server'],
    root : process.cwd()+'/app',
    environment : 'testing',
    port:8182,
    templateEngine:'ejs'
    
});
```

## Environments
With environments you can define different set of configurations depending on the environment type your app is currently running.
it is recommended to have 4 types of environments : `development`, `testing`, `staging`, `production`.
after `appolo.launch` you can always to access to current environment vars via `appolo.environment`.
```javascript
//all.js
module.exports = {
    name:'all'
    someVar:'someVar'
}
//development.js
module.exports = {
    name:'develpment'
    db:'monog://development-url'
}
//development.js
module.exports = {
    name:'testing'
    db:'monog://testing-url'
}

```
if we launch our app.js with `NODE_ENV = testing`
```javascript
var appolo  = require('appolo-express');
appolo.launcher.launch();
var env = appolo.environment;
console.log(env.name,env.someVar,env.db) // 'testing someVar monog:://testing-url'
```

## Express Configurations
you can configure express app and add custom middleware by adding configuration file to the express folder.
the express configuration file is called after the default express configurations loaded if your want to load your own custom express configurations set `loadDefaultConfigurations : false` in the appolo launch
```javascript
var favicon = require('static-favicon');

module.exports = function (app) {
    app.all('/*', function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        next();
    }
    app.use(favicon());
}
```
## Routes 
you can easy define your app routes in the `config/routes` folder
the routes are the same as you defined in [expressjs][10] router
```javascript
module.exports = [
    {
        path: '/login/',
        method: 'post',
        controller: 'login',
        action: 'loginUser',
        middleware:[]
        locals:{}
    },
    {
        path: '/users/:id',
        method: 'get',
        controller: 'user',
        action: 'getUser',
        middleware:[function(res,req,next){
            //do something
            next();
        }]
        locals:{}
    }
];
```
each route have the following params:

 - `path` - same as you define in expressjs
 - `method` - one of `get`,`post`,`patch`,`delete`,`put`. default `get`
 - `controller` - the name of the controller that will be crated to handle the route the controller id must have `Controller` postfix
 - `action` - the action function the will be invoked to handle the route
 - `middleware` - array of middleware function the will be invoked be before the controller if the next function is not called or called with error the controller won`t be created.
 - `locals` - locals object the will extend res.locals 

you can also define the route in the controller `config`.<br>
you can omit the controller name it will be set to the current controller id
```javascript
var appolo = require('appolo-express')
module.exports = class TestController extends appolo.Controller{
    static get $config()  {
        return {
            id: 'testController',
            inject:['dataManager']
        }
    }
    static get $routes{
        return [{
            path: '/test/',
            method: 'get',
            action: 'test'
        }]
    }
    test (req, res) {
        res.json(this.dataManager.getData());
    }
}
```
or using `appolo.define`
```javascript
var appolo = require('appolo-express')
class TestController extends appolo.Controller{
    test (req, res) {
       res.json(this.dataManager.getData());
    }
}
appolo.define('testController')
    type(TestController)
    .inject('dataManager')
    .routes({
            path: '/test/',
            method: 'get',
            action: 'test'
    })
```
## Routes Validation 
you can add validations to your routes the action controller will be called only if the route params are valid.<br>
validations syntax is done by using [joi module][11] .<br>
the validator takes request params from `req.param` , `req.query` and `req.body`, after validation the request params will be on `req.model`.

```javascript
var appolo = require('appolo-express'),
    validator = appolo.validator;

module.exports = class TestController extends appolo.Controller{
	static get $config() {
	    return {
            id: 'testController',
            inject:['dataManager']
        }
    }
    static get $routes(){
        return [{
            path: '/search/',
            method: 'get',
            action: 'search',
            validations:{
                search:validator.string().required(),
                pageSize:validator.number().default(20),
                page:validator.number().default(1)
            }
        }]
    }
    search (req, res) {
		var model = req.model;
		this.dataManager.getSearchResults(model.search,model.page,model.pageSize)
            .then(this.sendOk.bind(this))
            .fail(this.sendServerError.bind(this));
    }
}
```

if the request params are not valid `400 Bad Request` will be sent and json with validation error.
```javascript
{
    status: 400,
    statusText: "Bad Request",
    error: {
        symbol: [
            "symbol is required"
        ]
    }
}
```

## Controllers
Controllers are classes that handled the routes request.
for every request an new controller will be created, it can not be singleton.
in order the router will be able to handle to request the controller class must inherit from `appolo.Controller`
each controller action will be called with [request][12] and [response][13] objects.

```javascript
var appolo = require('appolo-express');
module.exports = class LoginController extends appolo.Controller{
    static get $config(){
        return {
            id:'loginController',
            inject:['authManager']
        }
    }
    loginUser(req,res){
        this.authManager.validateUser(req.body.username,req.body.password)
            .then(this.sendOk.bind(this))
            .fail(this.sendServerError.bind(this));
    }
}
```
or using `appolo.define`
```javascript
var appolo = require('appolo-express');
class LoginController extends appolo.Controller{
    loginUser(req,res){
        this.authManager.validateUser(req.body.username,req.body.password)
            .then(this.sendOk.bind(this))
            .fail(this.sendServerError.bind(this));
    }
}

appolo.define('loginController')
    .type(LoginController)
    .inject('authManager')
```
## appolo.Controller
 - `this.req` -  express request object
 - `this.res` -  express response object
 - `this.route` - the route object of the current action 

### `controller.render([view,model])`
view render helper function will try to find and render the view  file in view folder according to the controller name and action

 - `view` - the view name if different from the controller action
 - `model` - the model that will be passed to the view
 
```javascript
var appolo = require('appolo-express');
module.exports = class LoginController extends appolo.Controller{
    static get $config(){
        return {
            id:'loginController',
            inject:['dataManager']
        }
    }
    index(req,res){
        this.render({someData:'someData'}) 
        //the will render the view from viewFolder/login/index
    }
}
```
### json success helper methods

 - `controller.send([statusCode,data])`
 - `controller.sendOk([data])`
 -  `controller.sendCreated([data])`
 -  `controller.sendNoContent()`

send json success response

 - `data` - the data object will be passed to the response

```javascript

var appolo = require('appolo-express'),
    validator = appolo.validator;

module.exports = class LoginController extends appolo.Controller{
	static get $config() {
	    return {
	        id: 'loginController',
            inject:['authManager']
        }
    }
    static get $routes(){
        return  [{
		    path: '/login/',
            method: 'post',
            action: 'loginUser',
            validations:{
		        username:validator.string().required(),
		        password:validator.number().required()
	        }
        }]
    }
    loginUser (req, res) {
        var model = req.model;
        this.authManager.login(model.username,model.password)
            .then(_prepareDto.bind(this))
            .then(this.sendOk.bind(this))
            .fail(this.sendServerError.bind(this));
    },
    _prepareDto(user){
	    return {userId:user.id}
    }
}

//or using appolo.define
appolo.define('loginController')
    .type(LoginController)
    .inject('authManager')
    .routes({
	    path: '/login/',
        method: 'post',
        action: 'loginUser',
        validations:{
	        username:validator.string().required(),
		    password:validator.number().required()
	    }
    })

```
```javascript
{"userId":1} //status code 200
```
### json server error helper methods
 - `controller.sendServerError([error,code])`
 - `controller.sendBadRequest([error,code])`
 -  `controller.sendUnauthorized([error,code])`
 -  `controller.sendNotFound([error,code])`

send json error response with optional message

 - `error` - the error object that will be passed to the response
 -  `code` - the error code object that will be passed to the response


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
module.exports = [
    {
        path: '/someRoute',
        method: 'get',
        controller: 'someName',
        action: 'someAction',
        middleware: ['authMiddleware']
    }
```
in middleware file
```javascript
var appolo = require('appolo-express');
module.exports = class authMiddleware extends appolo.Middleware {
    static get $config(){
        return {
            id:'authMiddleware',
            inject:['authManager']
        }
    }
    run(req,res,next,route){
        this.authManager.validateToken(req.headers.authorization)
            .then(this._onSuccess.bind(this))
            .fail(this._onError.bind(this))
    },
    _onSuccess(user){
        this.req.user = user;
        this.next();
    }
    _onError(){
        this.res.send("401")
    }
})
```

## Dependency Injection System
appolo have powerful [Dependency Injection][22] system based on [appolo-inject][23].
enables you to organize your code in [loose coupling][24] classes.
you can always access to injector via `appolo.inject`.
```javascript
//dataManager.js
var appolo  = require('appolo');
module.exports = class DataManager {
    static get $config(){ 
        return{ 
            id:'dataManager',
            singleton: true
        }
    }
    getData(){
        ...
    }
}
//fooController.js
module.exports = class FooController{
    static get $config() { 
        return {
            id:'fooController',
            singleton: false,
            initMethod:'initialize',
            inject:['dataManager']
        }
    }
    constructor() {
        this.data = null
    }
    initialize(){
        this.data =  this.dataManager.getData();
        //do something
    }
}
//app.js
var fooController = appolo.inject.getObject('fooController');
console.log(fooController.data)
```
you can also `use appolo.define`
```javascript
var appolo  = require('appolo');
class DataManager {
    getData(){
        ...
    }
}
appolo.define({ 
    id:'dataManager',
    singleton: true,
    type:DataManager
})
//or 
appolo.define('dataManager')
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
appolo.define({
    id:'fooController',
    singleton: false,
    initMethod:'initialize',
    type:FooController
    inject:['dataManager']
});
//or
appolo.define('fooController')
    .type(FooController)
    .singleton()
    .initMethod('initialize')
    .inject('dataManager');

var fooController = appolo.inject.getObject('fooController');
console.log(fooController.data)
```

you can also use constructor injection
```javascript
var appolo  = require('appolo');
class DataManager {
    getData(){
        ...
    }
}
appolo.define('dataManager')
	.type(DataManager)
	.singleton();

class FooController{
    constructor(dataManager) {
       this.dataManager = dataManager;
    }
    initialize(){
        this.data =  this.dataManager.getData();
    }
}
appolo.define('fooController')
    .type(FooController)
    .singleton()
    .initMethod('initialize');
```

## Namespace
you can define global class namespace and use it without require
```javascript
class Person{
}
appolo.define(Person).namespace("Foo.Person");

var person = new Foo.Person()
```

## statics
you can define statics value both on the class prototype and class instance
```javascript
class Person{
    get name(){
        return this.Foo
    }
}
appolo.define(Person)
    .namespace("Foo.Person")
    .statics("BAR","1")
    .statics({Foo:2});

var person = new Foo.Person()
console.log(Person.BAR) // 1
console.log(person.BAR) // 1
console.log(person.name) //2
```

## Mixins
used to add prototype functions from other classes
```javascript
class Events{
    on (event, fn) {
        return true;
    },
    un (event, fn) {
        return true;
    }
}

class Foo{
    constructor() {
    }
}

appolo.define(Foo).mixins(Events)

var foo = new Foo();
foo.on('test',function(){})

```
## Event Dispatcher
appolo have built in event dispatcher to enable classes to listen and fire events
Event Dispatcher has the following methods:

### `eventDispatcher.on(event,callback,[scope])`
add event listener
 - `event` - event name.
 - `callback` - callback function that will triggered on event name.
 - `scope` - optional, the scope of the `callback` function default: `this`.

### `eventDispatcher.un(event,callback,[scope])`     
remove event listener all the arguments must be `===` to on method else it won`t be removed.
 -  `event` - event name.
 -  `callback` - callback function.
 -  `scope` - optional, the scope of the callback function.
 
### `eventDispatcher.fireEvent(event,[arguments])`
fireEvent - triggers the callback functions on given event name
- `eventName`
- `arguments` -  all the rest `arguments` will be applied on the `callback` function

```javascript
var appolo  = require('appolo');
class FooManager extends appolo.EventDispatcher{
    notifyUsers:function(){
        this.fireEvent('someEventName',{someData:'someData'})
    }
}
appolo.define('fooManager').type(FooManager).singleton()

class FooController {
    initialize(){
        this.fooManager.on('someEventName',function(data){
            this.doSomething(data.someData)
        },this);
    }
    doSomething:function(){
    }
}

appolo.define('fooController').type(FooController)
    .initMethod('initialize')
    .inject('fooManager')
```


## Modules
third party modules can be easily loaded to appolo inject and used in the inject class system.
each module must call `appolo.use` before it can be used by `appolo launcher`.
the modules loaded in series so the module must call the `next` function in order to continue the lunch process.
you can inject the `appolo.use` function any object that is already exists in the injector 

the default injectable objects:

 - `env` - environment object,
 - `inject` - injector  - to add objects to the injector,

the last argument must be the `next` function 

```javascript
var appolo = require('appolo');

//my custom module 
appolo.use(function(env,inject,next){
	var myModuleObject = {data:'test'};	
	
	inject.addObject('myModuleObject',myModuleObject);
	
	next();
}); 
	
```
now I can inject `myModuleObject` to any class
```javascript
var appolo = require('appolo');
module.exports = class AuthMiddleware{
	static get $config(){ 
	    return {
            id:'authMiddleware',
            inject:['myModuleObject']
        }
    }
    doSomeThing {
        return this.myModuleObject.data;
    }
}
```

### Logger module
logger module example with [winston][19] and [sentry][20]

loggerModule.js file
```javascript
var winston = require('winston'),
    appolo = require('appolo'),
    Sentry = require('winston-sentry');

module.exports = function(options){
	return function(env,inject,next){
		var transports = [];
	
		if(env.type == 'production'){
		    transports.push(new Sentry({
	            level: 'warn',
	            dsn: env.sentryConnectionString,
	            json: true,
	            timestamp: true,
	            handleExceptions: true,
	            patchGlobal: true
		    }));
		}

		transports.push(new (winston.transports.Console)({
		    json: false,
		    timestamp: true,
		    handleExceptions: true
		}));

		var logger = new (winston.Logger)({
		    transports: transports,
		    exitOnError: false
		});

		inject.addObject('logger', logger);
	}
}
```
in your modules.js
```javascript
var logger= require('./loggerModule'),
    appolo = require('appolo');

appolo.use(loggerModule());	
```
now you you inject logger anywhere you want
```javascript
var appolo  = require('appolo');

class DataManager{
    initialize:function(){
        this.logger.info("dataManager initialized",{someData:'someData'})
    }
});
appolo.define('dataManager',DataManager)
    .singleton()
    .initMethod()
    .inject('logger')

```

### Socket.io Module
[Socket.io][14] module example

socketModule.js file
```javascript
var sio = require('socket.io'),
    appolo = require('appolo');

module.exports = function(options){
	return function(env,inject,app,next){
		
		var io = sio.listen(app.server);
		
		inject.addObject('io', io);
		
		next();
	}
}
```
in your modules.js
```javascript
var loggerModule= require('./loggerModule'),
	socketModule= require('./socketModule'),
    appolo = require('appolo');

appolo.use(loggerModule());
appolo.use(socketModule());	
```
usage:
```javascript

var appolo  = require('appolo');
class ChatController{
    initialize:function(){
        this.io.sockets.on('connection', function(socket){
	        this.logger.info("client connected")
            socket.broadcast.to('some_room').emit('message','client connected');
        }.bind(this);
    }
}

appolo.define('chatController')
    .type(ChatController)
    .singleton()
    .initMethod()
    .inject('io','logger')
```

### Redis Module
[Redis][15] module and [Q][16] example

redisModule.js file
```javascript
var redis = require('redis'),
    appolo = require('appolo'),
    url = require('url');

module.exports = function(options){
	return function(env,inject,logger,next){
		//you can put redis connection string in appolo environments to support 
		//different redis db in different environments
		var redisURL = url.parse(appolo.environment.redisConnectionString);
		var redisClient = redis.createClient(redisURL.port, redisURL.hostname);
		if(redisURL.auth){
		    redisClient.auth(redisURL.auth.split(":")[1]);
		}
		redisClient .on('connect', function () {
	        logger.info("connected to redisClient");
	        next();
		});
		
		inject.addObject('redis', redisClient);
	}
}
```
in your modules.js
```javascript
var loggerModule= require('./loggerModule'),
	redisModule= require('./redisModule'),
    appolo = require('appolo');

appolo.use(loggerModule());
appolo.use(redisModule());	
```
usage:
```javascript
var appolo  = require('appolo'),
    Q = require('q');

class DataManager {
    getData(){
        var deferred = Q.defer();
         this.redis.get('someKey', function (err, value) {
            err ? deferred.reject() : deferred.resolve(value);
         });
         
         return deferred.promise;
    }
}
appolo.define('dataManager',DataManager)
    .singleton()
    .inject('redis')

```
### MongoDb Module
MongoDb with [Mongose][17] and [Q][16] example

in mongooseModule.js
```javascript
var mongoose = require('mongoose'),,
    appolo = require('appolo');

module.exports = function(options){
	return function(env,inject,logger,next){
		mongoose.connect(appolo.environment.db);
		
		mongoose.on('connection',function(){
			logger.info("connected to mongo");
			next()
		});
		
		inject.addObject('mongoose', mongoose);
	}
}
```
in modules.js
```javascript
var loggerModule= require('./loggerModule'),
	mongooseModule= require('./mongooseModule'),
    appolo = require('appolo');

appolo.use(loggerModule());
appolo.use(mongooseModule());	
```

in userSchema.js 
```javascript
	var mongoose = require('mongoose'),
	    appolo = require('appolo');
	
	var userSchema = new mongoose.Schema( name : {type: String});
	var userModel = mongoose.model('User', userSchema);
	
	appolo.inject.addObject('UserModel', userModel);
	
	module.exports = userSchema ;
```
usage:
```javascript
var appolo  = require('appolo'),
    Q = require('q');

module.exports = class UserManager{
    getUser(id){
        var deferred = Q.defer();
       this.UserModel.findById(id,function(err,data){
            err ? deferred.reject() : deferred.resolve(value);
        });
        return deferred.promise;
    }
}
appolo.define('userManager',UserManager)
    .singleton()
    .inject('UserModel')
```


## Appolo Bootstrap

once it launched appolo try to find appolo `bootstrap` class and call it's `run` method.
```javascript
var appolo  = require('appolo');

class Bootstrap{
    run(){
        //start your application logic here
        this.someManager1.doSomeThing();
    }
}
appolo.define('appolo-bootstrap',Bootstrap)
    .singleton()
    .inject(['someManager1','someManager2'])

```


##Appolo Reset ##
you can reset appolo sever by calling `appolo.reset()` this will clean all environments, config, injector and close the server  

    
## Tests ##
```javascript
    grunt test
```

## License ##

The `appolo` library is released under the MIT license. So feel free to modify and distribute it as you wish.


  [1]: http://expressjs.com/
  [2]: https://www.github.com/shmoop207/appolo-class
  [3]: https://www.github.com/shmoop207/appolo-inject
  [4]: http://appolo-chat-example.herokuapp.com
  [5]: https://github.com/shmoop207/appolo-chat-example
  [6]: http://appolo-express-quotes-example.herokuapp.com/
  [7]: https://github.com/shmoop207/appolo-express-quotes-example
  [8]: https://github.com/shmoop207/appolo-express-boilerplate
  [9]: https://www.npmjs.org/package/consolidate
  [10]: http://expressjs.com/4x/api.html#router
  [11]: https://github.com/hapijs/joi
  [12]: http://expressjs.com/4x/api.html#req.params
  [13]: http://expressjs.com/4x/api.html#res.status
  [14]: https://github.com/Automattic/socket.io
  [15]: https://github.com/mranney/node_redis
  [16]: https://github.com/kriskowal/q
  [17]: https://github.com/LearnBoost/mongoose
  [18]: https://github.com/kriskowal/q
  [19]: https://github.com/flatiron/winston
  [20]: https://github.com/getsentry/sentry
  [21]: https://github.com/shmoop207/appolo-class
  [22]: http://en.wikipedia.org/wiki/Dependency_injection
  [23]: https://github.com/shmoop207/appolo-inject
  [24]: http://en.wikipedia.org/wiki/Loose_coupling
