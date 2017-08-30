"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor(status, message, data) {
        super(message);
        this.status = status;
        this.data = data;
        this.statusCode = status;
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}
exports.HttpError = HttpError;
//# sourceMappingURL=httpError.js.map