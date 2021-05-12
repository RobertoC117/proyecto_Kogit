const mongoose = require('mongoose')

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_URL,{
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log('Database working :)')
    } catch (error) {
        console.log(error)
        throw new Error('Opps! something went wrong:(')
    }
}

module.exports = {
    dbConnection
}