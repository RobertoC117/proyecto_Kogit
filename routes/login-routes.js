const {Router} = require('express')
const router = Router()
const {body} = require('express-validator')
const { signUp, logIn } = require('../controllers/login.controller')
const { existeEmail, existeUsername } = require('../helpers/db-validation-helper')
const { isPhoneNumber, isSecurePassword } = require('../helpers/validation-helper')
const { checkErrors } = require('../middlewares/errors-validation')

router.post('/login', [
    body('termino').exists({checkFalsy: true}),
    body('password').exists({checkFalsy: true}),
    checkErrors,
    body('termino').isString(),
    body('password').isString(),
    checkErrors
], logIn)

router.post('/signup', [
    body('nombre','El nombre debe ser un string de 6 a 50 caracteres').isString().isLength({min: 6, max:50}),
    body('username','El username debe ser un string de 6 a 18 caracteres').isString().isLength({min:6, max:18}),
    body('username').custom(existeUsername),
    body('email','El email no tiene un formato valido').isEmail(),
    body('email').custom(existeEmail),
    body('telefono').custom(isPhoneNumber),
    body('password').custom(isSecurePassword),
    checkErrors
], signUp)

module.exports = router