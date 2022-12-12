const multer = require("multer");
var path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tmp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
   const ext = path.extname(file.originalname);
   const allowed = [".docx", ".pdf", ".doc", ".txt"];
   if (allowed.includes(ext)) {
     callback(null, true);
   } else {
     callback(null, false); // handle error in middleware, not here
   }
};
module.exports = multer({
  storage: storage,
  limits: { fileSize: 500000 },
  fileFilter
});
