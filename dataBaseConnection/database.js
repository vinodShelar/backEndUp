const mongoose=require("mongoose");

const connectDb=async()=>{
    try {
        const conn=mongoose.connect(`mongodb://127.0.0.1:27017/upForce`);
        console.log(`Database connected Successfully ${(await conn).connection.host}`)
    } catch (error) {
        console.log(`Error in Connecting Database ${error.message}`);
        process.exit(1);
    }
}

module.exports=connectDb;