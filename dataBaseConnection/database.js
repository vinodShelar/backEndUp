const mongoose = require("mongoose");

let uri = "mongodb+srv://Vinod:Vinod%40123@cluster0.1wsqpoy.mongodb.net/upForce"


const connectDb = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error(`Error in connecting to the database: ${error}`);
    process.exit(1);
  }
};


module.exports = connectDb;
