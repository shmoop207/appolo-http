import appolo = require('../../../../index');
import    bodyParser = require('body-parser');


export = function (app: appolo.App) {
    app.use(bodyParser.urlencoded({
        extended: true,
        parameterLimit: 10000,
        limit: 1024 * 1024 * 10
    }));

    app.use(bodyParser.json({
        //parameterLimit: 10000,
        limit: 1024 * 1024 * 10
    }));

    app.use(function (req: appolo.Request, res: appolo.Response, next: appolo.NextFn) {
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin || '*');
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Cache-Control", "max-age=0, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.setHeader("P3P", 'CP="CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI DSP COR"');
        //res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, DELETE, HEAD, OPTIONS");
        //res.header("Allow", "GET, PUT, PATCH, DELETE, HEAD, OPTIONS");


        // intercept OPTIONS method
        if (req.method == 'OPTIONS') {
            res.setHeader('Content-Length', '0');
            res.statusCode = 204;
            res.end();
        } else {
            next();
        }


    });
}