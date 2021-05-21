const { Router } = require('express')
const { body, param } = require('express-validator')
const { confirmEmail, preguntar, responder, sendRecoveryEmail, resetPassword} = require('../controllers/recovery.controller')
const { verificarEmailEstado, existeUsuarioId } = require('../helpers/db-validation-helper')
const { isSecurePassword } = require('../helpers/validation-helper')
const { checkErrors } = require('../middlewares/errors-validation')
const { recoveryJWT_validator } = require('../middlewares/JWT-validation')
const router = Router()

router.post('/verificarEmail',[
    body('email').isEmail().withMessage('El email no tiene un fromato adecuado'),
    checkErrors,
    body('email').custom(verificarEmailEstado),
    checkErrors
], confirmEmail)

router.get('/preguntar/:id',[
    param('id','No es un mongo ID valido').isMongoId(),
    checkErrors,
    param('id').custom(existeUsuarioId),
    checkErrors
], preguntar)

router.post('/responder/:id',[
    param('id','No es un mongo ID valido').isMongoId(),
    checkErrors,
    param('id').custom(existeUsuarioId),
    checkErrors
], responder)

router.post('/enviarEmail/:id', [
    param('id','No es un mongo ID valido').isMongoId(),
    checkErrors,
    param('id').custom(existeUsuarioId),
    body('url','La url que ira en el correo es requerida').exists({checkFalsy: true}),
    checkErrors
], sendRecoveryEmail)

router.post('/reset/password', [
    recoveryJWT_validator,
    body('newpassword').custom(isSecurePassword),
    checkErrors
], resetPassword)

module.exports = router