const express = require('express');
const route = express.Router();
const Post = require('../model/Post');
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminlayout = '../views/layouts/admin/main'; //Admin Layout
const jwtSecret = "mySecretBlog"; //Token'i şifreler

//MIDDLEWARE
const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token; //Tokeni request ile çeker
    if(!token){
        res.status(409).json({message: "Unauthorized"});
    }

    try{
        const decode = jwt.verify(token,jwtSecret); //Doğrular
        req.userId = decode.userId;
        next();
    }
    catch(error){
        console.log(error);
    }
};

route.get('/admin',async(req,res) => {
    const locals={
        title:"Admin Login",
        description:"NodeJs Blog desc."
    }

    try{
        res.render('admin/auth', { url: req.originalUrl, locals, layout: adminlayout}); //url parametresini view'e sorgu için gönderiyoruz
    }catch(error){
        console.log(error);
    }
})

route.get('/admin/register',async(req,res) => {
    const locals={
        title:"Admin Register",
        description:"NodeJs Blog desc."
    }

    try{
        res.render('admin/register', { url: req.originalUrl, locals, layout: adminlayout}); //url parametresini view'e sorgu için gönderiyoruz
    }catch(error){
        console.log(error);
    }
})

route.post('/admin-action',async(req,res)=>{
    try{
        const {username,password} = req.body;

        const user = await User.findOne({username : username});

        if(!user){
            res.status(404).json({message: "Admin not found"});
        }

        if(!bcrypt.compare(password,user.password)){
            res.status(409).json({message:"Password is wrong"});
        }
        
        const userId = user._id;

        const token = jwt.sign({userId}, jwtSecret); //Token oluşturma.

        res.cookie('token',token, {httpOnly:true}); //tokeni res ile gönderirrr

        res.redirect("/admin/index");

    }catch(error){
        console.log(error);
    }
})

route.post('/admin/register-action',async(req,res)=>{
    try{
        const {username,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);

        try{
            
            const user = await User.create({username : username, password:hashedPassword});
            if(user){
                res.redirect("/admin");
            }
        }
        catch(error){
            if(error.status === 1100){
                res.status(409).json({message:"admin already created."});
            }
            res.status(500).json({message:"Initial server error"});
        }
    }catch(error){
        console.log(error);
    }
})

route.get('/admin/index',authMiddleware,async(req,res) => {
    const locals={
        title:"Admin Panel",
        description:"NodeJs Blog desc."
    }

    try{
        const data = await Post.find();
        res.render('admin/index', { url: req.originalUrl, locals, layout: adminlayout, data}); //url parametresini view'e sorgu için gönderiyoruz
    }catch(error){
        console.log(error);
    }
})

//POST ROUTES
route.get('/create/post',authMiddleware,async(req,res) => {
    const locals={
        title:"Create Post",
        description:"NodeJs Blog desc."
    }

    try{
        res.render('admin/post/create', { url: req.originalUrl, locals, layout: adminlayout}); //url parametresini view'e sorgu için gönderiyoruz
    }catch(error){
        console.log(error);
    }
})

route.post('/create/post-action',authMiddleware,async(req,res) => {
    try{
        const {title,body} = req.body;

        try{
            const post = await Post.create({title:title,body:body});
            //res.status(200).json({message:"Post created!!"});
            res.redirect('/admin/index');
        }
        catch(error){
            res.status(500).json({message:"Error!!"});
        }
    }
    catch(error){
        console.log(error)
    }
})

route.get('/edit/post/:id',authMiddleware,async(req,res) => {
    const locals={
        title:"Edit Post",
        description:"NodeJs Blog desc."
    }

    try{
        const data = await Post.findOne({_id:req.params.id});
        res.render('admin/post/edit', { url: req.originalUrl, locals, layout: adminlayout,data}); //url parametresini view'e sorgu için gönderiyoruz
    }catch(error){
        console.log(error);
    }
})

route.put('/edit/post-action/:id',authMiddleware,async(req,res) => {
    try{
        try{
            const data = await Post.findByIdAndUpdate(req.params.id,{
                title: req.body.title,
                body: req.body.body,
                updatedAt: Date.now(),
            });
            //res.status(200).json({message:"Post basariyla guncellendi."});
            res.redirect('/admin/index');
        }
        catch(error){
            res.status(500).json({message:"Hatali."});
        }
        
    }catch(error){
        console.log(error);
    }
})

route.delete('/delete-post/:id', authMiddleware, async(req,res)=>{
    try{
        await Post.findByIdAndDelete(req.params.id);
        res.redirect("/admin/index");
    }
    catch(error){
        console.log(error);
    }
})

route.get('/logout',async(req,res)=>{
    res.clearCookie('token');
    res.redirect('/admin');
})


module.exports = route;