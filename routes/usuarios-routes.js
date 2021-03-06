const {Router} = require('express')
const { param, body } = require('express-validator')
const { obtenerPerfil, obtenerMiPerfil, actualizarMiPerfil, actualizarMiPassword, seguirUsuario, updateImagen } = require('../controllers/user.controller')
const { existeUsuarioId } = require('../helpers/db-validation-helper')
const { isPhoneNumber, isSecurePassword } = require('../helpers/validation-helper')
const { checkErrors } = require('../middlewares/errors-validation')
const { existFiles } = require('../middlewares/files-validation')
const { JWT_validator } = require('../middlewares/JWT-validation')
const router = Router()

//#region Acciones Admin
router.get('/admin/usuarios',(req, res)=>{
    //Obtener el listado de usuarios
    res.json({msg:"Hola"})
})

router.post('/admin/usuarios',(req, res)=>{
    //Crea un usuario(permisos de admin)
    res.json({msg:"Hola"})
})

router.delete('/admin/usuarios/:id',(req, res)=>{
    //Elimina un usuario especifico(permisos de admin)
    res.json({msg:"Hola"})
})

//#endregion

//#region Acciones usuario
router.get('/usuarios/perfil/:id', [
    JWT_validator,
    param('id','No es un mongo ID valido').isMongoId(),
    checkErrors,
    param('id').custom(existeUsuarioId),
    checkErrors
], obtenerPerfil)

router.get('/usuarios/miperfil', [
    JWT_validator,
    checkErrors
], obtenerMiPerfil)

router.put('/usuarios/update/miperfil', [
    JWT_validator,
    body('nombre','El nombre debe ser un string de 6 a 50 caracteres').if(body('nombre').exists()).isString().isLength({min: 6, max:50}),
    body('twitter', "El twitter debe ser un string de 3 a 20 caracteres").replace([""], null).if(body('twitter').exists({checkFalsy: true})).isString().isLength({min:3, max:20}),
    body('company','El nombre de la empresa debe ser un string de 6 a 30 caracteres').replace([""], null).if(body('company').exists({checkFalsy: true})).isString().isLength({min: 2, max:30}),
    body('website','El nombre de su sitio debe ser un string de 6 a 50 caracteres').replace([""], null).if(body('website').exists({checkFalsy: true})).isString().isLength({min: 6, max:50}),
    body('ubicacion','La ubicacion debe ser un string de 6 a 50 caracteres').replace([""], null).if(body('ubicacion').exists({checkFalsy: true})).isString().isLength({min: 6, max:50}),
    body('telefono').if(body('telefono').exists()).custom(isPhoneNumber),
    checkErrors
], actualizarMiPerfil)

router.put('/usuarios/update/password', [
    JWT_validator,
    body('password','La contrase??a actual es requerida').exists({checkFalsy: true}),
    body('newpassword').custom(isSecurePassword),
    checkErrors
], actualizarMiPassword)

router.put('/usuarios/update/imagen', [
    existFiles,
    JWT_validator,
    checkErrors
], updateImagen)

router.put('/usuarios/seguir/:id', [
    JWT_validator,
    param('id','No es un mongo ID valido').isMongoId(),
    checkErrors,
    param('id').custom(existeUsuarioId),
    checkErrors
], seguirUsuario)

//#endregion


module.exports = router