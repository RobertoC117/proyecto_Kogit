const express = require('express')
const {dbConnection} = require('../database/config')

class Server{

    constructor(){
        this.app = express()
        this.port = process.env.PORT

        this.connectDB()
        this.activeMiddlewares()
        this.activeRoutes()
    }

    async connectDB(){
        await dbConnection()
    }

    activeMiddlewares(){
        this.app.use(express.urlencoded({extended: false}))
        this.app.use(express.json()) 
    }

    activeRoutes(){
        this.app.use('/session',require('../routes/login-routes'))
        this.app.use(require('../routes/usuarios-routes'))
        this.app.use(require('../routes/posts-routes'))
    }

    listen(){
        this.app.listen(process.env.PORT, ()=>{
            console.log(`Listenning on port ${process.env.PORT}`)
        })
    }


}

module.exports = Server