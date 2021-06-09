const express = require('express')
const {dbConnection} = require('../database/config')
const cors = require('cors');
const fileUpload = require('express-fileupload')

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
        this.app.use(cors())
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true //Crea la carpeta si la ruta no existe
        }));
    }

    activeRoutes(){
        this.app.use('/session',require('../routes/login-routes'))
        this.app.use(require('../routes/usuarios-routes'))
        this.app.use(require('../routes/posts-routes'))
        this.app.use('/busqueda', require('../routes/search-routes'))
        this.app.use('/recovery', require('../routes/recovery-routes'))
    }

    listen(){
        this.app.listen(process.env.PORT, ()=>{
            console.log(`Listenning on port ${process.env.PORT}`)
        })
    }


}

module.exports = Server