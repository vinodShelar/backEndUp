const express = require("express");
const user = express.Router();
const User = require("../model/user");
const mongoose = require("mongoose");

const AWS = require("aws-sdk");

const awsConfig = {
  accessKeyId: "AKIA5IRU7DUSDOG5QJFZ",
  secretAccessKey: "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",
  region: "ap-south-1",
};

const S3 = new AWS.S3(awsConfig);

const uploadToS3 = (fileData) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: "mubucketcreatedfromsdkforblog",
      Key: `${Date.now().toString()}.jpg`,
      Body: fileData,
    };
    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log(data);
      return resolve(data);
    });
  });
};

//User registration

user.post("/register", (req, res) => {
  const userData = req.body;
  User.findOne({
    $or: [{ email: userData.email }, { phone: userData.phone }],
  })
    .then((existingUser) => {
      if (existingUser) {
        res.status(409).json({
          error: "User already exists with the provided email or phone number",
        });
      } else {
        if (req.file) {
          uploadToS3(req.file.buffer)
            .then((imageUrl) => {
              userData.profilePic = imageUrl.Location; 
              saveUser(userData)
                .then(() => {
                  res
                    .status(200)
                    .json({ message: "User registered successfully" });
                })
                .catch((error) => {
                  res.status(500).json({
                    error: "Failed to register user",
                    details: error.message,
                  });
                });
            })
            .catch((error) => {
              res
                .status(500)
                .json({ error: "Failed to upload profile picture" });
            });
        } else {
          saveUser(userData)
            .then(() => {
              res.status(200).json({
                message: "User registered successfully",
                status: "success",
              });
            })
            .catch((error) => {
              res.status(500).json({
                error: "Failed to register user",
                details: error.message,
              });
            });
        }
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "An error occurred while checking user existence" });
    });
});

const saveUser = (userData) => {
  return new Promise((resolve, reject) => {
    const newUser = new User(userData);

    newUser
      .save()
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//To get single user

user.get("/getSingleuser/:id", (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch user" });
    });
});

//To get all users

user.get("/getAllusers", (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((error) => {
      console.error("Failed to fetch users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    });
});

//User details updation

user.put("/update/:id", (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  User.findByIdAndUpdate(userId, updatedData, { new: true })
    .then(async (updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

   
      if (req.file) {
        try {
          const imageUrl = await uploadToS3(req.file.buffer);
          updatedUser.profilePic = imageUrl.Location; 
          await updatedUser.save();
        } catch (error) {
          return res
            .status(500)
            .json({ error: "Failed to update profile picture" });
        }
      }

      res.status(200).json({
        message: "User details updated successfully",
        user: updatedUser,
      });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to update user details" });
    });
});

//Delete User
user.delete("/deleteuser/:id", (req, res) => {
  const userId = req.params.id;

  User.findByIdAndRemove(userId)
    .then((deletedUser) => {
      if (deletedUser) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to delete user" });
    });
});

//to search users in the given lists

user.get("/search", (req, res) => {
  const searchQuery = req.query.q;
  const searchTerms = searchQuery.split(" ");
  const searchConditions = [];
  const searchPatterns = searchTerms.map((term) => new RegExp(term, "i"));
  searchPatterns.forEach((pattern) => {
    searchConditions.push(
      { firstName: pattern },
      { lastName: pattern },
      { email: pattern },
      { phone: pattern },
      { location: pattern }
    );
  });

  User.find({ $or: searchConditions })
    .then((users) => {
      res.status(200).json({ users });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to search users" });
    });
});

module.exports = user;
