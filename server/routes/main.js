const express = require('express');
const route = express.Router();
const Post = require('../model/Post');

route.get('',async(req,res) => {
    const locals={
        title:"Index",
        description:"NodeJs Blog desc."
    }

    try{
        const data = await Post.find();
        res.render('index', { url: req.originalUrl, locals, data }); //url parametresini view'e sorgu için gönderiyoruz
    }catch(error){
        console.log(error);
    }
})

route.get('/about',(req,res) => {
    const locals={
        title:"About",
        description:"NodeJs Blog desc."
    }
    res.render('about', { url: req.originalUrl, locals }); //
})

route.get('/post/:id',async(req,res)=>{
    try{
        const locals={
            title:"Post",
            description:"NodeJs Blog desc."
        }

        const slug = req.params.id;
        const post = await Post.findById( {_id: slug} );
        res.render('post',{url: req.originalUrl, locals, post});
    }catch(error){
        console.log(error);
    }
})

module.exports = route;