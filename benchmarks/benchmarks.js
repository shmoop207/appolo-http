"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const Table = require('cli-table');
const autocannon = require('autocannon');
let child, instance;
(async function () {
    child = child_process_1.exec('node ./benchmarks/mock/app.js');
    child.stdout.on('data', function (data) {
        run();
    });
    child.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
})();
function run() {
    const instance = autocannon({
        url: 'http://localhost:3000/test/',
        connections: 10,
        pipelining: 1,
        duration: 2
    });
    instance.on('done', (result) => {
        let table = new Table({
            head: ['name', 'average', 'min', 'max']
        });
        table.push(["Latency", result.latency.average, result.latency.min, result.latency.max], ["Req/Sec", result.requests.average, result.requests.min, result.requests.max]);
        console.log(table.toString());
        setTimeout(() => {
            child.removeAllListeners();
            child.kill();
            process.exit(0);
        }, 10);
    });
    process.once('SIGINT', () => kill());
}
function kill() {
    process.kill(child.pid);
    instance.stop();
}
//# sourceMappingURL=benchmarks.js.map