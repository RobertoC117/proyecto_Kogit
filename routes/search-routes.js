const {Router} = require('express')
const { buscar } = require('../controllers/search.controller')
const router = Router()
const { JWT_validator } = require('../middlewares/JWT-validation')
const { checkErrors } = require('../middlewares/errors-validation')
const { query } = require('express-validator')

router.get('/posts/:termino/', [
    JWT_validator,
    //body("valor","El valor de busqueda es requerido").exists({checkFalsy: true}),
    query("valor","El valor de busqueda es requerido").exists({checkFalsy: true}),
    checkErrors
], buscar)

module.exports = router