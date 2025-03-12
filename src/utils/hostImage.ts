import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import multer from "multer"
import config from '../config';
 

//   Configuration
cloudinary.config({
  cloud_name: config.cloudinary_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinary = (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName },
      function (error, result) {
        if (error) {
          reject(error);
        }
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Upload result is undefined"));
        }
        // delete a file asynchronously
        fs.unlink(path, (err) => {
          if (err) {
            console.log(err);
          } else {
            // console.log('File is deleted.');
          }
        });
      },
    );
  });
};



// ___________________________
//******For Development******* 
// ___________________________


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, process.cwd() + '/uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix);
//   },
// });

// export const upload = multer({ storage: storage });



// ___________________________
//******For Production******** 
// ___________________________

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "/tmp/";

    // Ensure /tmp/ directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});


export const upload = multer({ storage: storage });
