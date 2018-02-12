"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo = require("appolo");
const router_1 = require("../routes/router");
const app_1 = require("../app/app");
const view_1 = require("../app/view");
const path = require("path");
const http = require("http");
const https = require("https");
const fs = require("fs");
const Q = require("bluebird");
const _ = require("lodash");
class Launcher extends appolo.Launcher {
    constructor() {
        super(...arguments);
        this.Defaults = {
            startMessage: "Appolo Server listening on port: ${port} version:${version} environment: ${environment}",
            startServer: true,
            errorStack: false,
            errorMessage: true,
            maxRouteCache: 10000,
            qsParser: "qs",
            urlParser: "fast",
            viewExt: "html",
            viewEngine: null,
            viewFolder: "server/views",
            validatorOptions: {
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true
            }
        };
    }
    async launch(config, callback) {
        try {
            appolo.inject.addObject('appolo', require("../../index"));
            this._options = this.loadOptions(config);
            super.loadEnvironments();
            this.createServer();
            this.bindProcessEvents();
            await super.loadModules();
            super.loadFiles();
            super.loadInjector();
            this.setPort();
            this.loadCustomConfigurations();
            router_1.default.initialize(null, this._options.validatorOptions);
            app_1.default.initialize(this._options);
            view_1.default.initialize(this._options);
            await super.loadBootStrap();
            await this._startServer();
            callback && callback(null, app_1.default);
            this.fireEvent('appolo-launched');
            return app_1.default;
        }
        catch (e) {
            if (!callback) {
                throw e;
            }
            callback(e);
        }
    }
    get options() {
        return this._options;
    }
    loadOptions(config) {
        let dto = super.loadOptions(config);
        return _.merge(this.Defaults, dto || {});
    }
    bindProcessEvents() {
        process.on('uncaughtException', (err) => {
            if (err.code !== 'EADDRINUSE') {
                console.error(err.stack || err.toString());
                return;
            }
            console.error(`EADDRINUSE!!!! address in use port: ${this._port}`);
            process.exit(1);
        });
    }
    createServer() {
        let server;
        let ssl = this._options.ssl || appolo.environment.ssl;
        if (ssl && ssl.key && ssl.cert) {
            let options = {
                key: fs.readFileSync(ssl.key),
                cert: fs.readFileSync(ssl.cert)
            };
            server = https.createServer(options, (req, res) => app_1.default.handleRequest(req, res));
        }
        else {
            server = http.createServer((req, res) => app_1.default.handleRequest(req, res));
        }
        this._server = server;
        appolo.inject.addObject('app', app_1.default);
        appolo.inject.addObject('injector', appolo.inject);
        appolo.inject.addObject('router', router_1.default);
        appolo.inject.addObject('httpServer', server);
    }
    setPort() {
        this._port = process.env.APP_PORT || process.env.PORT || this._options.port || appolo.environment.port || 8080;
    }
    loadCustomConfigurations() {
        let allPath = path.join(this._options.root, 'config/express/all.js'), environmentPath = path.join(this._options.root, 'config/express/', this._options.environment + '.js');
        _.forEach([allPath, environmentPath], (filePath) => {
            if (!fs.existsSync(filePath)) {
                return;
            }
            this.cachedRequire.push(filePath);
            let func = require(filePath);
            let args = appolo.Util.getFunctionArgs(func);
            let dependencies = _.map(args, (arg) => appolo.inject.getObject(arg));
            func.apply(func, dependencies);
        });
    }
    async _startServer() {
        if (!this._options.startServer) {
            return;
        }
        return this.startServer();
    }
    async startServer() {
        await Q.fromCallback((callback) => this._server.listen(this._port, callback));
        let msg = _.template(this._options.startMessage, { interpolate: /\${([\s\S]+?)}/g })({
            port: this._port,
            version: appolo.environment.version,
            environment: appolo.environment.type
        });
        console.log(msg);
        this.fireEvent('appolo-server-started');
    }
    get app() {
        return app_1.default;
    }
    handleRequest(req, res) {
        app_1.default.handleRequest(req, res);
    }
    get server() {
        return this._server;
    }
    get port() {
        return this._port;
    }
    reset(isSoftReset) {
        super.reset(isSoftReset);
        if (!isSoftReset) {
            _.forEach(this.cachedRequire, (filePath) => delete require.cache[filePath]);
            router_1.default.reset();
        }
        this.cachedRequire.length = 0;
        this._options = null;
        try {
            this._server.close();
        }
        catch (e) {
            console.log("failed to close server", e);
        }
        process.removeAllListeners();
    }
    softReset() {
        this.reset(true);
    }
}
exports.Launcher = Launcher;
exports.default = new Launcher();
//# sourceMappingURL=launcher.js.map