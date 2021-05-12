const {Router} = require('express')
const router = Router()

router.get('/posts',(req, res)=>{
    res.json({msg:"Hola"})
})


module.exports = router