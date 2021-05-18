const {Router} = require('express')
const { buscar } = require('../controllers/search.controller')
const router = Router()

router.get('/posts/:termino/', [
    
], buscar)

module.exports = router