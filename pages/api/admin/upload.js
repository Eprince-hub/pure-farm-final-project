import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import nextConnect from 'next-connect';
import streamifier from 'streamifier';
import { isAdmin, isAuth } from '../../../utils/auth';
import { onError } from '../../../utils/error';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect({ onError });

const upload = multer();

// handing the file upload to cloudinary,
handler.use(isAuth, isAdmin, upload.single('file')).post(async (req, res) => {
  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        // settings for the image like background removal etc
        {
          background_removal: 'cloudinary_ai', // worked

          transformation: [
            // need more testing
            { width: 300, crop: 'scale' },
            { effect: 'shadow:50', x: 10, y: 10, color: '#465d6d' },
            { format: 'png' },
          ],

          /*  transformation: [
            // need more testing
            { width: 300, crop: 'scale' },
            { effect: 'shadow:50', x: 10, y: 10 },
          ], */
        },

        // without the above argument, the image will remain unchanged

        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  const result = await streamUpload(req);

  res.send(result);
});

export default handler;
