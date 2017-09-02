"use strict";
import appolo = require('../../../../index');


class ValidationController extends appolo.Controller {

    test(req:appolo.Request, res:appolo.Response) {
        res.json({working: true, controllerName: this.route.controller, model: req.model})
    }

    validaion(req:appolo.Request, res:appolo.Response) {
        res.json(req.model)
    }

}
appolo.register('validationController').type(ValidationController)

appolo.route<ValidationController>('validationController')
    .path("/test/validations/")
    .action(c=>c.test)
    .validation('user_name',appolo.validator.string().required())

appolo.route<ValidationController>(ValidationController)
    .path('/test/validations/auth')
    .method('get')
    .action('validaion')
    .validations({
        username: appolo.validator.string().alphanum().min(3).max(30).required(),
        password: appolo.validator.string().alphanum().min(3).max(30).required()
    });


