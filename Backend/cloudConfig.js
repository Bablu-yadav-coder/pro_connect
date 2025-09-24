import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary";

import multer from "multer";


cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET, 
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'linkedIn_DEV',
    allowed_formats : ["png", "jpg", "jpeg", 'avif']
  },
});


const uploads = multer({ storage : storage});



export  {
    cloudinary,
    uploads
}





// cloudConfig.js
// import dotenv from "dotenv";
// dotenv.config();

// import cloudinary from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "linkedIn_DEV",
//     allowed_formats: ["png", "jpg", "jpeg", "avif"], // fixed typo 'aivf' -> 'avif'
//   },
// });

// export { cloudinary, storage };
