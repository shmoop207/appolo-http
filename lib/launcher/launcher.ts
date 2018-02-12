"use strict";
import appolo = require('appolo');
import router from '../routes/router';
import app, {App} from '../app/app';
import view, {} from '../app/view';
import    path = require('path');
import    http = require('http');
import    https = require('https');
import    fs = require('fs');
import    Q = require('bluebird');
import    _ = require('lodash');
import {IOptions} from "../interfaces/IOptions";
import ErrnoException = NodeJS.ErrnoException;


export class Launcher extends appolo.Launcher {

    protected _server: http.Server | https.Server;
    protected _options: IOptions;
    protected _port: number;

    protected readonly Defaults: IOptions = {
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

    public async launch(config?: IOptions, callback?: (err?: any,app?:App) => void): Promise<App> {

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

            router.initialize(null, this._options.validatorOptions);

            app.initialize(this._options);

            view.initialize(this._options);

            await super.loadBootStrap();


            await this._startServer();

            callback && callback(null,app);

            this.fireEvent('appolo-launched');

            return app;

        } catch (e) {
            if (!callback) {
                throw e;
            }

            callback(e);
        }
    }

    public get options(): IOptions {
        return this._options
    }

    protected loadOptions(config: IOptions): IOptions {

        let dto = super.loadOptions(config);

        return _.merge(this.Defaults, dto || {});
    }

    protected bindProcessEvents() {
        process.on('uncaughtException', (err: ErrnoException) => {
            if (err.code !== 'EADDRINUSE') {
                console.error(err.stack || err.toString())
                return;
            }

            console.error(`EADDRINUSE!!!! address in use port: ${this._port}`);
            process.exit(1);
        })
    }

    protected createServer() {


        let server: http.Server | https.Server;

        let ssl = this._options.ssl || appolo.environment.ssl;

        if (ssl && ssl.key && ssl.cert) {
            let options = {
                key: fs.readFileSync(ssl.key),
                cert: fs.readFileSync(ssl.cert)
            };

            server = https.createServer(options, (req, res) => app.handleRequest(req, res));

        } else {

            server = http.createServer((req, res) => app.handleRequest(req, res));
        }

        this._server = server;

        appolo.inject.addObject('app', app);

        appolo.inject.addObject('injector', appolo.inject);

        appolo.inject.addObject('router', router);

        appolo.inject.addObject('httpServer', server);
    }


    protected setPort() {

        this._port = process.env.APP_PORT || process.env.PORT || this._options.port || appolo.environment.port || 8080;
    }

    protected loadCustomConfigurations() {

        let allPath = path.join(this._options.root, 'config/express/all.js'),
            environmentPath = path.join(this._options.root, 'config/express/', this._options.environment + '.js');

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


    protected async _startServer() {

        if (!this._options.startServer) {
            return
        }

        return this.startServer();
    }


    public async startServer() {


        await Q.fromCallback((callback: (err: any, result?: any) => void) => this._server.listen(this._port, callback));

        let msg = _.template(this._options.startMessage, {interpolate: /\${([\s\S]+?)}/g})({
            port: this._port,
            version: appolo.environment.version,
            environment: appolo.environment.type
        });

        console.log(msg);

        this.fireEvent('appolo-server-started');

    }

    public get app(): App {
        return app
    }

    public handleRequest(req, res): void {
        app.handleRequest(req, res)
    }

    public get server(): http.Server | https.Server {
        return this._server
    }

    public get port(): number {
        return this._port
    }


    public reset(isSoftReset?: boolean) {

        super.reset(isSoftReset);

        if (!isSoftReset) {

            _.forEach(this.cachedRequire, (filePath) => delete require.cache[filePath]);

            router.reset();
        }

        this.cachedRequire.length = 0;
        this._options = null;

        try {
            this._server.close();
        } catch (e) {
            console.log("failed to close server", e)
        }

        process.removeAllListeners();
    }

    public softReset() {
        this.reset(true)
    }
}

export default new Launcher();
