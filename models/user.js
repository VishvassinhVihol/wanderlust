//user model for authentication and authorization (day 50)

const mongoose = require('mongoose')
const Schema = new mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

//user schema
const userSchema =  new mongoose.Schema({
    email:{
        type:String,
        required:true
    }

    //now we have two fields to add
    //1.username
    //2.password
    //password-local-mongoose automaticaly aa banne field add kari deshe bhale tame schema ma define kari hoy ke nai
    //You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User',userSchema)