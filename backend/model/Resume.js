const mongoose=require('mongoose')

const resumeSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    skills:{
        type:[String],
        required:true
    },
    education:{
        type:String,
        required:true
    },
    resume:{
        type:String,
        required:true
    },
    validated:{
        type:Boolean,
        default:false
    }
})

const Resume=mongoose.model("Resume",resumeSchema)
mongoose.connect('mongodb://localhost:27017');
module.exports = Resume