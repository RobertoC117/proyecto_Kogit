const {Router} = require('express')
const { param, body } = require('express-validator')
const { obtenerRepositorio, 
        MainPosts,
        crearPost, 
        obtenerPost, 
        actualizarPost, 
        eliminarPost,
        comentarPost, 
        like,
        getAllPosts} = require('../controllers/post.controller')
const { existePostId } = require('../helpers/db-validation-helper')
const { checkErrors } = require('../middlewares/errors-validation')
const { JWT_validator } = require('../middlewares/JWT-validation')
const router = Router()

router.get('/posts/all', getAllPosts)

//Obtener los posts de las personas que sigues
router.get('/posts/main', [
    JWT_validator,
    checkErrors
], MainPosts)

//Obtener los posts del usuario
router.get('/posts/misposts', [
    JWT_validator,
    checkErrors
], obtenerRepositorio)

//Obtener la vista detallada de un post
router.get('/posts/:id', [ 
    JWT_validator,
    param('id','No es un mongo id valido').isMongoId(),
    checkErrors,
    param('id').custom(existePostId),
    checkErrors
], obtenerPost)

//Crear un post
router.post('/posts/crear', [
    JWT_validator,
    body('titulo').notEmpty().isLength({min: 6, max:30}).withMessage('El titulo debe ser un string de 6 a 30 caracteres'),
    body('texto').notEmpty().isLength({min: 20, max:500}).withMessage('El texto debe ser un string de 20 a 500 caracteres'),
    body('lenguaje').notEmpty().isLength({max: 20}).withMessage('El lenguaje debe ser un string de maximo 20 caracteres'),
    body('tags').isArray({min: 3, max:4}).withMessage('Los tags deben ser un array de 3 o 4 de lonjitud'),
    checkErrors
], crearPost)

//Actualizar un post
router.put('/posts/editar/:id', [
    JWT_validator,
    param('id','No es un mongo id valido').isMongoId(),
    checkErrors,
    param('id').custom(existePostId),
    checkErrors,
    body('titulo').if(body('titulo').exists()).isLength({min: 6, max:30}).withMessage('El titulo debe ser un string de 6 a 30 caracteres'),
    body('texto').if(body('texto').exists()).isLength({min: 20, max:500}).withMessage('El texto debe ser un string de 20 a 500 caracteres'),
    body('lenguaje').if(body('lenguaje').exists()).isLength({max: 20}).withMessage('El lenguaje debe ser un string de maximo 20 caracteres'),
    body('tags').if(body('tags').exists()).isArray({min: 3, max:4}).withMessage('Los tags deben ser un array de 3 o 4 de lonjitud'),
    checkErrors   
], actualizarPost)

//Comentar un post
router.put('/posts/comentar/:id', [
    JWT_validator,
    body("texto", "El contenido del comentario es requerido").exists({checkFalsy: true}),
    checkErrors
], comentarPost)

//Me gusta
router.put('/posts/megusta/:id_post', [
    JWT_validator,
    param('id_post', 'No es un mongo ID valido').isMongoId(),
    checkErrors,
    param('id_post').custom(existePostId),
    checkErrors
], like)

//Eliminar un post
router.delete('/posts/eliminar/:id',[
    JWT_validator,
    param('id','No es un mongo id valido').isMongoId(),
    checkErrors,
    param('id').custom(existePostId),
    checkErrors
], eliminarPost)


module.exports = router