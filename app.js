//jshint esversion:6
require('dotenv').config(); ////third level of encryption, we have to put it on the top
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption"); //second level of encryption

const app= express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/userDB');
//first level of encryption
// const userSchema = {
//     email: String,
//     password: String
// }

//second level of encryption
// const userSchema = new mongoose.Schema({
//     email: String,
//     password: String
// });
// const secret = "Thisisourlittlesecret."
// userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']}); //['password', 'username] with multiple field//you can read through Plugins in mongoose documents to understand more about it.
//end of second level encrytion 

//third level of encryption
 const userSchema = new mongoose.Schema({
     email: String,
     password: String
 });
 userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']}); //['password', 'username] with multiple field//you can read through Plugins in mongoose documents to understand more about it.
//end of second level encrytion 

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home")
});
app.get("/login", function(req, res){
    res.render("login")
});
app.get("/register", function(req, res){
    res.render("register")
});
app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save().then((success)=>{ //so when you say: save(). encrypt will encrypt your password field
        if(!success){
            console.log(err)
        }else{
            res.render("secrets") //we don't have the app.get("/secrets") because we just want to render it after logging in
        }
    })
});

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}).then((foundUser, err)=>{ //when we try to find our document based of the email that the user has entered, Mongoose encrypt will decrypt our password to be able to check it in form and log in.
        if(err){
            console.log(err);
        }else{
            if(foundUser.password === password){
                res.render('secrets')
            }
        }
    })
});


app.listen(3000, function(){
    console.log("Server is running on port 3000");
})
