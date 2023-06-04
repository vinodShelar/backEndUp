const express = require("express");
const router = express.Router();
const user=require('./users/users');
const upload = require("./middleWear/upload");

router.use("/user", upload.single("profilePic"), user);


module.exports = router;
