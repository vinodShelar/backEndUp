const multer =require('multer');

const upload = multer({
    limits: {
      fileSize: 1024 * 1024 * 10,
    },
    fileFilter: function (req, file, done) {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "video/mp4"
      ) {
        done(null, true);
      } else {
        let newError = new Error("File type is incorrect");
        newError.name = "MulterError";
        done(newError, false);
      }
    },
  });

module.exports=upload;