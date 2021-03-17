const multer = require('multer'); // Multer is middleware for Express and Node.js that makes it easy to handle this multipart/form-data when your users upload files. 
const uidSafe = require('uid-safe');
const path = require('path');


const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

module.exports.uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});