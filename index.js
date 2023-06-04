const express = require("express");
const app = express();
const body_parser = require("body-parser");
app.use(body_parser.json());
const cors = require("cors");
app.use(cors());

const connectDb = require("./dataBaseConnection/database");
const router = require("./Route");

connectDb()
  .then(() => {
    console.log("connected to database successfully");
  })
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", router);

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
