const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Accepted file types
const fileFilter = (req, file, cb) => {
  cb(null, true); //all for now

  //   const allowedTypes=['application/pdf','image/jpeg','image/png'];
  //   if(allowedTypes.includes(file.mimetype)){
  //     cb(null,true);
  //   }else{
  //     cb(new Error('only PNG,JPEG and PDF are allowed'),false);
  //   }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
