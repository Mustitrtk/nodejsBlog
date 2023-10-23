require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo');
const connectDb = require("./server/config/db"); //connection require
const session = require('express-session');
const methodOverride = require("method-override");

const app = express();
const PORT = 5000 || process.env.PORT;

connectDb(); //Connection to DB

app.use(express.static('public'));
//Templateing Engine
app.use(expressLayouts);

app.set('layout','./layouts/main');
app.set('view engine','ejs');

//Token 
app.use(cookieParser());
app.use(session({
    secret: "keyboard cat",
    resave:false,
    saveUninitialized:true,
    store:mongoStore.create({
        mongoUrl:process.env.MONGODB_URI
    }),
}));


app.use(methodOverride('_method'));

//Veri aktarımı için
app.use(express.urlencoded());

app.use('/',require('./server/routes/main')); //hangi route u kullanıcağına dair yönlendirme
app.use('/',require('./server/routes/admin'));

app.get('/asda',(req,res)=>{ //öylesine kendim oluşturdum
    res.send('asdas');
    res.end();
});

app.listen(PORT, ()=>{
    console.log(`App listening on port ${PORT}`);
});