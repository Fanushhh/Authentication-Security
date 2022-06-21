//jshint esversion:6

require("dotenv").config();
//////////////Require Mongoose & connect to Mongoose localhost database //////
const mongoose =  require("mongoose");
const encrypt = require("mongoose-encryption");

//////////////Require express & Use express ////////////////////////
const express = require("express");
const app = express();
console.log(process.env.SECRET);
//////////////Require body-parser & Use body-parser ////////////////////////
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//////////////Require EJS & Use EJS ////////////////////////
const ejs = require("ejs");
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
////////////////User Schema //////////////////////////////

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema );


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register",function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username ,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({username: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser.password === password){
        res.render("secrets");
        console.log(foundUser.password);
      }else{
        console.log("There is no user with those credentials.");
        res.render("register");
      }
    }
  });
})

app.listen(3000, function(){
  console.log("Server listening on PORT 3000.");
});
