const {Router} = require('express')
const router = Router()


router.get('/admin/usuarios',(req, res)=>{
    //Obtener el listado de usuarios
    res.json({msg:"Hola"})
})

module.exports = router