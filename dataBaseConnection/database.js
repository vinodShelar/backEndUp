const mongoose = require("mongoose");

const URI = "mongodb+srv://Vinod:Vinod@123@cluster0.1wsqpoy.mongodb.net/?retryWrites=true&w=majority";
let uri = "mongodb+srv://Vinod:Vinod%40123@cluster0.1wsqpoy.mongodb.net/users"


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

async function run() {
  try {
    await connectDb();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    mongoose.connection.close();
  }
}

run().catch(console.dir);

module.exports = connectDb;
