"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const appolo = require("appolo");
const router_1 = require("../routes/router");
const app_1 = require("../app/app");
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
        };
    }
    launch(config, callback) {
        const _super = name => super[name];
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                appolo.inject.addObject('appolo', require("../../index"));
                this._options = this.loadOptions(config);
                _super("loadEnvironments").call(this);
                this.createServer();
                this.bindProcessEvents();
                yield _super("loadModules").call(this);
                _super("loadFiles").call(this);
                _super("loadInjector").call(this);
                this.setPort();
                this.loadCustomConfigurations();
                this.loadRoutes();
                yield _super("loadBootStrap").call(this);
                yield this._startServer();
                callback && callback();
                this.fireEvent('appolo-launched');
            }
            catch (e) {
                if (!callback) {
                    throw e;
                }
                callback(e);
            }
        });
    }
    loadOptions(config) {
        let dto = super.loadOptions(config);
        return _.extend(this.Defaults, dto || {});
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
        appolo.inject.addObject('router', router_1.default);
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
    loadRoutes() {
        //load routes
        router_1.default.initialize();
    }
    _startServer() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._options.startServer) {
                return;
            }
            return this.startServer();
        });
    }
    startServer() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.app.initialize(this._options);
            yield Q.fromCallback((callback) => this._server.listen(this._port, callback));
            let msg = _.template(this._options.startMessage, { interpolate: /\${([\s\S]+?)}/g })({
                port: this._port,
                version: appolo.environment.version,
                environment: appolo.environment.type
            });
            console.log(msg);
            this.fireEvent('appolo-server-started');
        });
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