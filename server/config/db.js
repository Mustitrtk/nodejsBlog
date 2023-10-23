const mongoose = require("mongoose");
const postSeeder = require("../seeder/postSeeder")

const connectDb = async()=> {
    try{
        mongoose.set('strictQuery',false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected ${conn.connection.host}`);

        //await postSeeder();
        //console.log('seeder completed')
    }catch(error){
        console.log(error);
    }
}

module.exports = connectDb;