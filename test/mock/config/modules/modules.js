"use strict";
const appolo = require("../../../../index");
const logger_1 = require("./logger");
const logger2_1 = require("./logger2");
const logger3_1 = require("./logger3");
module.exports = async function (env) {
    appolo.use(logger_1.logger);
    appolo.use(logger2_1.logger2({ test: 'test' }));
    await appolo.load(logger3_1.logger3({ test: 'test3' }));
};
//# sourceMappingURL=modules.js.map