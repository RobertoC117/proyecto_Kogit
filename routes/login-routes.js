const {Router} = require('express')
const router = Router()
const {body} = require('express-validator')
const { signUp } = require('../controllers/login.controller')
const { checkErrors } = require('../middlewares/errors-validation')

router.post('/login',(req, res)=>{
    res.json({msg:"Hola"})
})

router.post('/signUp', [
    body('nombre','El nombre debe ser un string de 6 a 50 caracteres').isString().isLength({min: 6, max:50}),
    body('username','El username debe ser un string de 6 a 18 caracteres').isString().isLength({min:6, max:18}),
    body('email','El email no tiene un formato valido').isEmail(),
    //body('telefono','El telefono no tiene un formato valido').is,
    checkErrors
], signUp)

module.exports = router