const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const mongoConnect=require("./util/database").mongoConnect;
const mangoose =require("mongoose")
// const User=require("./models/user")

const errorController = require('./controllers/error');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { rmSync } = require('fs');
const { default: mongoose } = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

// app.use(async(req,res,next)=>{
//    const user=await User.findUserById("679a5b08e28b2233e0cc68ef");
//    req.user=new User(user._id,user.name,user.email,user.cart);
//    next();
// })

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// mongoConnect(()=>{
//    app.listen(3000)
// })

mongoose.connect('mongodb+srv://suvransu:rinku@cluster0.kgx79.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'
).then(result=>{
  app.listen(3000)
}).catch(err=>{
    console.log(err)
})



