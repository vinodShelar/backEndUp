const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
    },
    location:{
        type:String
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;