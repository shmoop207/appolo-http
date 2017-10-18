"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appolo = require("../../index");
appolo.launcher.launch({
    port: 3000,
    environment: "testing",
    root: process.cwd() + '/benchmarks/mock',
    paths: ['config', 'server']
});
//# sourceMappingURL=app.js.map