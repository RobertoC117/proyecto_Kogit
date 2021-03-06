const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es requerido'],
    },
    username:{
        type: String,
        required: [true, 'El username es requerido'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'El password es requerido'],
    },
    email:{
        type: String,
        required: [true, 'El username es requerido'],
        unique: true
    },
    telefono:{
        type: String,
        required: [true, 'El telefono es requerido']
    },
    company:{
        type: String
    },
    website:{
        type: String
    },
    twitter:{
        type: String
    },
    ubicacion:{
        type: String
    },
    estado:{
        type: Boolean,
        required: true,
        default: true
    },
    imgURL:{
        type: String,
        required: false
    },
    pregunta:{
        type: String,
        required: [true, 'La pregunta es requerida'],
    },
    respuesta:{
        type: String,
        required: [true, 'La respuesta es requerida'],
    },
    seguidores:[{type:Schema.Types.ObjectId, ref:'user'}],
    seguidos:[{type:Schema.Types.ObjectId, ref:'user'}],
    role:{
        // type: Schema.Types.ObjectId,
        // ref:'role',
        // default: "60a315056baf330ba4d6894c"
        type: String,
        default: "USER_ROLE"
    },
    //Decidí ya no utilizarlo por que basta con poner el id del usuario en el schema post 
    // posts:[{type:Schema.Types.ObjectId, ref:'post'}],
})

UserSchema.methods.toJSON = function() {
    const {__v, password, _id, respuesta, ...usuario} = this.toObject()
    usuario.uid = _id;
    return usuario;
}

module.exports = model('user', UserSchema)