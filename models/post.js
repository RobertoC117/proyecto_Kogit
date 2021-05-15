const { Schema, model } = require('mongoose')

const PostSchema = new Schema({
    titulo:{
        type: String,
        required: [true, 'El titulo es requerido']
    },
    texto:{
        type: String,
        required: [true, 'El cuerpo de la publicacion es requerido']
    },
    likes:{
        type:Number,
        default: 0
    },
    autor:{
        type: Schema.Types.ObjectId,
        ref:'user',
        required: [true, 'El autor es requerido']
    },
    fecha:{
        type: Date,
        default: Date.now
    },
    lenguaje:{
        type: String,
        required: [true, 'El lenguaje es requerido']
    },
    tags:[
        {type: String}
    ],
    estado:{
        type: Boolean,
        required: true,
        default: true
    },
    comentarios:[
        {
            usuario:{
                type:Schema.Types.ObjectId, 
                ref:'user'
            }, 
            fecha:{
                type: Date, 
                default: Date.now
            },
            texto: {type: String}
        }
    ],
    users_likes:[{type:Schema.Types.ObjectId, ref:'user'}]
})

PostSchema.methods.toJSON = function() {
    const {__v, _id, estado, ...post} = this.toObject()
    post.uid = _id;
    return post;
}

module.exports = model('post', PostSchema)