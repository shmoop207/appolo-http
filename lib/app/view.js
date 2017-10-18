"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo_lru_cache_1 = require("appolo-lru-cache");
const fs = require("fs");
const path = require("path");
const Q = require("bluebird");
const httpError_1 = require("../common/error/httpError");
class View {
    initialize(_options) {
        this._options = _options;
        this._cache = new appolo_lru_cache_1.Cache({ maxSize: this._options.maxRouteCache });
    }
    async render(controllerName, actionName, name, params) {
        try {
            name = name || actionName;
            params = params || {};
            let key = `${controllerName}${actionName}${name}`;
            let item = this._cache.peek(key);
            if (!item) {
                let ext = path.extname(name);
                if (!ext) {
                    name += `.${this._options.viewExt || "html"}`;
                }
                let paths = [
                    path.resolve(this._options.root, name),
                    path.resolve(this._options.root, this._options.viewFolder, controllerName, name),
                    path.resolve(this._options.root, this._options.viewFolder, name),
                    path.resolve(this._options.root, "server/controllers", controllerName, name),
                    path.resolve(this._options.root, "server/controllers", name)
                ];
                let foundPath = await this._lookup(paths.slice());
                if (!foundPath) {
                    throw new httpError_1.HttpError(500, `failed to find view path for ${name} ${controllerName} ${actionName} searched paths ${JSON.stringify(paths)}`);
                }
                if (!this._options.viewEngine) {
                    throw new httpError_1.HttpError(500, `tried to call render but view engine is no defined`);
                }
                item = { path: foundPath };
                this._cache.set(key, item);
            }
            let result = await this._options.viewEngine(item.path, Object.assign({ cache: true }, params));
            return result;
        }
        catch (e) {
            throw new httpError_1.HttpError(500, `failed to render view ${e.toString()}`);
        }
    }
    async _lookup(paths) {
        let path = paths.shift();
        if (!path) {
            return null;
        }
        let isExist = await this._isFileExist(path);
        if (isExist) {
            return path;
        }
        return this._lookup(paths);
    }
    async _isFileExist(path) {
        try {
            let result = await Q.fromCallback(c => fs.stat(path, c));
            return result.isFile();
        }
        catch (e) {
            return false;
        }
    }
}
exports.View = View;
exports.default = new View();
//# sourceMappingURL=view.js.map