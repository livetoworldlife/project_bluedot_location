//163- using multer to save file to backend
// https://github.com/expressjs/multer

const multer = require('multer');
const uuid = require('uuid').v1;
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg'
};

const fileUpload = multer
  (
    {
      limits: 500000,
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'uploads/images');
        },
        filename: (req, file, cb) => {
          const ext = MIME_TYPE_MAP[file.mimetype];
          cb(null, uuid() + '.' + ext);
        }
      }),
      fileFilter: (req, file, cb) => {                                // 164- filtering images on backend
        const isValid = !!MIME_TYPE_MAP[file.mimetype];               // either true or false stored
        let error = isValid ? null : new Error('Invalid mime type! ');
        cb(error, isValid);
      }
    }
  );



module.exports = fileUpload;