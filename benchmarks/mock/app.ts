"use strict";
import appolo  = require('../../index');

appolo.launcher.launch({
    port: 3000,
    environment: "testing",
    root: process.cwd() + '/benchmarks/mock',
    paths: ['config', 'server']
})